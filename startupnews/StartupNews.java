package skills.startupnews;

import org.json.JSONArray;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * AutoClaw Startup News Skill — fetch & format for LLM
 * Aggregates startup/tech news from 5 sources.
 * No external dependencies. Android built-in APIs only.
 *
 * Sources (web scrape):
 *   tm = TechMeme (techmeme.com) — top tech headlines
 *   tc = TechCrunch (techcrunch.com) — startup/funding news
 *
 * Sources (JSON API):
 *   hn = Hacker News (Algolia API) — top stories by points
 *
 * Sources (RSS):
 *   vb = VentureBeat (RSS feed)
 *   cb = Crunchbase News (RSS feed)
 *
 * Usage:
 *   StartupNews news = new StartupNews();
 *   news.fetchAll(new StartupNews.Callback() { ... });
 *   news.fetchAll(5, new String[]{"hn","tc"}, new StartupNews.Callback() { ... });
 */
public class StartupNews {

    private static final int TIMEOUT = 12000;
    private static final String UA = "AutoClaw-StartupNews/1.0";
    private static final int MAX_ARTICLES = 10;

    private final ExecutorService executor = Executors.newCachedThreadPool();

    // ── Callback ──────────────────────────────────────────────

    public interface Callback {
        void onSuccess(NewsResult result);
        void onError(String error);
    }

    // ── Data Models ───────────────────────────────────────────

    public static class Article {
        public String source;
        public String title;
        public String url;
        public String description;
        public String published;
        public String author;
        public int points;
        public int comments;
        public String error;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                if (error != null) {
                    o.put("source", source); o.put("error", error); return o;
                }
                o.put("source", source); o.put("title", title); o.put("url", url);
                if (description != null) o.put("description", description);
                if (published != null) o.put("published", published);
                if (author != null) o.put("author", author);
                if (points > 0) o.put("points", points);
                if (comments > 0) o.put("comments", comments);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class NewsResult {
        public Map<String, List<Article>> results;
        public String briefSummary;
        public String detailedSummary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                for (Map.Entry<String, List<Article>> entry : results.entrySet()) {
                    JSONArray arr = new JSONArray();
                    for (Article a : entry.getValue()) arr.put(a.toJson());
                    o.put(entry.getKey(), arr);
                }
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    // ── Source Config ─────────────────────────────────────────

    private static final Map<String, String> SOURCE_NAMES = new LinkedHashMap<>();
    static {
        SOURCE_NAMES.put("tm", "TechMeme");
        SOURCE_NAMES.put("tc", "TechCrunch");
        SOURCE_NAMES.put("hn", "Hacker News");
        SOURCE_NAMES.put("vb", "VentureBeat");
        SOURCE_NAMES.put("cb", "Crunchbase News");
    }

    // ── HTML Stripping ────────────────────────────────────────

    private static String stripHtml(String s) {
        if (s == null || s.isEmpty()) return "";
        return s.replaceAll("<[^>]*>", "").replaceAll("\\s+", " ").trim();
    }

    private static String clean(String s) {
        if (s == null || s.isEmpty()) return null;
        s = stripHtml(s);
        return s.length() > 500 ? s.substring(0, 500) : s;
    }

    // ── HTTP ──────────────────────────────────────────────────

    private static String httpGet(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("User-Agent", UA);
        conn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        conn.setConnectTimeout(TIMEOUT);
        conn.setReadTimeout(TIMEOUT);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line).append("\n");
            return sb.toString();
        } finally {
            conn.disconnect();
        }
    }

    // ── Source: Hacker News (JSON API) ─────────────────────────

    private static List<Article> fetchHackerNews(int n) {
        List<Article> articles = new ArrayList<>();
        try {
            String json = httpGet("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=" + n);
            JSONObject data = new JSONObject(json);
            JSONArray hits = data.getJSONArray("hits");

            for (int i = 0; i < Math.min(hits.length(), n); i++) {
                JSONObject hit = hits.getJSONObject(i);
                Article a = new Article();
                a.source = "Hacker News";
                a.title = hit.optString("title", "");
                a.url = hit.optString("url", "");
                if (a.url.isEmpty()) {
                    a.url = "https://news.ycombinator.com/item?id=" + hit.optString("objectID", "");
                }
                a.points = hit.optInt("points", 0);
                a.comments = hit.optInt("num_comments", 0);
                articles.add(a);
            }
        } catch (Exception e) {
            Article err = new Article();
            err.source = "Hacker News";
            err.error = e.getMessage();
            articles.add(err);
        }
        return articles;
    }

    // ── Source: TechMeme (HTML scrape) ─────────────────────────

    private static List<Article> fetchTechMeme(int n) {
        List<Article> articles = new ArrayList<>();
        try {
            String html = httpGet("https://techmeme.com/");
            // Extract links with class "ourh" — these are the main headline links
            Pattern pattern = Pattern.compile("<a[^>]+class=\"[^\"]*ourh[^\"]*\"[^>]+href=\"([^\"]+)\"[^>]*>([^<]+)</a>");
            Matcher matcher = pattern.matcher(html);
            Set<String> seen = new HashSet<>();

            while (matcher.find() && articles.size() < n) {
                String href = matcher.group(1);
                String title = stripHtml(matcher.group(2)).trim();
                if (!title.isEmpty() && !seen.contains(title)) {
                    seen.add(title);
                    Article a = new Article();
                    a.source = "TechMeme";
                    a.title = title;
                    a.url = href;
                    articles.add(a);
                }
            }

            // Try alternate pattern: href before class
            if (articles.isEmpty()) {
                Pattern alt = Pattern.compile("<a[^>]+href=\"([^\"]+)\"[^>]+class=\"[^\"]*ourh[^\"]*\"[^>]*>([^<]+)</a>");
                Matcher altMatcher = alt.matcher(html);
                while (altMatcher.find() && articles.size() < n) {
                    String href = altMatcher.group(1);
                    String title = stripHtml(altMatcher.group(2)).trim();
                    if (!title.isEmpty() && !seen.contains(title)) {
                        seen.add(title);
                        Article a = new Article();
                        a.source = "TechMeme";
                        a.title = title;
                        a.url = href;
                        articles.add(a);
                    }
                }
            }
        } catch (Exception e) {
            Article err = new Article();
            err.source = "TechMeme";
            err.error = e.getMessage();
            articles.add(err);
        }
        return articles;
    }

    // ── Source: TechCrunch (HTML scrape with RSS fallback) ─────

    private static List<Article> fetchTechCrunch(int n) {
        List<Article> articles = new ArrayList<>();
        try {
            String html = httpGet("https://techcrunch.com/");
            // Look for article titles in h2/h3 tags with links to techcrunch.com
            Pattern pattern = Pattern.compile(
                "<h[23][^>]*class=\"[^\"]*(?:post-block__title|mini-card__title|river)[^\"]*\"[^>]*>\\s*" +
                "<a[^>]+href=\"(https?://techcrunch\\.com[^\"]+)\"[^>]*>([^<]+)</a>");
            Matcher matcher = pattern.matcher(html);
            Set<String> seen = new HashSet<>();

            while (matcher.find() && articles.size() < n) {
                String href = matcher.group(1);
                String title = stripHtml(matcher.group(2)).trim();
                if (!title.isEmpty() && !seen.contains(title)) {
                    seen.add(title);
                    Article a = new Article();
                    a.source = "TechCrunch";
                    a.title = title;
                    a.url = href;
                    articles.add(a);
                }
            }
        } catch (Exception ignored) {
        }

        // Fallback to RSS if scraping yielded nothing
        if (articles.isEmpty()) {
            try {
                articles = fetchRss("https://techcrunch.com/feed/", "TechCrunch", n);
            } catch (Exception e) {
                Article err = new Article();
                err.source = "TechCrunch";
                err.error = e.getMessage();
                articles.add(err);
            }
        }
        return articles;
    }

    // ── RSS Parser ────────────────────────────────────────────

    private static List<Article> fetchRss(String feedUrl, String sourceName, int n) {
        List<Article> articles = new ArrayList<>();
        try {
            String xml = httpGet(feedUrl);
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            factory.setNamespaceAware(true);
            XmlPullParser parser = factory.newPullParser();
            parser.setInput(new StringReader(xml));

            boolean inItem = false;
            String currentTag = "";
            String title = "", link = "", description = "", pubDate = "", author = "";

            int eventType = parser.getEventType();
            while (eventType != XmlPullParser.END_DOCUMENT) {
                if (eventType == XmlPullParser.START_TAG) {
                    String tag = parser.getName();
                    if ("item".equals(tag) || "entry".equals(tag)) {
                        inItem = true;
                        title = ""; link = ""; description = ""; pubDate = ""; author = "";
                    }
                    if (inItem) {
                        currentTag = tag;
                        if ("link".equals(tag)) {
                            String href = parser.getAttributeValue(null, "href");
                            if (href != null && !href.isEmpty()) link = href;
                        }
                    }
                } else if (eventType == XmlPullParser.TEXT && inItem) {
                    String text = parser.getText();
                    if (text != null) text = text.trim();
                    if (text != null && !text.isEmpty()) {
                        switch (currentTag) {
                            case "title": title += text; break;
                            case "link": if (link.isEmpty()) link = text; break;
                            case "description": description += text; break;
                            case "pubDate": pubDate += text; break;
                            case "creator": author += text; break;
                            case "encoded":
                                String cleaned = clean(text);
                                if (cleaned != null && cleaned.length() > description.length())
                                    description = cleaned;
                                break;
                        }
                    }
                } else if (eventType == XmlPullParser.END_TAG) {
                    String tag = parser.getName();
                    if (("item".equals(tag) || "entry".equals(tag)) && inItem) {
                        inItem = false;
                        title = title.trim();
                        if (!title.isEmpty() && articles.size() < n) {
                            Article a = new Article();
                            a.source = sourceName;
                            a.title = title;
                            a.url = link.trim();
                            String desc = clean(description);
                            if (desc != null && !desc.isEmpty())
                                a.description = desc.length() > 300 ? desc.substring(0, 300) : desc;
                            if (!pubDate.trim().isEmpty()) a.published = pubDate.trim();
                            if (!author.trim().isEmpty()) a.author = author.trim();
                            articles.add(a);
                        }
                    }
                    if (tag.equals(currentTag)) currentTag = "";
                }
                eventType = parser.next();
            }
        } catch (Exception e) {
            Article err = new Article();
            err.source = sourceName;
            err.error = e.getMessage();
            articles.add(err);
        }
        return articles;
    }

    // ── Formatters ────────────────────────────────────────────

    private static String fmtBrief(Map<String, List<Article>> allResults) {
        StringBuilder sb = new StringBuilder();
        int idx = 1;
        for (Map.Entry<String, List<Article>> entry : allResults.entrySet()) {
            for (Article a : entry.getValue()) {
                if (a.error != null || a.title == null || a.title.isEmpty()) continue;
                sb.append(idx).append(". [").append(entry.getKey()).append("] ").append(a.title);
                if (a.description != null) {
                    String desc = a.description.length() > 150 ? a.description.substring(0, 150) : a.description;
                    sb.append(" -- ").append(desc);
                }
                sb.append("\n");
                idx++;
            }
        }
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(new Date());
        return "Startup & Tech News (" + now + ") - " + (idx - 1) + " articles\n" + sb;
    }

    private static String fmtDetailed(Map<String, List<Article>> allResults) {
        StringBuilder sb = new StringBuilder();
        int total = 0;
        for (Map.Entry<String, List<Article>> entry : allResults.entrySet()) {
            List<Article> valid = new ArrayList<>();
            List<Article> errors = new ArrayList<>();
            for (Article a : entry.getValue()) {
                if (a.error != null) errors.add(a);
                else if (a.title != null && !a.title.isEmpty()) valid.add(a);
            }
            sb.append("\n## ").append(entry.getKey()).append(" (").append(valid.size()).append(" articles)\n");
            for (Article e : errors) sb.append("  [error: ").append(e.error).append("]\n");
            int i = 1;
            for (Article a : valid) {
                sb.append("  ").append(i).append(". **").append(a.title).append("**\n");
                if (a.url != null && !a.url.isEmpty()) sb.append("     ").append(a.url).append("\n");
                if (a.description != null) {
                    String desc = a.description.length() > 200 ? a.description.substring(0, 200) : a.description;
                    sb.append("     ").append(desc).append("\n");
                }
                if (a.points > 0) sb.append("     [").append(a.points).append(" pts, ").append(a.comments).append(" comments]\n");
                i++; total++;
            }
        }
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(new Date());
        return "# Startup & Tech News - " + now + "\n**" + total + " articles from " + allResults.size() + " sources**\n" + sb;
    }

    // ── Public API ────────────────────────────────────────────

    /** Fetch all sources, 10 articles each. */
    public void fetchAll(Callback callback) {
        fetchAll(MAX_ARTICLES, null, callback);
    }

    /** Fetch selected sources with custom count. Pass null for sources to fetch all. */
    public void fetchAll(int count, String[] sources, Callback callback) {
        executor.execute(() -> {
            try {
                Map<String, List<Article>> results = new LinkedHashMap<>();
                String[] targets = sources != null ? sources : SOURCE_NAMES.keySet().toArray(new String[0]);

                for (String key : targets) {
                    String name = SOURCE_NAMES.get(key);
                    if (name == null) continue;

                    switch (key) {
                        case "tm": results.put(name, fetchTechMeme(count)); break;
                        case "tc": results.put(name, fetchTechCrunch(count)); break;
                        case "hn": results.put(name, fetchHackerNews(count)); break;
                        case "vb": results.put(name, fetchRss("https://venturebeat.com/feed/", name, count)); break;
                        case "cb": results.put(name, fetchRss("https://news.crunchbase.com/feed/", name, count)); break;
                    }
                }

                NewsResult result = new NewsResult();
                result.results = results;
                result.briefSummary = fmtBrief(results);
                result.detailedSummary = fmtDetailed(results);
                callback.onSuccess(result);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Fetch a single source by code (tm, tc, hn, vb, cb). */
    public void fetchSource(String code, int count, Callback callback) {
        fetchAll(count, new String[]{code}, callback);
    }

    /** Shutdown the executor when done. */
    public void shutdown() {
        executor.shutdown();
    }
}

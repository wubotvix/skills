package skills.worldnews;

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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * AutoClaw Top-10 World News Skill — fetch & format for LLM
 * Pulls top 10 daily world news from 5 major international sources.
 * No external dependencies. Android built-in APIs only.
 *
 * Sources:
 *   guardian = The Guardian (JSON API, free)
 *   bbc      = BBC News World (RSS)
 *   aj       = Al Jazeera (RSS)
 *   nyt      = New York Times World (RSS)
 *   fox      = Fox News World (RSS)
 *
 * Usage:
 *   WorldNews news = new WorldNews();
 *   news.fetchAll(new WorldNews.Callback() { ... });
 *   news.fetchAll(5, new String[]{"bbc","nyt"}, new WorldNews.Callback() { ... });
 */
public class WorldNews {

    private static final int TIMEOUT = 12000;
    private static final String UA = "AutoClaw-WorldNews/1.0";
    private static final int DEFAULT_COUNT = 10;

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
        SOURCE_NAMES.put("guardian", "The Guardian");
        SOURCE_NAMES.put("bbc", "BBC News");
        SOURCE_NAMES.put("aj", "Al Jazeera");
        SOURCE_NAMES.put("nyt", "New York Times");
        SOURCE_NAMES.put("fox", "Fox News");
    }

    private static final Map<String, String> RSS_FEEDS = new LinkedHashMap<>();
    static {
        RSS_FEEDS.put("bbc", "https://feeds.bbci.co.uk/news/world/rss.xml");
        RSS_FEEDS.put("aj", "https://www.aljazeera.com/xml/rss/all.xml");
        RSS_FEEDS.put("nyt", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml");
        RSS_FEEDS.put("fox", "https://moxie.foxnews.com/google-publisher/world.xml");
    }

    // ── HTML Stripping ────────────────────────────────────────

    private static String stripHtml(String s) {
        if (s == null || s.isEmpty()) return "";
        return s.replaceAll("<[^>]*>", "").replaceAll("\\s+", " ").trim();
    }

    private static String clean(String s) {
        if (s == null || s.isEmpty()) return null;
        s = stripHtml(s);
        return s.length() > 400 ? s.substring(0, 400) : s;
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

    // ── Guardian JSON API ─────────────────────────────────────

    private static List<Article> fetchGuardian(int n) {
        List<Article> articles = new ArrayList<>();
        try {
            String params = "?section=world&order-by=newest&page-size=" + n
                + "&show-fields=trailText,headline,byline,thumbnail"
                + "&api-key=test";
            String json = httpGet("https://content.guardianapis.com/search" + params);
            JSONObject data = new JSONObject(json);
            JSONArray results = data.getJSONObject("response").getJSONArray("results");

            for (int i = 0; i < Math.min(results.length(), n); i++) {
                JSONObject item = results.getJSONObject(i);
                JSONObject fields = item.optJSONObject("fields");
                if (fields == null) fields = new JSONObject();

                Article a = new Article();
                a.source = "The Guardian";
                a.title = fields.optString("headline", item.optString("webTitle", ""));
                a.url = item.optString("webUrl", "");
                String trail = clean(fields.optString("trailText", ""));
                if (trail != null && !trail.isEmpty()) a.description = trail;
                String byline = fields.optString("byline", "");
                if (!byline.isEmpty()) a.author = byline;
                String pubDate = item.optString("webPublicationDate", "");
                if (!pubDate.isEmpty()) a.published = pubDate;
                articles.add(a);
            }
        } catch (Exception e) {
            Article err = new Article();
            err.source = "The Guardian";
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
        return "Top World News (" + now + ") - " + (idx - 1) + " articles from " + allResults.size() + " sources\n" + sb;
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
                    String desc = a.description.length() > 250 ? a.description.substring(0, 250) : a.description;
                    sb.append("     ").append(desc).append("\n");
                }
                if (a.published != null) sb.append("     Published: ").append(a.published).append("\n");
                i++; total++;
            }
        }
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(new Date());
        return "# Top World News - " + now + "\n**" + total + " articles from " + allResults.size() + " sources**\n" + sb;
    }

    // ── Public API ────────────────────────────────────────────

    /** Fetch all sources, 10 articles each. */
    public void fetchAll(Callback callback) {
        fetchAll(DEFAULT_COUNT, null, callback);
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

                    if ("guardian".equals(key)) {
                        results.put(name, fetchGuardian(count));
                    } else {
                        String feed = RSS_FEEDS.get(key);
                        if (feed != null) {
                            results.put(name, fetchRss(feed, name, count));
                        }
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

    /** Fetch a single source by code (guardian, bbc, aj, nyt, fox). */
    public void fetchSource(String code, int count, Callback callback) {
        fetchAll(count, new String[]{code}, callback);
    }

    /** Shutdown the executor when done. */
    public void shutdown() {
        executor.shutdown();
    }
}

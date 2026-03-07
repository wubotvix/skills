package skills.cntechnews;

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
 * AutoClaw CN Tech News Skill
 * Aggregates top 20 Chinese tech news from 5 sources via RSS.
 * No external dependencies. Android built-in APIs only.
 * Content in Chinese.
 *
 * Sources (RSS):
 *   36kr    = 36氪 (36kr.com/feed)
 *   tmt     = 钛媒体 (tmtpost.com/rss.xml)
 *   ithome  = IT之家 (ithome.com/rss/)
 *   sspai   = 少数派 (sspai.com/feed)
 *   sina    = 新浪科技 (rss.sina.com.cn)
 *
 * Usage:
 *   CNTechNews news = new CNTechNews();
 *   news.fetchAll(new CNTechNews.Callback() { ... });
 *   news.fetchAll(10, new String[]{"36kr","ithome"}, new CNTechNews.Callback() { ... });
 */
public class CNTechNews {

    private static final int TIMEOUT = 15000;
    private static final String UA = "AutoClaw-CNTechNews/1.0";
    private static final int DEFAULT_COUNT = 20;

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
                    o.put("source", source);
                    o.put("error", error);
                    return o;
                }
                o.put("source", source);
                o.put("title", title);
                o.put("url", url);
                if (description != null) o.put("description", description);
                if (published != null) o.put("published", published);
                if (author != null) o.put("author", author);
                return o;
            } catch (Exception e) {
                return new JSONObject();
            }
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
            } catch (Exception e) {
                return new JSONObject();
            }
        }
    }

    // ── Source Config ─────────────────────────────────────────

    private static final Map<String, String> SOURCE_NAMES = new LinkedHashMap<>();
    static {
        SOURCE_NAMES.put("36kr", "36\u6c2a");
        SOURCE_NAMES.put("tmt", "\u949b\u5a92\u4f53");
        SOURCE_NAMES.put("ithome", "IT\u4e4b\u5bb6");
        SOURCE_NAMES.put("sspai", "\u5c11\u6570\u6d3e");
        SOURCE_NAMES.put("sina", "\u65b0\u6d6a\u79d1\u6280");
    }

    private static final Map<String, String> RSS_FEEDS = new LinkedHashMap<>();
    static {
        RSS_FEEDS.put("36kr", "https://36kr.com/feed");
        RSS_FEEDS.put("tmt", "https://www.tmtpost.com/rss.xml");
        RSS_FEEDS.put("ithome", "https://www.ithome.com/rss/");
        RSS_FEEDS.put("sspai", "https://sspai.com/feed");
        RSS_FEEDS.put("sina", "https://rss.sina.com.cn/tech/rollnews.xml");
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
        conn.setRequestProperty("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8");
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
                        title = "";
                        link = "";
                        description = "";
                        pubDate = "";
                        author = "";
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
                            case "title":
                                title += text;
                                break;
                            case "link":
                                if (link.isEmpty()) link = text;
                                break;
                            case "description":
                                description += text;
                                break;
                            case "summary":
                                description += text;
                                break;
                            case "pubDate":
                                pubDate += text;
                                break;
                            case "published":
                                pubDate += text;
                                break;
                            case "updated":
                                if (pubDate.isEmpty()) pubDate += text;
                                break;
                            case "creator":
                                author += text;
                                break;
                            case "author":
                                author += text;
                                break;
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
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.CHINA).format(new Date());
        return "\u4e2d\u56fd\u79d1\u6280\u65b0\u95fb (" + now + ") - " + (idx - 1) + " \u7bc7\u6587\u7ae0\n" + sb;
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
            sb.append("\n## ").append(entry.getKey()).append(" (").append(valid.size()).append(" \u7bc7)\n");
            for (Article e : errors) sb.append("  [\u9519\u8bef: ").append(e.error).append("]\n");
            int i = 1;
            for (Article a : valid) {
                sb.append("  ").append(i).append(". **").append(a.title).append("**\n");
                if (a.url != null && !a.url.isEmpty()) sb.append("     ").append(a.url).append("\n");
                if (a.description != null) {
                    String desc = a.description.length() > 250 ? a.description.substring(0, 250) : a.description;
                    sb.append("     ").append(desc).append("\n");
                }
                if (a.published != null) sb.append("     \u53d1\u5e03: ").append(a.published).append("\n");
                i++;
                total++;
            }
        }
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.CHINA).format(new Date());
        return "# \u4e2d\u56fd\u79d1\u6280\u65b0\u95fb - " + now + "\n**" + total + " \u7bc7\u6587\u7ae0\uff0c\u6765\u81ea " + allResults.size() + " \u4e2a\u6e90**\n" + sb;
    }

    // ── Public API ────────────────────────────────────────────

    /** Fetch all sources, 20 articles each. */
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
                    String feed = RSS_FEEDS.get(key);
                    if (name != null && feed != null) {
                        results.put(name, fetchRss(feed, name, count));
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

    /** Fetch a single source by code (36kr, tmt, ithome, sspai, sina). */
    public void fetchSource(String code, int count, Callback callback) {
        fetchAll(count, new String[]{code}, callback);
    }

    /** Shutdown the executor when done. */
    public void shutdown() {
        executor.shutdown();
    }
}

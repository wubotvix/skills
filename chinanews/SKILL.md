# China News Skill — SKILL.md

**Skill:** China news aggregator — fetch & format for LLM
**Source:** Sina News (rss.sina.com.cn) — 3 sections
**File:** `CNNews.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `XmlPullParser`, `JSONObject`)
**Language:** Chinese (中文)

## What It Does

Fetches top 10 daily China news from 3 Sina News RSS sections. Content in Chinese. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Section | Feed | Coverage |
|------|---------|------|----------|
| `headlines` | 新浪头条 | rss.sina.com.cn/news/marquee/ddt.xml | Top headlines, breaking news |
| `china` | 国内新闻 | rss.sina.com.cn/news/china/china_report.xml | Domestic affairs, politics |
| `society` | 社会新闻 | rss.sina.com.cn/news/society/society_report.xml | Social news, public interest |

All sections are free, no signup or API key needed.

## Android Java Usage

```java
CNNews news = new CNNews();

// Fetch all sections, 10 articles each
news.fetchAll(new CNNews.Callback() {
    @Override
    public void onSuccess(CNNews.NewsResult result) {
        // Brief format — best for LLM input
        Log.d("CNNews", result.briefSummary);

        // Detailed format — with URLs
        Log.d("CNNews", result.detailedSummary);

        // JSON for programmatic use
        Log.d("CNNews", result.toJson().toString(2));

        // Access individual articles
        for (Map.Entry<String, List<CNNews.Article>> entry : result.results.entrySet()) {
            for (CNNews.Article article : entry.getValue()) {
                Log.d("CNNews", article.title + " - " + article.url);
            }
        }
    }
    @Override
    public void onError(String error) {
        Log.e("CNNews", error);
    }
});

// Custom: 5 articles from headlines and china only
news.fetchAll(5, new String[]{"headlines", "china"}, callback);

// Single section
news.fetchSource("society", 10, callback);

// Cleanup
news.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `CNNews.java` | Android Java — async callbacks, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sections, 10 each) |
| `fetchAll(count, sources)` | int, String[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | String, int | `NewsResult` (single section) |

## Design

- **Fetch only** — no LLM dependency
- **Chinese content** — all output in Chinese, including headers and labels (篇文章, 栏目, 错误, 发布)
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Single provider, 3 perspectives** — headlines, domestic, social from Sina News
- **Async** — all network calls on background threads via ExecutorService
- **Higher timeout** — 15s to accommodate Chinese server response times
- **Zero config** — works out of the box, no keys needed

## Requirements

- Android API 21+ (uses `HttpURLConnection`, `org.json`, `XmlPullParser`)
- Internet access

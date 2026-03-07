# US News Skill — SKILL.md

**Skill:** Top US news aggregator — fetch & format for LLM
**Sources:** New York Times (RSS), Fox News (RSS), NPR (RSS)
**File:** `USNews.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `XmlPullParser`, `JSONObject`)

## What It Does

Fetches top 10 daily US news from 3 major American sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `nyt` | New York Times | RSS feed | Center-left, in-depth reporting |
| `fox` | Fox News | RSS feed | Conservative perspective |
| `npr` | NPR | RSS feed | Public radio, balanced |

All 3 sources are free, no signup or API key needed.

## Android Java Usage

```java
USNews news = new USNews();

// Fetch all sources, 10 articles each
news.fetchAll(new USNews.Callback() {
    @Override
    public void onSuccess(USNews.NewsResult result) {
        // Brief format — best for LLM input
        Log.d("USNews", result.briefSummary);

        // Detailed format — with URLs
        Log.d("USNews", result.detailedSummary);

        // JSON for programmatic use
        Log.d("USNews", result.toJson().toString(2));

        // Access individual articles
        for (Map.Entry<String, List<USNews.Article>> entry : result.results.entrySet()) {
            for (USNews.Article article : entry.getValue()) {
                Log.d("USNews", article.title + " - " + article.url);
            }
        }
    }
    @Override
    public void onError(String error) {
        Log.e("USNews", error);
    }
});

// Custom: 5 articles from NYT and Fox only
news.fetchAll(5, new String[]{"nyt", "fox"}, callback);

// Single source
news.fetchSource("npr", 10, callback);

// Cleanup
news.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `USNews.java` | Android Java — async callbacks, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 10 each) |
| `fetchAll(count, sources)` | int, String[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | String, int | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **3 US perspectives** — center-left, conservative, public radio
- **Async** — all network calls run on background threads via ExecutorService
- **Zero config** — works out of the box, no keys needed

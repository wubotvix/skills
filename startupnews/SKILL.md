# Startup News Skill — SKILL.md

**Skill:** Startup & tech news aggregator — fetch & format for LLM
**Provider:** TechMeme, TechCrunch, Hacker News, VentureBeat, Crunchbase News
**File:** `StartupNews.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `XmlPullParser`, `JSONObject`)

## What It Does

Fetches headlines from 5 startup/tech news sources and outputs them in LLM-ready format. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | What |
|------|--------|--------|------|
| `tm` | TechMeme | HTML scrape (regex) | Top tech headlines, curated |
| `tc` | TechCrunch | HTML scrape (regex) + RSS fallback | Startup/funding news |
| `hn` | Hacker News | Algolia JSON API | Top stories by points |
| `vb` | VentureBeat | RSS feed | Enterprise tech, AI |
| `cb` | Crunchbase News | RSS feed | Funding, deals, layoffs |

## Android Java Usage

```java
StartupNews news = new StartupNews();

// Fetch all sources, 10 articles each
news.fetchAll(new StartupNews.Callback() {
    @Override
    public void onSuccess(StartupNews.NewsResult result) {
        // Brief format — best for LLM input
        Log.d("Startup", result.briefSummary);

        // Detailed format — with URLs and descriptions
        Log.d("Startup", result.detailedSummary);

        // JSON for programmatic use
        Log.d("Startup", result.toJson().toString(2));

        // Access individual articles
        for (Map.Entry<String, List<StartupNews.Article>> entry : result.results.entrySet()) {
            for (StartupNews.Article article : entry.getValue()) {
                Log.d("Startup", article.title);
                if (article.points > 0) {
                    Log.d("Startup", "  " + article.points + " pts, " + article.comments + " comments");
                }
            }
        }
    }
    @Override
    public void onError(String error) {
        Log.e("Startup", error);
    }
});

// Custom: 5 articles from HN and Crunchbase
news.fetchAll(5, new String[]{"hn", "cb"}, callback);

// Single source
news.fetchSource("hn", 10, callback);

// Cleanup
news.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `StartupNews.java` | Android Java — async callbacks, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 10 each) |
| `fetchAll(count, sources)` | int, String[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | String, int | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency, no API keys needed
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Graceful degradation** — TechCrunch falls back to RSS if HTML scrape fails
- **Deduplication** — removes duplicate headlines per source
- **Async** — all network calls on background threads via ExecutorService
- **HTML scraping** — uses regex patterns instead of full HTML parser (simple enough for the target markup)

## Requirements

- Android API 21+ (uses `HttpURLConnection`, `org.json`, `XmlPullParser`)
- Internet access

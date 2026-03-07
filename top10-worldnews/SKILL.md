# Top-10 World News Skill — SKILL.md

**Skill:** Top world news aggregator — fetch & format for LLM
**Sources:** The Guardian (JSON API), BBC News (RSS), Al Jazeera (RSS), New York Times (RSS), Fox News (RSS)
**File:** `WorldNews.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `XmlPullParser`, `JSONObject`)

## What It Does

Fetches top 10 daily world news from 5 major international sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `guardian` | The Guardian | JSON API (`api-key=test`) | UK/global perspective |
| `bbc` | BBC News World | RSS feed | International, balanced |
| `aj` | Al Jazeera | RSS feed | Global South, Middle East |
| `nyt` | New York Times | RSS feed | US/global, in-depth |
| `fox` | Fox News | RSS feed | US conservative perspective |

All 5 sources are free, no signup or API key registration needed.

## Android Java Usage

```java
WorldNews news = new WorldNews();

// Fetch all sources, 10 articles each
news.fetchAll(new WorldNews.Callback() {
    @Override
    public void onSuccess(WorldNews.NewsResult result) {
        Log.d("WorldNews", result.briefSummary);    // LLM-ready
        Log.d("WorldNews", result.detailedSummary); // with URLs
        Log.d("WorldNews", result.toJson().toString(2)); // JSON
    }
    @Override
    public void onError(String error) {
        Log.e("WorldNews", error);
    }
});

// Custom: 5 articles from BBC and Guardian
news.fetchAll(5, new String[]{"bbc", "guardian"}, callback);

// Single source
news.fetchSource("aj", 10, callback);

// Cleanup
news.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `WorldNews.java` | Android Java — async callbacks, built-in APIs only |
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
- **5 global perspectives** — UK, international, Global South, US mainstream, US conservative
- **Guardian JSON API** — parsed with `JSONObject`, others with `XmlPullParser`
- **Async** — all network calls on background threads via ExecutorService
- **Zero config** — works out of the box, no keys needed

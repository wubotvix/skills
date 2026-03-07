# CN Tech News Skill — SKILL.md

**Skill:** Chinese tech news aggregator — fetch & format for LLM
**Sources:** 36氪 (RSS), 钛媒体 (RSS), IT之家 (RSS), 少数派 (RSS), 新浪科技 (RSS)
**File:** `CNTechNews.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `XmlPullParser`, `JSONObject`)
**Language:** Chinese (中文)

## What It Does

Fetches top 20 Chinese tech news from 5 major Chinese tech media sources via RSS. Content in Chinese. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Feed URL | Coverage |
|------|--------|----------|----------|
| `36kr` | 36氪 | 36kr.com/feed | Startups, funding, tech industry |
| `tmt` | 钛媒体 | tmtpost.com/rss.xml | Tech business, deep analysis |
| `ithome` | IT之家 | ithome.com/rss/ | Consumer tech, gadgets, software |
| `sspai` | 少数派 | sspai.com/feed | Apps, productivity, digital lifestyle |
| `sina` | 新浪科技 | rss.sina.com.cn (tech) | Mainstream tech news, industry |

All 5 sources are free, no signup or API key needed.

## Android Java Usage

```java
CNTechNews news = new CNTechNews();

// Fetch all sources, 20 articles each
news.fetchAll(new CNTechNews.Callback() {
    @Override
    public void onSuccess(CNTechNews.NewsResult result) {
        // Brief format — best for LLM input
        Log.d("CNTech", result.briefSummary);

        // Detailed format — with URLs and descriptions
        Log.d("CNTech", result.detailedSummary);

        // JSON for programmatic use
        Log.d("CNTech", result.toJson().toString(2));

        // Access individual articles
        for (Map.Entry<String, List<CNTechNews.Article>> entry : result.results.entrySet()) {
            for (CNTechNews.Article article : entry.getValue()) {
                Log.d("CNTech", article.title + " - " + article.url);
            }
        }
    }
    @Override
    public void onError(String error) {
        Log.e("CNTech", error);
    }
});

// Custom: 10 articles from 36氪 and IT之家
news.fetchAll(10, new String[]{"36kr", "ithome"}, callback);

// Single source
news.fetchSource("sspai", 20, callback);

// Cleanup
news.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `CNTechNews.java` | Android Java — async callbacks, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 20 each) |
| `fetchAll(count, sources)` | int, String[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | String, int | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency, no API keys needed
- **Chinese content** — all output in Chinese, including headers and labels
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Atom + RSS support** — parser handles both `<item>` (RSS) and `<entry>` (Atom) formats
- **Async** — all network calls on background threads via ExecutorService
- **Higher timeout** — 15s to accommodate Chinese server response times

## Requirements

- Android API 21+ (uses `HttpURLConnection`, `org.json`, `XmlPullParser`)
- Internet access

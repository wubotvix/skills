# Startup News Skill

Fetches startup/tech news from TechMeme, TechCrunch, HN, VentureBeat, Crunchbase. No LLM calls, no API keys, no deps.

## CLI (no LLM needed)

```bash
node startupnews.js            # all sources, 20 each
node startupnews.js 5 hn cb    # 5 articles from HN and Crunchbase only
```

## Module Usage

```js
const news = new (require('./startupnews'))();
const r = await news.fetchAll();             // all sources, 20 each
const r = await news.fetchAll(5, ['hn','cb']); // custom
const r = await news.fetchSource('hn', 10);  // single

r.briefSummary    // one-liner per article, best for LLM input
r.detailedSummary // with URLs and descriptions
r.toJson()        // raw data
```

## Sources

- `tm` — TechMeme (curated tech headlines, HTML scrape)
- `tc` — TechCrunch (startup/funding, HTML scrape + RSS fallback)
- `hn` — Hacker News (top stories, Algolia JSON API)
- `vb` — VentureBeat (enterprise tech/AI, RSS)
- `cb` — Crunchbase News (funding/deals, RSS)

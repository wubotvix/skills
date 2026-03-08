# US News Skill — SKILL.md

**Skill:** Top US news aggregator — fetch & format for LLM
**Sources:** New York Times (RSS), Fox News (RSS), NPR (RSS)
**File:** `usnews.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`, `http`)

## What It Does

Fetches top 20 daily US news from 3 major American sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `nyt` | New York Times | RSS feed | Center-left, in-depth reporting |
| `fox` | Fox News | RSS feed | Conservative perspective |
| `npr` | NPR | RSS feed | Public radio, balanced |

All 3 sources are free, no signup or API key needed.

## Node.js Usage

```js
const USNews = require('./usnews');
const news = new USNews();

// Fetch all sources, 20 articles each
const result = await news.fetchAll();

// Brief format — best for LLM input
console.log(result.briefSummary);

// Detailed format — with URLs
console.log(result.detailedSummary);

// JSON for programmatic use
console.log(JSON.stringify(result.toJson(), null, 2));

// Access individual articles
for (const [source, articles] of Object.entries(result.results)) {
  for (const article of articles) {
    console.log(`${article.title} - ${article.url}`);
  }
}

// Custom: 5 articles from NYT and Fox only
const custom = await news.fetchAll(5, ['nyt', 'fox']);

// Single source
const npr = await news.fetchSource('npr', 20);
```

## Files

| File | Description |
|------|-------------|
| `usnews.js` | Node.js — async/await, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 20 each) |
| `fetchAll(count, sources)` | number, string[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | string, number | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **3 US perspectives** — center-left, conservative, public radio
- **Async** — all network calls use native `https`/`http` with Promises
- **Zero config** — works out of the box, no keys needed

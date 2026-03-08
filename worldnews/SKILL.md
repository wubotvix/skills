# World News Skill — SKILL.md

**Skill:** Top world news aggregator — fetch & format for LLM
**Sources:** The Guardian (JSON API), BBC News (RSS), Al Jazeera (RSS), New York Times (RSS), Fox News (RSS)
**File:** `worldnews.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`, `http`)

## What It Does

Fetches top 20 daily world news from 5 major international sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `guardian` | The Guardian | JSON API (`api-key=test`) | UK/global perspective |
| `bbc` | BBC News World | RSS feed | International, balanced |
| `aj` | Al Jazeera | RSS feed | Global South, Middle East |
| `nyt` | New York Times | RSS feed | US/global, in-depth |
| `fox` | Fox News | RSS feed | US conservative perspective |

All 5 sources are free, no signup or API key registration needed.

## Node.js Usage

```js
const WorldNews = require('./worldnews');
const news = new WorldNews();

// Fetch all sources, 20 articles each
const result = await news.fetchAll();
console.log(result.briefSummary);    // LLM-ready
console.log(result.detailedSummary); // with URLs
console.log(JSON.stringify(result.toJson(), null, 2)); // JSON

// Custom: 5 articles from BBC and Guardian
const custom = await news.fetchAll(5, ['bbc', 'guardian']);

// Single source
const aj = await news.fetchSource('aj', 20);
```

## Files

| File | Description |
|------|-------------|
| `worldnews.js` | Node.js — async/await, built-in APIs only |
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
- **5 global perspectives** — UK, international, Global South, US mainstream, US conservative
- **Guardian JSON API** — parsed with `JSON.parse`, others with regex-based RSS parser
- **Async** — all network calls use native `https`/`http` with Promises
- **Zero config** — works out of the box, no keys needed

# China Tech News Skill — SKILL.md

**Skill:** Chinese tech news aggregator — fetch & format for LLM
**Sources:** 36氪 (RSS), 钛媒体 (RSS), IT之家 (RSS), 少数派 (RSS)
**File:** `cntechnews.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`, `http`)
**Language:** Chinese (中文)

## What It Does

Fetches top 20 Chinese tech news from 4 major Chinese tech media sources via RSS. Content in Chinese. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Feed URL | Coverage |
|------|--------|----------|----------|
| `36kr` | 36氪 | 36kr.com/feed | Startups, funding, tech industry |
| `tmt` | 钛媒体 | tmtpost.com/rss.xml | Tech business, deep analysis |
| `ithome` | IT之家 | ithome.com/rss/ | Consumer tech, gadgets, software |
| `sspai` | 少数派 | sspai.com/feed | Apps, productivity, digital lifestyle |

All 4 sources are free, no signup or API key needed.

## Node.js Usage

```js
const CNTechNews = require('./cntechnews');
const news = new CNTechNews();

// Fetch all sources, 20 articles each
const result = await news.fetchAll();

// Brief format — best for LLM input
console.log(result.briefSummary);

// Detailed format — with URLs and descriptions
console.log(result.detailedSummary);

// JSON for programmatic use
console.log(JSON.stringify(result.toJson(), null, 2));

// Access individual articles
for (const [source, articles] of Object.entries(result.results)) {
  for (const article of articles) {
    console.log(`${article.title} - ${article.url}`);
  }
}

// Custom: 10 articles from 36氪 and IT之家
const custom = await news.fetchAll(10, ['36kr', 'ithome']);

// Single source
const sspai = await news.fetchSource('sspai', 20);
```

## Files

| File | Description |
|------|-------------|
| `cntechnews.js` | Node.js — async/await, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 20 each) |
| `fetchAll(count, sources)` | number, string[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | string, number | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency, no API keys needed
- **Chinese content** — all output in Chinese, including headers and labels
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Atom + RSS support** — parser handles both `<item>` (RSS) and `<entry>` (Atom) formats
- **Async** — all network calls use native `https`/`http` with Promises
- **Higher timeout** — 15s to accommodate Chinese server response times

## Requirements

- Node.js 18+ (uses `https`, `http` modules)
- Internet access

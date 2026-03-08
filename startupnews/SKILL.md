# Startup News Skill — SKILL.md

**Skill:** Startup & tech news aggregator — fetch & format for LLM
**Provider:** TechMeme, TechCrunch, Hacker News, VentureBeat, Crunchbase News
**File:** `startupnews.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`, `http`)

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

## Node.js Usage

```js
const StartupNews = require('./startupnews');
const news = new StartupNews();

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
    console.log(article.title);
    if (article.points > 0) {
      console.log(`  ${article.points} pts, ${article.comments} comments`);
    }
  }
}

// Custom: 5 articles from HN and Crunchbase
const custom = await news.fetchAll(5, ['hn', 'cb']);

// Single source
const hn = await news.fetchSource('hn', 20);
```

## Files

| File | Description |
|------|-------------|
| `startupnews.js` | Node.js — async/await, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sources, 20 each) |
| `fetchAll(count, sources)` | number, string[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | string, number | `NewsResult` (single source) |

## Design

- **Fetch only** — no LLM dependency, no API keys needed
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Graceful degradation** — TechCrunch falls back to RSS if HTML scrape fails
- **Deduplication** — removes duplicate headlines per source
- **Async** — all network calls use native `https`/`http` with Promises
- **HTML scraping** — uses regex patterns instead of full HTML parser (simple enough for the target markup)

## Requirements

- Node.js 18+ (uses `https`, `http` modules)
- Internet access

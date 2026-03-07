# China News Skill — SKILL.md

**Skill:** China news aggregator — fetch & format for LLM
**Source:** Sina News (rss.sina.com.cn) — 3 sections
**File:** `cnnews.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`, `http`)
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

## Node.js Usage

```js
const CNNews = require('./cnnews');
const news = new CNNews();

// Fetch all sections, 10 articles each
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

// Custom: 5 articles from headlines and china only
const custom = await news.fetchAll(5, ['headlines', 'china']);

// Single section
const society = await news.fetchSource('society', 10);
```

## Files

| File | Description |
|------|-------------|
| `cnnews.js` | Node.js — async/await, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `fetchAll()` | — | `NewsResult` (all sections, 10 each) |
| `fetchAll(count, sources)` | number, string[] | `NewsResult` (custom) |
| `fetchSource(code, count)` | string, number | `NewsResult` (single section) |

## Design

- **Fetch only** — no LLM dependency
- **Chinese content** — all output in Chinese, including headers and labels (篇文章, 栏目, 错误, 发布)
- **LLM-ready output** — `briefSummary` designed for direct LLM piping
- **Single provider, 3 perspectives** — headlines, domestic, social from Sina News
- **Async** — all network calls use native `https`/`http` with Promises
- **Higher timeout** — 15s to accommodate Chinese server response times
- **Zero config** — works out of the box, no keys needed

## Requirements

- Node.js 18+ (uses `https`, `http` modules)
- Internet access

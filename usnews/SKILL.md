# US News Skill

Fetches top US news from NYT, Fox News, NPR via RSS. No LLM calls, no API keys, no deps.

## CLI (no LLM needed)

```bash
node usnews.js            # all sources, 20 each
node usnews.js 5 nyt fox  # 5 articles from NYT and Fox only
```

## Module Usage

```js
const news = new (require('./usnews'))();
const r = await news.fetchAll();       // all sources, 20 each
const r = await news.fetchAll(5, ['nyt','fox']); // custom
const r = await news.fetchSource('npr', 10);     // single

r.briefSummary    // one-liner per article, best for LLM input
r.detailedSummary // with URLs and descriptions
r.toJson()        // raw data
```

## Sources

- `nyt` — New York Times (center-left)
- `fox` — Fox News (conservative)
- `npr` — NPR (balanced, public radio)

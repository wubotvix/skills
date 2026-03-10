# World News Skill

Fetches top world news from Guardian, BBC, Al Jazeera, NYT, Fox via RSS/JSON. No LLM calls, no API keys, no deps.

## CLI (no LLM needed)

```bash
node worldnews.js                  # all sources, 20 each
node worldnews.js 5 bbc guardian   # 5 articles from BBC and Guardian only
```

## Module Usage

```js
const news = new (require('./worldnews'))();
const r = await news.fetchAll();                  // all sources, 20 each
const r = await news.fetchAll(5, ['bbc','guardian']); // custom
const r = await news.fetchSource('aj', 10);       // single

r.briefSummary    // one-liner per article, best for LLM input
r.detailedSummary // with URLs and descriptions
r.toJson()        // raw data
```

## Sources

- `guardian` — The Guardian (UK/global, JSON API)
- `bbc` — BBC News World (international, balanced)
- `aj` — Al Jazeera (Global South, Middle East)
- `nyt` — New York Times (US/global, in-depth)
- `fox` — Fox News (US conservative perspective)

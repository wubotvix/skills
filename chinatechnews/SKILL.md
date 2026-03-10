# China Tech News Skill

Fetches Chinese tech news from 36氪, 钛媒体, IT之家, 少数派 via RSS. No LLM calls, no API keys, no deps. Output in Chinese.

## CLI (no LLM needed)

```bash
node cntechnews.js                # all sources, 20 each
node cntechnews.js 10 36kr ithome # 10 articles from 36氪 and IT之家 only
```

## Module Usage

```js
const news = new (require('./cntechnews'))();
const r = await news.fetchAll();                  // all sources, 20 each
const r = await news.fetchAll(10, ['36kr','ithome']); // custom
const r = await news.fetchSource('sspai', 10);    // single

r.briefSummary    // one-liner per article, best for LLM input
r.detailedSummary // with URLs and descriptions
r.toJson()        // raw data
```

## Sources

- `36kr` — 36氪 (startups, funding, tech industry)
- `tmt` — 钛媒体 (tech business, deep analysis)
- `ithome` — IT之家 (consumer tech, gadgets)
- `sspai` — 少数派 (apps, productivity, digital lifestyle)

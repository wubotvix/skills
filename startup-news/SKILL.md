# Startup News Skill — SKILL.md

**Skill:** Startup & tech news aggregator — fetch & format for LLM
**Provider:** TechMeme, TechCrunch, Hacker News, VentureBeat, Crunchbase News
**File:** `startup_news.py` (Python 3)
**Runtime:** Python 3.8+ (stdlib only: `urllib`, `json`, `xml`, `html.parser`)
**Dependencies:** None — zero pip packages, instant startup

## What It Does

Fetches headlines from 5 startup/tech news sources and outputs them in LLM-ready format. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | What |
|------|--------|--------|------|
| `tm` | TechMeme | HTML scrape | Top tech headlines, curated |
| `tc` | TechCrunch | HTML scrape + RSS fallback | Startup/funding news |
| `hn` | Hacker News | Algolia JSON API | Top stories by points |
| `vb` | VentureBeat | RSS feed | Enterprise tech, AI |
| `cb` | Crunchbase News | RSS feed | Funding, deals, layoffs |

## CLI Usage

```bash
# Default: all sources, brief format (best for LLM input)
./startup-news

# Fewer articles per source
./startup-news --count 5

# Detailed format with URLs and descriptions
./startup-news --detailed --count 3

# JSON output for programmatic use
./startup-news --json

# Single source
./startup-news --source hn

# Multiple sources
./startup-news --source hn,cb,tm

# Pipe to an LLM for summarization
./startup-news --count 5 | llm "summarize today's startup news"
```

## Output Formats

| Format | Flag | Best For |
|--------|------|----------|
| Brief (default) | — | LLM summarization input |
| Detailed | `--detailed` | Human reading, with URLs |
| JSON | `--json` | Programmatic use, further processing |

### Brief (default) — LLM-ready
```
Startup & Tech News (2026-03-05 04:35) - 15 articles
1. [TechMeme] OpenAI announces GPT-5...
2. [TechCrunch] Stripe raises $6.5B...
3. [Hacker News] Show HN: I built...
```

### Detailed — human-readable
```
## TechMeme (3 articles)
  1. **OpenAI announces GPT-5**
     https://example.com/...
  2. ...
```

## Library Usage (Python import)

```python
from startup_news import fetch_all, fetch_hackernews, fetch_rss, fmt_brief, fmt_detailed

# All sources, 5 articles each
results = fetch_all(n=5)
print(fmt_brief(results))

# Single source
hn = fetch_hackernews(10)

# RSS source
vb = fetch_rss("https://venturebeat.com/feed/", "VentureBeat", 5)

# Custom source selection
results = fetch_all(n=5, sources=["hn", "cb"])
```

## Files

| File | Description |
|------|-------------|
| `startup_news.py` | Main skill — fetch, parse, format |
| `startup-news` | Shell wrapper |
| `SKILL.md` | This documentation |

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--count N` | 10 | Articles per source (1-50) |
| `--source X` | all | Source codes: hn, tm, tc, vb, cb (comma-separated) |
| `--detailed` | — | Grouped by source with URLs |
| `--json` | — | Full JSON output |
| `-h`, `--help` | — | Show help |

## Design

- **Fetch only** — no LLM dependency, no API keys needed
- **LLM-ready output** — brief format is designed for direct LLM piping
- **Graceful degradation** — TechCrunch falls back to RSS if scrape fails
- **Deduplication** — removes duplicate headlines per source
- **Status on stderr** — progress messages go to stderr, clean data to stdout

## Requirements

- Python 3.8+ (stdlib only)
- Internet access
- Works on Linux, macOS, Windows, Android/Termux

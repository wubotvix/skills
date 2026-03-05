# Top-10 US News Skill — SKILL.md

**Skill:** Top US news aggregator — fetch & format for LLM
**Sources:** New York Times (RSS), Fox News (RSS), NPR (RSS)
**File:** `usnews.py` (Python 3)
**Runtime:** Python 3.8+ (stdlib only)
**Dependencies:** None — zero pip packages, no API keys needed

## What It Does

Fetches top 10 daily US news from 3 major American sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `nyt` | New York Times | RSS feed | Center-left, in-depth reporting |
| `fox` | Fox News | RSS feed | Conservative perspective |
| `npr` | NPR | RSS feed | Public radio, balanced |

All 3 sources are free, no signup or API key needed.

## CLI Usage

```bash
# Default: all 3 sources, 10 articles each, brief format
./usnews

# 5 articles per source
./usnews --count 5

# Detailed with URLs and descriptions
./usnews --detailed

# JSON output
./usnews --json

# Single source
./usnews --source nyt

# Multiple sources
./usnews --source nyt,fox
```

## Output Formats

| Format | Flag | Best For |
|--------|------|----------|
| Brief (default) | — | LLM summarization input |
| Detailed | `--detailed` | Human reading, with URLs |
| JSON | `--json` | Programmatic use |

## Library Usage (Python import)

```python
from usnews import fetch_all, fetch_nyt, fetch_fox, fetch_npr
from usnews import fmt_brief, fmt_detailed

# All sources
results = fetch_all(n=10)
print(fmt_brief(results))

# Single source
nyt = fetch_nyt(10)
fox = fetch_fox(5)

# Select sources
results = fetch_all(n=5, sources=["nyt", "fox"])
```

## Files

| File | Description |
|------|-------------|
| `usnews.py` | Main skill — fetch, parse, format |
| `usnews` | Shell wrapper |
| `SKILL.md` | This documentation |

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--count N` | 10 | Articles per source |
| `--source X` | all | Source codes: nyt, fox, npr |
| `--detailed` | — | Grouped by source with URLs |
| `--json` | — | Full JSON output |
| `-h, --help` | — | Show help |

## Design

- **Fetch only** — no LLM dependency
- **LLM-ready output** — brief format designed for direct LLM piping
- **3 US perspectives** — center-left, conservative, public radio
- **Status on stderr** — progress to stderr, clean data to stdout
- **Zero config** — works out of the box, no keys needed

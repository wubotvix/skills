# Top-10 World News Skill — SKILL.md

**Skill:** Top world news aggregator — fetch & format for LLM
**Sources:** The Guardian (JSON API), BBC News (RSS), Al Jazeera (RSS), New York Times (RSS), Fox News (RSS)
**File:** `worldnews.py` (Python 3)
**Runtime:** Python 3.8+ (stdlib only)
**Dependencies:** None — zero pip packages, no API keys needed

## What It Does

Fetches top 10 daily world news from 5 major international sources and outputs LLM-ready text. **Does not call any LLM** — the calling agent handles summarization.

### Sources

| Code | Source | Method | Coverage |
|------|--------|--------|----------|
| `guardian` | The Guardian | JSON API (`api-key=test`) | UK/global perspective |
| `bbc` | BBC News World | RSS feed | International, balanced |
| `aj` | Al Jazeera | RSS feed | Global South, Middle East |
| `nyt` | New York Times | RSS feed | US/global, in-depth |
| `fox` | Fox News | RSS feed | US conservative perspective |

All 5 sources are free, no signup or API key registration needed.

## CLI Usage

```bash
# Default: all 5 sources, 10 articles each, brief format
./worldnews

# 5 articles per source
./worldnews --count 5

# Detailed with URLs and descriptions
./worldnews --detailed

# JSON output
./worldnews --json

# Single source
./worldnews --source bbc

# Multiple sources
./worldnews --source guardian,nyt,fox
```

## Output Formats

| Format | Flag | Best For |
|--------|------|----------|
| Brief (default) | — | LLM summarization input |
| Detailed | `--detailed` | Human reading, with URLs |
| JSON | `--json` | Programmatic use |

## Library Usage (Python import)

```python
from worldnews import fetch_all, fetch_guardian, fetch_bbc, fetch_aljazeera, fetch_nyt, fetch_fox
from worldnews import fmt_brief, fmt_detailed

# All sources
results = fetch_all(n=10)
print(fmt_brief(results))

# Single source
guardian = fetch_guardian(10)
nyt = fetch_nyt(5)

# Select sources
results = fetch_all(n=5, sources=["bbc", "nyt", "fox"])
```

## Files

| File | Description |
|------|-------------|
| `worldnews.py` | Main skill — fetch, parse, format |
| `worldnews` | Shell wrapper |
| `SKILL.md` | This documentation |

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--count N` | 10 | Articles per source |
| `--source X` | all | Source codes: guardian, bbc, aj, nyt, fox |
| `--detailed` | — | Grouped by source with URLs |
| `--json` | — | Full JSON output |
| `-h, --help` | — | Show help |

## Design

- **Fetch only** — no LLM dependency
- **LLM-ready output** — brief format designed for direct LLM piping
- **5 global perspectives** — UK, international, Global South, US mainstream, US conservative
- **Status on stderr** — progress to stderr, clean data to stdout
- **Zero config** — works out of the box, no keys needed

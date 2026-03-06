#!/usr/bin/env python3
"""
AutoClaw Top-10 World News Skill — fetch & format for LLM
Pulls top 10 daily world news from 5 major sources.

Sources:
  1. The Guardian  — JSON API (free, no signup)
  2. BBC News      — RSS feed (world section)
  3. Al Jazeera    — RSS feed
  4. New York Times — RSS feed (world section)
  5. Fox News      — RSS feed (world section)

Zero dependencies. Python 3.8+ stdlib only.
"""
import sys, json, re, urllib.request, ssl
from datetime import datetime
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

TIMEOUT = 12
UA = "AutoClaw-WorldNews/1.0"
DEFAULT_COUNT = 10

# ── HTML helpers ────────────────────────────────────────────

class TextExtractor(HTMLParser):
    _SKIP_TAGS = frozenset(('script', 'style'))
    def __init__(self):
        super().__init__()
        self._text = []
        self._skip_depth = 0
    def handle_starttag(self, tag, attrs):
        if tag in self._SKIP_TAGS:
            self._skip_depth += 1
    def handle_endtag(self, tag):
        if tag in self._SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1
    def handle_data(self, data):
        if self._skip_depth == 0:
            t = data.strip()
            if t:
                self._text.append(t)
    def get_text(self):
        return " ".join(self._text)

def strip_html(s):
    if not s: return ""
    p = TextExtractor()
    try: p.feed(s)
    except: pass
    return p.get_text()

def clean(s):
    if not s: return ""
    s = strip_html(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:400]

# ── HTTP ────────────────────────────────────────────────────

def http_get(url, timeout=TIMEOUT):
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    })
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="replace")

# ── Generic RSS Parser ─────────────────────────────────────

def fetch_rss(feed_url, source_name, n=DEFAULT_COUNT):
    articles = []
    try:
        xml_str = http_get(feed_url)
        root = ET.fromstring(xml_str)
        ns = {"content": "http://purl.org/rss/1.0/modules/content/",
              "dc": "http://purl.org/dc/elements/1.1/",
              "media": "http://search.yahoo.com/mrss/",
              "atom": "http://www.w3.org/2005/Atom"}
        items = root.findall(".//item")
        if not items:
            items = root.findall(".//atom:entry", ns)
        for item in items[:n]:
            title = link = desc = pub_date = author = ""
            t = item.find("title")
            if t is not None and t.text:
                title = t.text.strip()
            l = item.find("link")
            if l is not None:
                link = (l.text or "").strip() or l.get("href", "")
            if not link:
                al = item.find("atom:link", ns)
                if al is not None:
                    link = al.get("href", "")
            d = item.find("description")
            if d is not None and d.text:
                desc = clean(d.text)
            ce = item.find("content:encoded", ns)
            if ce is not None and ce.text:
                ce_clean = clean(ce.text)
                if len(ce_clean) > len(desc):
                    desc = ce_clean
            pd = item.find("pubDate")
            if pd is not None and pd.text:
                pub_date = pd.text.strip()
            au = item.find("dc:creator", ns)
            if au is not None and au.text:
                author = au.text.strip()
            if title:
                a = {"source": source_name, "title": title, "url": link}
                if desc: a["description"] = desc[:300]
                if pub_date: a["published"] = pub_date
                if author: a["author"] = author
                articles.append(a)
    except Exception as e:
        articles.append({"source": source_name, "error": str(e)})
    return articles

# ── Source 1: The Guardian (JSON API) ───────────────────────

def fetch_guardian(n=DEFAULT_COUNT):
    """The Guardian open API. api-key=test gives free access, no signup."""
    articles = []
    try:
        url = (
            f"https://content.guardianapis.com/search"
            f"?section=world&order-by=newest&page-size={n}"
            f"&show-fields=trailText,headline,byline,thumbnail"
            f"&api-key=test"
        )
        data = json.loads(http_get(url))
        for item in data.get("response", {}).get("results", [])[:n]:
            fields = item.get("fields", {})
            articles.append({
                "source": "The Guardian",
                "title": fields.get("headline") or item.get("webTitle", ""),
                "url": item.get("webUrl", ""),
                "description": clean(fields.get("trailText", "")),
                "author": fields.get("byline", ""),
                "published": item.get("webPublicationDate", ""),
            })
    except Exception as e:
        articles.append({"source": "The Guardian", "error": str(e)})
    return articles

# ── Source 2: BBC News World (RSS) ──────────────────────────

def fetch_bbc(n=DEFAULT_COUNT):
    return fetch_rss("https://feeds.bbci.co.uk/news/world/rss.xml", "BBC News", n)

# ── Source 3: Al Jazeera (RSS) ──────────────────────────────

def fetch_aljazeera(n=DEFAULT_COUNT):
    return fetch_rss("https://www.aljazeera.com/xml/rss/all.xml", "Al Jazeera", n)

# ── Source 4: New York Times World (RSS) ────────────────────

def fetch_nyt(n=DEFAULT_COUNT):
    return fetch_rss("https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "New York Times", n)

# ── Source 5: Fox News World (RSS) ──────────────────────────

def fetch_fox(n=DEFAULT_COUNT):
    return fetch_rss("https://moxie.foxnews.com/google-publisher/world.xml", "Fox News", n)

# ── Fetch All ───────────────────────────────────────────────

SOURCE_MAP = {
    "guardian": ("The Guardian",   lambda n: fetch_guardian(n)),
    "bbc":     ("BBC News",       lambda n: fetch_bbc(n)),
    "aj":      ("Al Jazeera",     lambda n: fetch_aljazeera(n)),
    "nyt":     ("New York Times", lambda n: fetch_nyt(n)),
    "fox":     ("Fox News",       lambda n: fetch_fox(n)),
}

def fetch_all(n=DEFAULT_COUNT, sources=None):
    results = {}
    targets = sources if sources else SOURCE_MAP.keys()
    for key in targets:
        if key in SOURCE_MAP:
            name, fetcher = SOURCE_MAP[key]
            results[name] = fetcher(n)
    return results

# ── Output Formatters ───────────────────────────────────────

def fmt_brief(all_results):
    """Numbered list, one line per article. Best for LLM input."""
    lines = []
    idx = 1
    for source, articles in all_results.items():
        for a in articles:
            if "error" in a or not a.get("title"):
                continue
            line = f"{idx}. [{source}] {a['title']}"
            if a.get("description"):
                line += f" -- {a['description'][:150]}"
            lines.append(line)
            idx += 1
    header = f"Top World News ({datetime.now().strftime('%Y-%m-%d %H:%M')}) - {idx-1} articles from {len(all_results)} sources\n"
    return header + "\n".join(lines)

def fmt_detailed(all_results):
    """Grouped by source with URLs and descriptions."""
    lines = []
    total = 0
    for source, articles in all_results.items():
        valid = [a for a in articles if "error" not in a and a.get("title")]
        errors = [a for a in articles if "error" in a]
        lines.append(f"\n## {source} ({len(valid)} articles)")
        for e in errors:
            lines.append(f"  [error: {e['error']}]")
        for i, a in enumerate(valid, 1):
            lines.append(f"  {i}. **{a['title']}**")
            if a.get("url"):
                lines.append(f"     {a['url']}")
            if a.get("description"):
                lines.append(f"     {a['description'][:250]}")
            if a.get("published"):
                lines.append(f"     Published: {a['published']}")
            total += 1
    header = f"# Top World News - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n**{total} articles from {len(all_results)} sources**\n"
    return header + "\n".join(lines)

# ── CLI ─────────────────────────────────────────────────────

HELP = """AutoClaw Top-10 World News — fetch & format for LLM

Pulls top 10 daily world news from 5 major sources:
  guardian = The Guardian (JSON API, free)
  bbc      = BBC News World (RSS)
  aj       = Al Jazeera (RSS)
  nyt      = New York Times World (RSS)
  fox      = Fox News World (RSS)

Usage:
  worldnews.py                        # all sources, 10 each, brief
  worldnews.py --count 5              # 5 per source
  worldnews.py --detailed             # with URLs and descriptions
  worldnews.py --json                 # full JSON output
  worldnews.py --source guardian      # single source
  worldnews.py --source bbc,nyt,fox   # multiple sources

Flags:
  --count N        Articles per source (default: 10)
  --source X       Source codes: guardian, bbc, aj, nyt, fox (comma-separated)
  --detailed       Grouped by source with URLs
  --json           Full JSON output
  -h, --help       Show help"""

def main():
    args = sys.argv[1:]
    if "-h" in args or "--help" in args:
        print(HELP); return

    count = DEFAULT_COUNT
    mode = "brief"
    sources = None

    def pull(flag):
        nonlocal args
        if flag in args: args.remove(flag); return True
        return False
    def pull_val(flag):
        nonlocal args
        if flag in args:
            i = args.index(flag)
            if i + 1 < len(args):
                val = args[i+1]; args = args[:i] + args[i+2:]; return val
            else:
                args = args[:i] + args[i+1:]; return None
        return None

    if pull("--json"): mode = "json"
    elif pull("--detailed"): mode = "detailed"
    v = pull_val("--count")
    if v:
        try: count = int(v)
        except ValueError:
            print(f"Invalid --count value: {v}", file=sys.stderr); sys.exit(1)
    v = pull_val("--source")
    if v:
        sources = [s.strip().lower() for s in v.split(",")]
        bad = [s for s in sources if s not in SOURCE_MAP]
        if bad:
            print(f"Unknown source(s): {', '.join(bad)}. Use: guardian, bbc, aj, nyt, fox", file=sys.stderr)
            sys.exit(1)

    src_label = ", ".join(sources) if sources else "all"
    print(f"Fetching world news from {src_label}...", file=sys.stderr)

    all_results = fetch_all(count, sources)
    total = sum(len([a for a in arts if "error" not in a]) for arts in all_results.values())
    print(f"Got {total} articles.", file=sys.stderr)

    if mode == "json":
        print(json.dumps(all_results, indent=2, ensure_ascii=False))
    elif mode == "detailed":
        print(fmt_detailed(all_results))
    else:
        print(fmt_brief(all_results))

if __name__ == "__main__":
    main()

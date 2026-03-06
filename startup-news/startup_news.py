#!/usr/bin/env python3
"""
AutoClaw Startup News Skill — fetch & format only.
Aggregates startup/tech news from 5 sources, outputs formatted text or JSON.
The calling agent handles summarization.

Sources (web scrape):
  - TechMeme (techmeme.com) — top tech headlines
  - TechCrunch (techcrunch.com) — startup/funding news
  - Hacker News (news.ycombinator.com) — top stories via Algolia API

Sources (RSS):
  - VentureBeat (venturebeat.com/feed/)
  - Crunchbase News (news.crunchbase.com/feed/)

Zero pip dependencies. Python 3.8+ stdlib only.
"""
import sys, json, re, urllib.request, urllib.parse, ssl
from datetime import datetime
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

TIMEOUT = 12
UA = "AutoClaw-StartupNews/1.0"
MAX_ARTICLES = 10

# ── HTML helpers ────────────────────────────────────────────

class TextExtractor(HTMLParser):
    _SKIP_TAGS = frozenset(('script', 'style', 'nav', 'header', 'footer'))
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

def strip_html(html_str):
    if not html_str:
        return ""
    p = TextExtractor()
    try:
        p.feed(html_str)
    except:
        pass
    return p.get_text()

def clean(s):
    if not s:
        return ""
    s = strip_html(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:500]

# ── HTTP ────────────────────────────────────────────────────

def http_get(url, timeout=TIMEOUT):
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    })
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="replace")

# ── Source: Hacker News ─────────────────────────────────────

def fetch_hackernews(n=MAX_ARTICLES):
    articles = []
    try:
        data = json.loads(http_get(f"https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage={n}"))
        for hit in data.get("hits", [])[:n]:
            articles.append({
                "source": "Hacker News",
                "title": hit.get("title", ""),
                "url": hit.get("url") or f'https://news.ycombinator.com/item?id={hit.get("objectID","")}',
                "points": hit.get("points", 0),
                "comments": hit.get("num_comments", 0),
            })
    except Exception as e:
        articles.append({"source": "Hacker News", "error": str(e)})
    return articles

# ── Source: TechMeme ────────────────────────────────────────

class TechMemeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.articles = []
        self._in_item = False
        self._current = {}
        self._capture = False
        self._text = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "a" and "ourh" in d.get("class", ""):
            self._in_item = True
            self._current = {"url": d.get("href", ""), "source": "TechMeme"}
            self._capture = True
            self._text = []
    def handle_data(self, data):
        if self._capture:
            self._text.append(data.strip())
    def handle_endtag(self, tag):
        if tag == "a" and self._in_item:
            self._current["title"] = " ".join(self._text).strip()
            if self._current.get("title"):
                self.articles.append(self._current)
            self._in_item = False
            self._capture = False
            self._text = []

def fetch_techmeme(n=MAX_ARTICLES):
    articles = []
    try:
        parser = TechMemeParser()
        parser.feed(http_get("https://techmeme.com/"))
        seen = set()
        for a in parser.articles:
            t = a.get("title", "").strip()
            if t and t not in seen:
                seen.add(t)
                articles.append(a)
            if len(articles) >= n:
                break
    except Exception as e:
        articles.append({"source": "TechMeme", "error": str(e)})
    return articles

# ── Source: TechCrunch ──────────────────────────────────────

class TCParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.articles = []
        self._in_h = False
        self._current = {}
        self._text = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        cls = d.get("class", "")
        if tag in ("h2", "h3") and ("post-block__title" in cls or "mini-card__title" in cls or "river" in cls):
            self._in_h = True
            self._text = []
        if self._in_h and tag == "a":
            href = d.get("href", "")
            if href and "techcrunch.com" in href:
                self._current = {"url": href, "source": "TechCrunch"}
    def handle_data(self, data):
        if self._in_h:
            self._text.append(data.strip())
    def handle_endtag(self, tag):
        if tag in ("h2", "h3") and self._in_h:
            title = " ".join(self._text).strip()
            if title and self._current.get("url"):
                self._current["title"] = title
                self.articles.append(self._current)
            self._in_h = False
            self._current = {}
            self._text = []

def fetch_techcrunch(n=MAX_ARTICLES):
    articles = []
    try:
        parser = TCParser()
        parser.feed(http_get("https://techcrunch.com/"))
        seen = set()
        for a in parser.articles:
            t = a.get("title", "")
            if t and t not in seen:
                seen.add(t)
                articles.append(a)
            if len(articles) >= n:
                break
        if not articles:
            articles = fetch_rss("https://techcrunch.com/feed/", "TechCrunch", n)
    except Exception:
        try:
            articles = fetch_rss("https://techcrunch.com/feed/", "TechCrunch", n)
        except Exception as e:
            articles.append({"source": "TechCrunch", "error": str(e)})
    return articles

# ── RSS Parser ──────────────────────────────────────────────

def fetch_rss(feed_url, source_name, n=MAX_ARTICLES):
    articles = []
    try:
        root = ET.fromstring(http_get(feed_url))
        ns = {"content": "http://purl.org/rss/1.0/modules/content/",
              "dc": "http://purl.org/dc/elements/1.1/",
              "atom": "http://www.w3.org/2005/Atom"}
        items = root.findall(".//item") or root.findall(".//atom:entry", ns)
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

# ── Fetch All ───────────────────────────────────────────────

SOURCE_MAP = {
    "tm": ("TechMeme",        lambda n: fetch_techmeme(n)),
    "tc": ("TechCrunch",      lambda n: fetch_techcrunch(n)),
    "hn": ("Hacker News",     lambda n: fetch_hackernews(n)),
    "vb": ("VentureBeat",     lambda n: fetch_rss("https://venturebeat.com/feed/", "VentureBeat", n)),
    "cb": ("Crunchbase News", lambda n: fetch_rss("https://news.crunchbase.com/feed/", "Crunchbase News", n)),
}

def fetch_all(n=MAX_ARTICLES, sources=None):
    results = {}
    targets = sources if sources else SOURCE_MAP.keys()
    for key in targets:
        if key in SOURCE_MAP:
            name, fetcher = SOURCE_MAP[key]
            results[name] = fetcher(n)
    return results

# ── Output Formatters ───────────────────────────────────────

def fmt_brief(all_results):
    """One-line-per-article, compact. Good for LLM input."""
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
    header = f"Startup & Tech News ({datetime.now().strftime('%Y-%m-%d %H:%M')}) - {idx-1} articles\n"
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
                lines.append(f"     {a['description'][:200]}")
            if a.get("points"):
                lines.append(f"     [{a['points']} pts, {a.get('comments',0)} comments]")
            total += 1
    header = f"# Startup & Tech News - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n**{total} articles from {len(all_results)} sources**\n"
    return header + "\n".join(lines)

# ── CLI ─────────────────────────────────────────────────────

HELP = """AutoClaw Startup News Skill — fetch & format for LLM

Usage:
  startup_news.py                  # default: brief format (best for LLM)
  startup_news.py --detailed       # grouped by source with URLs
  startup_news.py --json           # full JSON output
  startup_news.py --source hn      # single source (hn/tm/tc/vb/cb)
  startup_news.py --source hn,tc   # multiple sources
  startup_news.py --count 5        # articles per source (default: 10)

Output Formats:
  (default)     Numbered list, one line per article — ideal for LLM summarization
  --detailed    Grouped by source with URLs and descriptions
  --json        Raw JSON array for programmatic use

Sources:
  tm = TechMeme       tc = TechCrunch      hn = Hacker News
  vb = VentureBeat    cb = Crunchbase News

Examples:
  startup_news.py                           # all sources, brief
  startup_news.py --count 5                 # 5 per source
  startup_news.py --source hn,cb --json     # HN + Crunchbase as JSON
  startup_news.py --detailed --count 3      # detailed, 3 each"""

def main():
    args = sys.argv[1:]
    if "-h" in args or "--help" in args:
        print(HELP); return

    count = MAX_ARTICLES
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
            print(f"Unknown source(s): {', '.join(bad)}. Use: hn, tm, tc, vb, cb", file=sys.stderr)
            sys.exit(1)

    src_label = ", ".join(sources) if sources else "all"
    print(f"Fetching from {src_label}...", file=sys.stderr)

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

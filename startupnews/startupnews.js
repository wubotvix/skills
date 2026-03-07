/**
 * AutoClaw Startup News Skill — fetch & format for LLM
 * Aggregates startup/tech news from 5 sources.
 * No external dependencies. Node.js built-in APIs only.
 *
 * Sources (web scrape):
 *   tm = TechMeme (techmeme.com) — top tech headlines
 *   tc = TechCrunch (techcrunch.com) — startup/funding news
 *
 * Sources (JSON API):
 *   hn = Hacker News (Algolia API) — top stories by points
 *
 * Sources (RSS):
 *   vb = VentureBeat (RSS feed)
 *   cb = Crunchbase News (RSS feed)
 *
 * Usage:
 *   const StartupNews = require('./StartupNews');
 *   const news = new StartupNews();
 *   const result = await news.fetchAll();
 *   const result = await news.fetchAll(5, ['hn', 'tc']);
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 12000;
const UA = 'AutoClaw-StartupNews/1.0';
const MAX_ARTICLES = 10;

const SOURCE_NAMES = {
  tm: 'TechMeme',
  tc: 'TechCrunch',
  hn: 'Hacker News',
  vb: 'VentureBeat',
  cb: 'Crunchbase News',
};

// ── HTML Stripping ────────────────────────────────────────

function decodeEntities(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function stripHtml(s) {
  if (!s) return '';
  return decodeEntities(s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')).trim();
}

function clean(s) {
  if (!s) return null;
  s = stripHtml(s);
  return s.length > 500 ? s.substring(0, 500) : s;
}

// ── HTTP ──────────────────────────────────────────────────

function httpGet(url, redirects = 0) {
  const mod = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = mod.get(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: TIMEOUT,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if (redirects >= 5) return reject(new Error('Too many redirects'));
        httpGet(res.headers.location, redirects + 1).then(resolve, reject);
        return;
      }
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

// ── RSS Parser ────────────────────────────────────────────

function parseRss(xml, sourceName, n) {
  const articles = [];
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && articles.length < n) {
    const block = match[1];
    const title = extractTag(block, 'title');
    if (!title) continue;

    let link = extractAttr(block, 'link', 'href') || extractTag(block, 'link');
    const description = clean(extractTag(block, 'description') || extractTag(block, 'encoded'));
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const author = extractTag(block, 'creator') || extractTag(block, 'author');

    const a = { source: sourceName, title: stripHtml(title).trim(), url: (link || '').trim() };
    if (description) a.description = description.length > 300 ? description.substring(0, 300) : description;
    if (pubDate) a.published = pubDate.trim();
    if (author) a.author = stripHtml(author).trim();
    if (a.title) articles.push(a);
  }
  return articles;
}

function extractTag(block, tag) {
  const cdataRe = new RegExp(`<(?:[\\w:]*:)?${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/`, 'i');
  const cdataMatch = cdataRe.exec(block);
  if (cdataMatch) return cdataMatch[1].trim();

  const re = new RegExp(`<(?:[\\w:]*:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[\\w:]*:)?${tag}>`, 'i');
  const m = re.exec(block);
  return m ? m[1].trim() : null;
}

function extractAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]+${attr}="([^"]+)"`, 'i');
  const m = re.exec(block);
  return m ? m[1] : null;
}

// ── Source: Hacker News (JSON API) ─────────────────────────

async function fetchHackerNews(n) {
  try {
    const json = await httpGet(`https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${n}`);
    const data = JSON.parse(json);
    return data.hits.slice(0, n).map(hit => ({
      source: 'Hacker News',
      title: hit.title || '',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID || ''}`,
      points: hit.points || 0,
      comments: hit.num_comments || 0,
    }));
  } catch (e) {
    return [{ source: 'Hacker News', error: e.message }];
  }
}

// ── Source: TechMeme (HTML scrape) ─────────────────────────

async function fetchTechMeme(n) {
  try {
    const html = await httpGet('https://techmeme.com/');
    const articles = [];
    const seen = new Set();

    // Pattern: class before href, or href before class
    const patterns = [
      /<a[^>]+class="[^"]*ourh[^"]*"[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
      /<a[^>]+href="([^"]+)"[^>]+class="[^"]*ourh[^"]*"[^>]*>([^<]+)<\/a>/g,
    ];

    for (const pattern of patterns) {
      let m;
      while ((m = pattern.exec(html)) !== null && articles.length < n) {
        const title = stripHtml(m[2]).trim();
        if (title && !seen.has(title)) {
          seen.add(title);
          articles.push({ source: 'TechMeme', title, url: m[1] });
        }
      }
      if (articles.length > 0) break;
    }
    return articles;
  } catch (e) {
    return [{ source: 'TechMeme', error: e.message }];
  }
}

// ── Source: TechCrunch (HTML scrape with RSS fallback) ─────

async function fetchTechCrunch(n) {
  let articles = [];
  try {
    const html = await httpGet('https://techcrunch.com/');
    const pattern = /<h[23][^>]*class="[^"]*(?:post-block__title|mini-card__title|river)[^"]*"[^>]*>\s*<a[^>]+href="(https?:\/\/techcrunch\.com[^"]+)"[^>]*>([^<]+)<\/a>/g;
    const seen = new Set();
    let m;
    while ((m = pattern.exec(html)) !== null && articles.length < n) {
      const title = stripHtml(m[2]).trim();
      if (title && !seen.has(title)) {
        seen.add(title);
        articles.push({ source: 'TechCrunch', title, url: m[1] });
      }
    }
  } catch (_) { /* fall through to RSS */ }

  if (articles.length === 0) {
    try {
      const xml = await httpGet('https://techcrunch.com/feed/');
      articles = parseRss(xml, 'TechCrunch', n);
    } catch (e) {
      return [{ source: 'TechCrunch', error: e.message }];
    }
  }
  return articles;
}

// ── Formatters ────────────────────────────────────────────

function fmtBrief(allResults) {
  let sb = '';
  let idx = 1;
  for (const [name, articles] of Object.entries(allResults)) {
    for (const a of articles) {
      if (a.error || !a.title) continue;
      sb += `${idx}. [${name}] ${a.title}`;
      if (a.description) {
        sb += ' -- ' + (a.description.length > 150 ? a.description.substring(0, 150) : a.description);
      }
      sb += '\n';
      idx++;
    }
  }
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  return `Startup & Tech News (${now}) - ${idx - 1} articles\n${sb}`;
}

function fmtDetailed(allResults) {
  let sb = '';
  let total = 0;
  for (const [name, articles] of Object.entries(allResults)) {
    const valid = articles.filter(a => !a.error && a.title);
    const errors = articles.filter(a => a.error);
    sb += `\n## ${name} (${valid.length} articles)\n`;
    for (const e of errors) sb += `  [error: ${e.error}]\n`;
    let i = 1;
    for (const a of valid) {
      sb += `  ${i}. **${a.title}**\n`;
      if (a.url) sb += `     ${a.url}\n`;
      if (a.description) {
        sb += `     ${a.description.length > 200 ? a.description.substring(0, 200) : a.description}\n`;
      }
      if (a.points > 0) sb += `     [${a.points} pts, ${a.comments} comments]\n`;
      i++; total++;
    }
  }
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  return `# Startup & Tech News - ${now}\n**${total} articles from ${Object.keys(allResults).length} sources**\n${sb}`;
}

// ── Public API ────────────────────────────────────────────

class StartupNews {
  /** Fetch all sources, 10 articles each. */
  async fetchAll(count = MAX_ARTICLES, sources = null) {
    const results = {};
    const targets = sources || Object.keys(SOURCE_NAMES);

    for (const key of targets) {
      const name = SOURCE_NAMES[key];
      if (!name) continue;

      switch (key) {
        case 'tm': results[name] = await fetchTechMeme(count); break;
        case 'tc': results[name] = await fetchTechCrunch(count); break;
        case 'hn': results[name] = await fetchHackerNews(count); break;
        case 'vb': {
          try {
            const xml = await httpGet('https://venturebeat.com/feed/');
            results[name] = parseRss(xml, name, count);
          } catch (e) { results[name] = [{ source: name, error: e.message }]; }
          break;
        }
        case 'cb': {
          try {
            const xml = await httpGet('https://news.crunchbase.com/feed/');
            results[name] = parseRss(xml, name, count);
          } catch (e) { results[name] = [{ source: name, error: e.message }]; }
          break;
        }
      }
    }

    return {
      results,
      briefSummary: fmtBrief(results),
      detailedSummary: fmtDetailed(results),
      toJson() {
        const o = {};
        for (const [k, v] of Object.entries(this.results)) o[k] = v;
        return o;
      },
    };
  }

  /** Fetch a single source by code (tm, tc, hn, vb, cb). */
  async fetchSource(code, count = MAX_ARTICLES) {
    return this.fetchAll(count, [code]);
  }
}

module.exports = StartupNews;

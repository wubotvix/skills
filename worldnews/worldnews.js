/**
 * AutoClaw Top-20 World News Skill — fetch & format for LLM
 * Pulls top 20 daily world news from 5 major international sources.
 * No external dependencies. Node.js built-in APIs only.
 *
 * Sources:
 *   guardian = The Guardian (JSON API, free)
 *   bbc      = BBC News World (RSS)
 *   aj       = Al Jazeera (RSS)
 *   nyt      = New York Times World (RSS)
 *   fox      = Fox News World (RSS)
 *
 * Usage:
 *   const WorldNews = require('./WorldNews');
 *   const news = new WorldNews();
 *   const result = await news.fetchAll();
 *   const result = await news.fetchAll(5, ['bbc', 'nyt']);
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 12000;
const UA = 'AutoClaw-WorldNews/1.0';
const DEFAULT_COUNT = 20;

const SOURCE_NAMES = {
  guardian: 'The Guardian',
  bbc: 'BBC News',
  aj: 'Al Jazeera',
  nyt: 'New York Times',
  fox: 'Fox News',
};

const RSS_FEEDS = {
  bbc: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  aj: 'https://www.aljazeera.com/xml/rss/all.xml',
  nyt: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  fox: 'https://moxie.foxnews.com/google-publisher/world.xml',
};

// ── HTML Stripping ────────────────────────────────────────

function decodeEntities(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
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
  return s.length > 400 ? s.substring(0, 400) : s;
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
        const loc = res.headers.location;
        const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
        httpGet(next, redirects + 1).then(resolve, reject);
        return;
      }
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

// ── RSS Parser ────────────────────────────────────────────

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
    const pubDate = extractTag(block, 'pubDate');
    const author = extractTag(block, 'creator');

    const a = { source: sourceName, title: stripHtml(title).trim(), url: (link || '').trim() };
    if (description) a.description = description.length > 300 ? description.substring(0, 300) : description;
    if (pubDate) a.published = pubDate.trim();
    if (author) a.author = stripHtml(author).trim();
    if (a.title) articles.push(a);
  }
  return articles;
}

// ── Guardian JSON API ─────────────────────────────────────

async function fetchGuardian(n) {
  try {
    const params = `?section=world&order-by=newest&page-size=${n}`
      + '&show-fields=trailText,headline,byline,thumbnail'
      + '&api-key=test';
    const json = await httpGet('https://content.guardianapis.com/search' + params);
    const data = JSON.parse(json);
    const results = data.response.results;

    return results.slice(0, n).map(item => {
      const fields = item.fields || {};
      const a = {
        source: 'The Guardian',
        title: fields.headline || item.webTitle || '',
        url: item.webUrl || '',
      };
      const trail = clean(fields.trailText || '');
      if (trail) a.description = trail;
      if (fields.byline) a.author = fields.byline;
      if (item.webPublicationDate) a.published = item.webPublicationDate;
      return a;
    });
  } catch (e) {
    return [{ source: 'The Guardian', error: e.message }];
  }
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
  return `Top World News (${now}) - ${idx - 1} articles from ${Object.keys(allResults).length} sources\n${sb}`;
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
        sb += `     ${a.description.length > 250 ? a.description.substring(0, 250) : a.description}\n`;
      }
      if (a.published) sb += `     Published: ${a.published}\n`;
      i++; total++;
    }
  }
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  return `# Top World News - ${now}\n**${total} articles from ${Object.keys(allResults).length} sources**\n${sb}`;
}

// ── Public API ────────────────────────────────────────────

class WorldNews {
  /** Fetch all sources, 20 articles each. */
  async fetchAll(count = DEFAULT_COUNT, sources = null) {
    const results = {};
    const targets = sources || Object.keys(SOURCE_NAMES);

    for (const key of targets) {
      const name = SOURCE_NAMES[key];
      if (!name) continue;

      if (key === 'guardian') {
        results[name] = await fetchGuardian(count);
      } else {
        const feed = RSS_FEEDS[key];
        if (feed) {
          try {
            const xml = await httpGet(feed);
            results[name] = parseRss(xml, name, count);
          } catch (e) {
            results[name] = [{ source: name, error: e.message }];
          }
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

  /** Fetch a single source by code (guardian, bbc, aj, nyt, fox). */
  async fetchSource(code, count = DEFAULT_COUNT) {
    return this.fetchAll(count, [code]);
  }
}

module.exports = WorldNews;

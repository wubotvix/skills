/**
 * AutoClaw Top-10 US News Skill — fetch & format for LLM
 * Pulls top 10 daily US news from 3 major sources via RSS.
 * No external dependencies. Node.js built-in APIs only.
 *
 * Sources:
 *   nyt = New York Times US (RSS)
 *   fox = Fox News US (RSS)
 *   npr = NPR News (RSS)
 *
 * Usage:
 *   const USNews = require('./USNews');
 *   const news = new USNews();
 *   const result = await news.fetchAll();
 *   const result = await news.fetchAll(5, ['nyt', 'fox']);
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 12000;
const UA = 'AutoClaw-USNews/1.0';
const DEFAULT_COUNT = 10;

const SOURCE_NAMES = { nyt: 'New York Times', fox: 'Fox News', npr: 'NPR' };
const SOURCE_FEEDS = {
  nyt: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
  fox: 'https://moxie.foxnews.com/google-publisher/us.xml',
  npr: 'https://feeds.npr.org/1001/rss.xml',
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
  return `Top US News (${now}) - ${idx - 1} articles from ${Object.keys(allResults).length} sources\n${sb}`;
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
  return `# Top US News - ${now}\n**${total} articles from ${Object.keys(allResults).length} sources**\n${sb}`;
}

// ── Public API ────────────────────────────────────────────

class USNews {
  /** Fetch all sources, 10 articles each. */
  async fetchAll(count = DEFAULT_COUNT, sources = null) {
    const results = {};
    const targets = sources || Object.keys(SOURCE_NAMES);

    for (const key of targets) {
      const name = SOURCE_NAMES[key];
      const feed = SOURCE_FEEDS[key];
      if (!name || !feed) continue;
      try {
        const xml = await httpGet(feed);
        results[name] = parseRss(xml, name, count);
      } catch (e) {
        results[name] = [{ source: name, error: e.message }];
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

  /** Fetch a single source by code (nyt, fox, npr). */
  async fetchSource(code, count = DEFAULT_COUNT) {
    return this.fetchAll(count, [code]);
  }
}

module.exports = USNews;

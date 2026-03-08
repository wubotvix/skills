/**
 * AutoClaw CN Tech News Skill
 * Aggregates top 20 Chinese tech news from 4 sources via RSS.
 * No external dependencies. Node.js built-in APIs only.
 * Content in Chinese.
 *
 * Sources (RSS):
 *   36kr    = 36氪 (36kr.com/feed)
 *   tmt     = 钛媒体 (tmtpost.com/rss.xml)
 *   ithome  = IT之家 (ithome.com/rss/)
 *   sspai   = 少数派 (sspai.com/feed)
 *
 * Usage:
 *   const CNTechNews = require('./CNTechNews');
 *   const news = new CNTechNews();
 *   const result = await news.fetchAll();
 *   const result = await news.fetchAll(10, ['36kr', 'ithome']);
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 15000;
const UA = 'AutoClaw-CNTechNews/1.0';
const DEFAULT_COUNT = 20;

const SOURCE_NAMES = {
  '36kr': '36\u6c2a',
  tmt: '\u949b\u5a92\u4f53',
  ithome: 'IT\u4e4b\u5bb6',
  sspai: '\u5c11\u6570\u6d3e',
};

const RSS_FEEDS = {
  '36kr': 'https://36kr.com/feed',
  tmt: 'https://www.tmtpost.com/rss.xml',
  ithome: 'https://www.ithome.com/rss/',
  sspai: 'https://sspai.com/feed',
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
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
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
    const description = clean(
      extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'encoded')
    );
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
  const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  return `\u4e2d\u56fd\u79d1\u6280\u65b0\u95fb (${now}) - ${idx - 1} \u7bc7\u6587\u7ae0\n${sb}`;
}

function fmtDetailed(allResults) {
  let sb = '';
  let total = 0;
  for (const [name, articles] of Object.entries(allResults)) {
    const valid = articles.filter(a => !a.error && a.title);
    const errors = articles.filter(a => a.error);
    sb += `\n## ${name} (${valid.length} \u7bc7)\n`;
    for (const e of errors) sb += `  [\u9519\u8bef: ${e.error}]\n`;
    let i = 1;
    for (const a of valid) {
      sb += `  ${i}. **${a.title}**\n`;
      if (a.url) sb += `     ${a.url}\n`;
      if (a.description) {
        sb += `     ${a.description.length > 250 ? a.description.substring(0, 250) : a.description}\n`;
      }
      if (a.published) sb += `     \u53d1\u5e03: ${a.published}\n`;
      i++; total++;
    }
  }
  const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  return `# \u4e2d\u56fd\u79d1\u6280\u65b0\u95fb - ${now}\n**${total} \u7bc7\u6587\u7ae0\uff0c\u6765\u81ea ${Object.keys(allResults).length} \u4e2a\u6e90**\n${sb}`;
}

// ── Public API ────────────────────────────────────────────

class CNTechNews {
  /** Fetch all sources, 20 articles each. */
  async fetchAll(count = DEFAULT_COUNT, sources = null) {
    const results = {};
    const targets = sources || Object.keys(SOURCE_NAMES);

    for (const key of targets) {
      const name = SOURCE_NAMES[key];
      const feed = RSS_FEEDS[key];
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

  /** Fetch a single source by code (36kr, tmt, ithome, sspai). */
  async fetchSource(code, count = DEFAULT_COUNT) {
    return this.fetchAll(count, [code]);
  }
}

module.exports = CNTechNews;

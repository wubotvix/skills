/**
 * AutoClaw Top-20 CN News Skill
 * Pulls top 10 daily China news from 3 Sina RSS sections.
 * No external dependencies. Node.js built-in APIs only.
 * Content in Chinese.
 *
 * Sources (all from rss.sina.com.cn):
 *   headlines = 新浪头条 (marquee/ddt.xml)
 *   china     = 国内新闻 (china/china_report.xml)
 *   society   = 社会新闻 (society/society_report.xml)
 *
 * Usage:
 *   const CNNews = require('./CNNews');
 *   const news = new CNNews();
 *   const result = await news.fetchAll();
 *   const result = await news.fetchAll(5, ['headlines', 'china']);
 */

const https = require('https');
const http = require('http');

const TIMEOUT = 15000;
const UA = 'AutoClaw-CNNews/1.0';
const DEFAULT_COUNT = 10;

const SOURCE_NAMES = {
  headlines: '\u65b0\u6d6a\u5934\u6761',
  china: '\u56fd\u5185\u65b0\u95fb',
  society: '\u793e\u4f1a\u65b0\u95fb',
};

const SOURCE_FEEDS = {
  headlines: 'https://rss.sina.com.cn/news/marquee/ddt.xml',
  china: 'https://rss.sina.com.cn/news/china/china_report.xml',
  society: 'https://rss.sina.com.cn/news/society/society_report.xml',
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
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
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
  return `\u4e2d\u56fd\u65b0\u95fb (${now}) - ${idx - 1} \u7bc7\u6587\u7ae0\uff0c\u6765\u81ea ${Object.keys(allResults).length} \u4e2a\u680f\u76ee\n${sb}`;
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
  return `# \u4e2d\u56fd\u65b0\u95fb - ${now}\n**${total} \u7bc7\u6587\u7ae0\uff0c\u6765\u81ea ${Object.keys(allResults).length} \u4e2a\u680f\u76ee**\n${sb}`;
}

// ── Public API ────────────────────────────────────────────

class CNNews {
  /** Fetch all sections, 10 articles each. */
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

  /** Fetch a single section by code (headlines, china, society). */
  async fetchSource(code, count = DEFAULT_COUNT) {
    return this.fetchAll(count, [code]);
  }
}

module.exports = CNNews;

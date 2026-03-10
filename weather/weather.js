// eClaw Weather — Open-Meteo API (current, forecast, alerts). No API key, no deps.

const https = require('https');

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT = 8000;
const UA = 'eClaw-Weather/2.0';

const DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const WMO = {
  0:  ['Clear sky',              '\u2600\ufe0f'],
  1:  ['Mainly clear',           '\uD83C\uDF24\ufe0f'],
  2:  ['Partly cloudy',          '\u26c5'],
  3:  ['Overcast',               '\u2601\ufe0f'],
  45: ['Fog',                    '\uD83C\uDF2B\ufe0f'],
  48: ['Rime fog',               '\uD83C\uDF2B\ufe0f'],
  51: ['Light drizzle',          '\uD83C\uDF26\ufe0f'],
  53: ['Drizzle',                '\uD83C\uDF26\ufe0f'],
  55: ['Dense drizzle',          '\uD83C\uDF27\ufe0f'],
  56: ['Freezing drizzle',       '\uD83C\uDF27\ufe0f\u2744\ufe0f'],
  57: ['Heavy freezing drizzle', '\uD83C\uDF27\ufe0f\u2744\ufe0f'],
  61: ['Slight rain',            '\uD83C\uDF26\ufe0f'],
  63: ['Moderate rain',          '\uD83C\uDF27\ufe0f'],
  65: ['Heavy rain',             '\uD83C\uDF27\ufe0f'],
  66: ['Freezing rain',          '\uD83E\uDDCA\uD83C\uDF27\ufe0f'],
  67: ['Heavy freezing rain',    '\uD83E\uDDCA\uD83C\uDF27\ufe0f'],
  71: ['Slight snow',            '\uD83C\uDF28\ufe0f'],
  73: ['Moderate snow',          '\uD83C\uDF28\ufe0f'],
  75: ['Heavy snow',             '\u2744\ufe0f'],
  77: ['Snow grains',            '\uD83C\uDF28\ufe0f'],
  80: ['Light showers',          '\uD83C\uDF26\ufe0f'],
  81: ['Moderate showers',       '\uD83C\uDF27\ufe0f'],
  82: ['Violent showers',        '\u26c8\ufe0f'],
  85: ['Light snow showers',     '\uD83C\uDF28\ufe0f'],
  86: ['Heavy snow showers',     '\u2744\ufe0f'],
  95: ['Thunderstorm',           '\u26c8\ufe0f'],
  96: ['T-storm + hail',         '\u26c8\ufe0f\uD83E\uDDCA'],
  99: ['T-storm + heavy hail',   '\u26c8\ufe0f\uD83E\uDDCA'],
};

function c2f(c) { return Math.round((c * 9.0 / 5.0 + 32) * 10) / 10; }
function kmh2mph(k) { return Math.round(k * 0.621371 * 10) / 10; }
function mm2in(mm) { return Math.round(mm * 0.0393701 * 100) / 100; }
function wmoDesc(code) { return WMO[code] ? WMO[code][0] : 'Unknown'; }
function wmoEmoji(code) { return WMO[code] ? WMO[code][1] : '?'; }
function windDir(deg) { let i = Math.round(deg / 22.5) % 16; return DIRS[i < 0 ? i + 16 : i]; }
function dayName(s) { const d = new Date(s + 'T00:00:00Z'); return isNaN(d.getTime()) ? '?' : DAY_NAMES[d.getUTCDay()]; }
function fmtTemp(c, imp) { return c == null ? 'N/A' : imp ? c2f(c) + 'F' : c + 'C'; }
function fmtWind(k, imp) { return k == null ? 'N/A' : imp ? kmh2mph(k) + ' mph' : k + ' km/h'; }
function fmtPrecip(mm, imp) { return mm == null ? 'N/A' : imp ? mm2in(mm) + '"' : mm + ' mm'; }

function httpGet(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' }, timeout: TIMEOUT }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if (redirects >= 5) return reject(new Error('Too many redirects'));
        const loc = res.headers.location;
        return httpGet(loc.startsWith('http') ? loc : new URL(loc, url).href, redirects + 1).then(resolve, reject);
      }
      if (res.statusCode >= 400) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

function jsonGet(url) { return httpGet(url).then(t => { try { return JSON.parse(t); } catch (e) { throw new Error(`Invalid JSON: ${e.message}`); } }); }

async function geocode(location) {
  const data = await jsonGet(`${GEOCODE_URL}?name=${encodeURIComponent(location)}&count=3&language=en&format=json`);
  const r = (data.results || [])[0];
  if (!r) throw new Error(`Location not found: '${location}'`);
  let name = r.name || location;
  if (r.admin1) name += ', ' + r.admin1;
  if (r.country) name += ', ' + r.country;
  return { name, lat: r.latitude, lon: r.longitude, tz: r.timezone || 'auto' };
}

async function resolve(location, unit) {
  const geo = typeof location === 'object' ? location : await geocode(location);
  return { geo, imp: unit === 'fahrenheit' };
}

function buildCurrentResult(geo, c, imp) {
  const code = c.weather_code;
  const r = {
    location: geo.name, time: c.time, condition: wmoDesc(code), emoji: wmoEmoji(code),
    temperature: fmtTemp(c.temperature_2m, imp), feelsLike: fmtTemp(c.apparent_temperature, imp),
    humidity: c.relative_humidity_2m + '%',
    wind: fmtWind(c.wind_speed_10m, imp) + ' ' + windDir(c.wind_direction_10m || 0),
    gusts: fmtWind(c.wind_gusts_10m || 0, imp), pressure: (c.pressure_msl || 0) + ' hPa',
    cloudCover: (c.cloud_cover || 0) + '%', precipitation: fmtPrecip(c.precipitation || 0, imp),
    uvIndex: c.uv_index ?? 0, isDay: (c.is_day ?? 1) === 1,
  };
  const night = r.isDay ? '' : ' (night)';
  r.summary = `${r.emoji} **${geo.name}** - ${r.condition}${night}\n`
    + `  Temp: ${r.temperature} (feels ${r.feelsLike})\n`
    + `  Humidity: ${r.humidity}  |  Cloud: ${r.cloudCover}\n`
    + `  Wind: ${r.wind} (gusts ${r.gusts})\n`
    + `  Precip: ${r.precipitation}  |  UV: ${r.uvIndex}\n`
    + `  As of ${r.time}`;
  r.toJson = () => ({
    location: r.location, time: r.time, condition: r.condition, emoji: r.emoji,
    temperature: r.temperature, feels_like: r.feelsLike, humidity: r.humidity,
    wind: r.wind, gusts: r.gusts, pressure: r.pressure, cloud_cover: r.cloudCover,
    precipitation: r.precipitation, uv_index: r.uvIndex, is_day: r.isDay,
  });
  return r;
}

function buildForecastResult(geo, d, imp) {
  const n = d.time.length;
  const days = [];
  let sb = `**${geo.name}** - ${n}-Day Forecast\n\n`;
  for (let i = 0; i < n; i++) {
    const code = d.weather_code[i];
    const prob = d.precipitation_probability_max?.[i] ?? -1;
    const fd = {
      date: d.time[i], day: dayName(d.time[i]), condition: wmoDesc(code), emoji: wmoEmoji(code),
      rawHiC: d.temperature_2m_max[i], rawLoC: d.temperature_2m_min[i],
      rawWindKmh: d.wind_speed_10m_max[i], rawPrecipMm: d.precipitation_sum[i], rawCode: code,
      high: fmtTemp(d.temperature_2m_max[i], imp), low: fmtTemp(d.temperature_2m_min[i], imp),
      windMax: fmtWind(d.wind_speed_10m_max[i], imp), precipitation: fmtPrecip(d.precipitation_sum[i], imp),
      uvMax: d.uv_index_max?.[i] ?? -1, precipProbability: prob >= 0 ? prob + '%' : 'N/A',
    };
    fd.toJson = () => ({
      date: fd.date, day: fd.day, condition: fd.condition, emoji: fd.emoji,
      high: fd.high, low: fd.low, wind_max: fd.windMax, precipitation: fd.precipitation,
      precip_probability: fd.precipProbability, uv_max: fd.uvMax,
    });
    days.push(fd);
    const probStr = prob > 0 ? ` (${prob}%)` : '';
    sb += `${fd.emoji} **${fd.day} ${fd.date}** - ${fd.condition}\n`
      + `   H ${fd.high}  L ${fd.low}  Wind ${fd.windMax}  Precip ${fd.precipitation}${probStr}\n`;
  }
  return {
    location: geo.name, days, summary: sb.trim(),
    toJson() { return { location: this.location, days: this.days.map(d => d.toJson()) }; },
  };
}

const CURRENT_PARAMS = 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,'
  + 'wind_gusts_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,uv_index,is_day';
const DAILY_PARAMS = 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,'
  + 'precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset,uv_index_max';

function forecastUrl(geo, opts = {}) {
  let url = `${FORECAST_URL}?latitude=${geo.lat}&longitude=${geo.lon}&timezone=${encodeURIComponent(geo.tz)}`;
  if (opts.current) url += `&current=${CURRENT_PARAMS}`;
  if (opts.daily) url += `&daily=${DAILY_PARAMS}&forecast_days=${opts.days || 7}`;
  if (opts.hourly) url += `&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m&forecast_days=3&current=temperature_2m`;
  return url;
}

async function fetchCurrent(geo, imp) {
  const data = await jsonGet(forecastUrl(geo, { current: true }));
  return buildCurrentResult(geo, data.current, imp);
}

async function fetchForecast(geo, imp, days) {
  days = Math.max(1, Math.min(16, days));
  const data = await jsonGet(forecastUrl(geo, { daily: true, days }));
  return buildForecastResult(geo, data.daily, imp);
}

async function fetchHourly(geo, imp, hours) {
  hours = Math.max(1, Math.min(48, hours));
  const data = await jsonGet(forecastUrl(geo, { hourly: true }));
  const h = data.hourly;
  const nowStr = data.current.time;

  let start = h.time.findIndex(t => t >= nowStr);
  if (start === -1) start = h.time.length;
  const end = Math.min(start + hours, h.time.length);
  const entries = [];
  let sb = `**${geo.name}** - Next ${hours}h Forecast\n\n`;

  for (let i = start; i < end; i++) {
    const code = h.weather_code[i];
    const pp = h.precipitation_probability?.[i] ?? 0;
    const e = {
      time: h.time[i], condition: wmoDesc(code), emoji: wmoEmoji(code),
      temperature: fmtTemp(h.temperature_2m[i], imp), wind: fmtWind(h.wind_speed_10m[i], imp),
      precipProbability: pp + '%',
      toJson() { return { time: this.time, condition: this.condition, emoji: this.emoji, temperature: this.temperature, wind: this.wind, precip_probability: this.precipProbability }; },
    };
    entries.push(e);
    const t = e.time.includes('T') ? e.time.split('T')[1] : e.time;
    sb += `${e.emoji} ${t}  ${e.temperature}  ${e.condition}  Rain:${pp}%  Wind:${e.wind}\n`;
  }

  return {
    location: geo.name, hours: entries, summary: sb.trim(),
    toJson() { return { location: this.location, hours: this.hours.map(h => h.toJson()) }; },
  };
}

async function buildAlerts(geo, imp) {
  const forecast = await fetchForecast(geo, imp, 3);
  const alerts = [];
  for (const day of forecast.days) {
    if (day.rawPrecipMm > 25) alerts.push(`[WARNING] Heavy rain ${day.day} (${day.precipitation})`);
    else if (day.rawPrecipMm > 10) alerts.push(`[ADVISORY] Rain ${day.day} (${day.precipitation})`);
    if (day.rawWindKmh > 60) alerts.push(`[WARNING] High winds ${day.day} (${day.windMax})`);
    if ([71, 73, 75, 77, 85, 86].includes(day.rawCode)) alerts.push(`[ADVISORY] Snow ${day.day} - ${day.condition}`);
    if ([95, 96, 99].includes(day.rawCode)) alerts.push(`[WARNING] Thunderstorms ${day.day}`);
    if (day.rawHiC > 38) alerts.push(`[WARNING] Extreme heat ${day.day} (high: ${day.high})`);
    if (day.rawLoC < -5) alerts.push(`[ADVISORY] Freezing temps ${day.day} (low: ${day.low})`);
    if (day.uvMax >= 8) alerts.push(`[ADVISORY] High UV ${day.day} (UV: ${day.uvMax})`);
  }
  const summary = alerts.length
    ? `**${geo.name}** - ${alerts.length} Weather Alert(s)\n` + alerts.join('\n')
    : `**${geo.name}** - No weather alerts for the next 3 days`;
  return {
    location: geo.name, alertCount: alerts.length, alerts, summary,
    toJson() { return { location: this.location, alert_count: this.alertCount, alerts: this.alerts }; },
  };
}

// getSummary fetches current + 3-day forecast in a single HTTP request
async function fetchSummary(geo, imp) {
  const data = await jsonGet(forecastUrl(geo, { current: true, daily: true, days: 3 }));
  const current = buildCurrentResult(geo, data.current, imp);
  const forecast = buildForecastResult(geo, data.daily, imp);
  let sb = current.summary + '\n\n**3-Day Outlook:**\n';
  for (const d of forecast.days) sb += `  ${d.emoji} ${d.day}: ${d.high}/${d.low} - ${d.condition}\n`;
  return {
    current, forecast, summary: sb.trim(),
    toJson() { return { current: this.current.toJson(), forecast: this.forecast.toJson() }; },
  };
}

class Weather {
  async getCurrent(location, unit = 'fahrenheit') { const { geo, imp } = await resolve(location, unit); return fetchCurrent(geo, imp); }
  async getForecast(location, days = 7, unit = 'fahrenheit') { const { geo, imp } = await resolve(location, unit); return fetchForecast(geo, imp, days); }
  async getHourly(location, hours = 24, unit = 'fahrenheit') { const { geo, imp } = await resolve(location, unit); return fetchHourly(geo, imp, hours); }
  async getAlerts(location, unit = 'fahrenheit') { const { geo, imp } = await resolve(location, unit); return buildAlerts(geo, imp); }
  async getSummary(location, unit = 'fahrenheit') { const { geo, imp } = await resolve(location, unit); return fetchSummary(geo, imp); }
  async getByCoords(lat, lon, unit = 'fahrenheit') { return fetchCurrent({ name: `${lat}, ${lon}`, lat, lon, tz: 'auto' }, unit === 'fahrenheit'); }
}

module.exports = Weather;

// CLI: node weather.js <location> [celsius|fahrenheit] [forecast N|alerts|summary]
if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) { console.error('Usage: node weather.js <location> [celsius|fahrenheit] [forecast N|alerts|summary]'); process.exit(1); }
  const location = args.shift();
  const unit = (args[0] === 'celsius' || args[0] === 'fahrenheit') ? args.shift() : 'fahrenheit';
  const cmd = args.shift() || 'current';
  const w = new Weather();
  let p;
  if (cmd === 'forecast') p = w.getForecast(location, Number(args[0]) || 7, unit).then(r => r.summary);
  else if (cmd === 'alerts') p = w.getAlerts(location, unit).then(r => r.summary);
  else if (cmd === 'summary') p = w.getSummary(location, unit).then(r => r.summary);
  else p = w.getCurrent(location, unit).then(r => r.summary);
  p.then(s => console.log(s)).catch(e => { console.error(e.message); process.exit(1); });
}

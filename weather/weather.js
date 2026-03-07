/**
 * AutoClaw Weather Skill — Open-Meteo (api.open-meteo.com)
 * No API key. No external dependencies. Node.js built-in APIs only.
 *
 * Usage:
 *   const Weather = require('./Weather');
 *   const weather = new Weather();
 *   const current = await weather.getCurrent('San Francisco');
 *   const forecast = await weather.getForecast('Tokyo', 5, 'celsius');
 *   const hourly = await weather.getHourly('London', 12, 'fahrenheit');
 *   const alerts = await weather.getAlerts('Seattle');
 *   const summary = await weather.getSummary('Paris');
 *   const coords = await weather.getByCoords(37.7749, -122.4194);
 */

const https = require('https');
const http = require('http');

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT = 8000;
const UA = 'AutoClaw-Weather/2.0';

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

// ── Unit Conversion ───────────────────────────────────────

function c2f(c) { return Math.round((c * 9.0 / 5.0 + 32) * 10) / 10; }
function kmh2mph(k) { return Math.round(k * 0.621371 * 10) / 10; }
function mm2in(mm) { return Math.round(mm * 0.0393701 * 100) / 100; }

function wmoDesc(code) { return WMO[code] ? WMO[code][0] : 'Unknown'; }
function wmoEmoji(code) { return WMO[code] ? WMO[code][1] : '?'; }

function windDir(deg) {
  let idx = Math.round(deg / 22.5) % 16;
  if (idx < 0) idx += 16;
  return DIRS[idx];
}

function dayName(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return isNaN(d.getTime()) ? '?' : DAY_NAMES[d.getDay()];
}

function fmtTemp(c, imperial) { return imperial ? c2f(c) + 'F' : c + 'C'; }
function fmtWind(kmh, imperial) { return imperial ? kmh2mph(kmh) + ' mph' : kmh + ' km/h'; }
function fmtPrecip(mm, imperial) { return imperial ? mm2in(mm) + '"' : mm + ' mm'; }

// ── HTTP ──────────────────────────────────────────────────

function httpGet(url, redirects = 0) {
  const mod = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = mod.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' }, timeout: TIMEOUT }, (res) => {
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

// ── Geocoding ─────────────────────────────────────────────

async function geocode(location) {
  const params = `name=${encodeURIComponent(location)}&count=3&language=en&format=json`;
  const data = JSON.parse(await httpGet(`${GEOCODE_URL}?${params}`));
  const results = data.results;
  if (!results || results.length === 0) throw new Error(`Location not found: '${location}'`);
  const r = results[0];
  let name = r.name || location;
  if (r.admin1) name += ', ' + r.admin1;
  if (r.country) name += ', ' + r.country;
  return { name, lat: r.latitude, lon: r.longitude, tz: r.timezone || 'auto' };
}

function coordsGeo(lat, lon) {
  return { name: `${lat}, ${lon}`, lat, lon, tz: 'auto' };
}

// ── Current Weather ───────────────────────────────────────

async function fetchCurrent(geo, imperial) {
  const params = `latitude=${geo.lat}&longitude=${geo.lon}&timezone=${encodeURIComponent(geo.tz)}`
    + '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,'
    + 'wind_gusts_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,uv_index,is_day';
  const data = JSON.parse(await httpGet(`${FORECAST_URL}?${params}`));
  const c = data.current;
  const code = c.weather_code;

  const r = {
    location: geo.name,
    time: c.time,
    condition: wmoDesc(code),
    emoji: wmoEmoji(code),
    temperature: fmtTemp(c.temperature_2m, imperial),
    feelsLike: fmtTemp(c.apparent_temperature, imperial),
    humidity: c.relative_humidity_2m + '%',
    wind: fmtWind(c.wind_speed_10m, imperial) + ' ' + windDir(c.wind_direction_10m || 0),
    gusts: fmtWind(c.wind_gusts_10m || 0, imperial),
    pressure: (c.pressure_msl || 0) + ' hPa',
    cloudCover: (c.cloud_cover || 0) + '%',
    precipitation: fmtPrecip(c.precipitation || 0, imperial),
    uvIndex: c.uv_index ?? 0,
    isDay: (c.is_day ?? 1) === 1,
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

// ── Forecast ──────────────────────────────────────────────

async function fetchForecast(geo, imperial, days) {
  days = Math.max(1, Math.min(16, days));
  const params = `latitude=${geo.lat}&longitude=${geo.lon}`
    + `&timezone=${encodeURIComponent(geo.tz)}&forecast_days=${days}`
    + '&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,'
    + 'precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset,uv_index_max';
  const data = JSON.parse(await httpGet(`${FORECAST_URL}?${params}`));
  const d = data.daily;

  const times = d.time;
  const hiArr = d.temperature_2m_max;
  const loArr = d.temperature_2m_min;
  const codeArr = d.weather_code;
  const precipArr = d.precipitation_sum;
  const probArr = d.precipitation_probability_max;
  const windArr = d.wind_speed_10m_max;
  const uvArr = d.uv_index_max;

  const n = times.length;
  const resultDays = [];
  let sb = `**${geo.name}** - ${n}-Day Forecast\n\n`;

  for (let i = 0; i < n; i++) {
    const code = codeArr[i];
    const fd = {
      date: times[i],
      day: dayName(times[i]),
      condition: wmoDesc(code),
      emoji: wmoEmoji(code),
      rawHiC: hiArr[i],
      rawLoC: loArr[i],
      rawWindKmh: windArr[i],
      rawPrecipMm: precipArr[i],
      rawCode: code,
      high: fmtTemp(hiArr[i], imperial),
      low: fmtTemp(loArr[i], imperial),
      windMax: fmtWind(windArr[i], imperial),
      precipitation: fmtPrecip(precipArr[i], imperial),
      uvMax: uvArr && uvArr[i] != null ? uvArr[i] : -1,
    };
    const prob = probArr && probArr[i] != null ? probArr[i] : -1;
    fd.precipProbability = prob >= 0 ? prob + '%' : 'N/A';
    fd.toJson = () => ({
      date: fd.date, day: fd.day, condition: fd.condition, emoji: fd.emoji,
      high: fd.high, low: fd.low, wind_max: fd.windMax, precipitation: fd.precipitation,
      precip_probability: fd.precipProbability, uv_max: fd.uvMax,
    });
    resultDays.push(fd);

    const probStr = prob > 0 ? ` (${prob}%)` : '';
    sb += `${fd.emoji} **${fd.day} ${fd.date}** - ${fd.condition}\n`
      + `   H ${fd.high}  L ${fd.low}  Wind ${fd.windMax}  Precip ${fd.precipitation}${probStr}\n`;
  }

  return {
    location: geo.name,
    days: resultDays,
    summary: sb.trim(),
    toJson() {
      return { location: this.location, days: this.days.map(d => d.toJson()) };
    },
  };
}

// ── Hourly ────────────────────────────────────────────────

async function fetchHourly(geo, imperial, hours) {
  hours = Math.max(1, Math.min(48, hours));
  const params = `latitude=${geo.lat}&longitude=${geo.lon}`
    + `&timezone=${encodeURIComponent(geo.tz)}&forecast_days=3`
    + '&current=temperature_2m'
    + '&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,'
    + 'precipitation,wind_speed_10m,relative_humidity_2m';
  const data = JSON.parse(await httpGet(`${FORECAST_URL}?${params}`));
  const h = data.hourly;
  const nowStr = data.current.time;

  const timesArr = h.time;
  const tempArr = h.temperature_2m;
  const codeArr = h.weather_code;
  const probArr = h.precipitation_probability;
  const windArr = h.wind_speed_10m;

  let start = 0;
  for (let i = 0; i < timesArr.length; i++) {
    if (timesArr[i] >= nowStr) { start = i; break; }
  }

  const entries = [];
  let sb = `**${geo.name}** - Next ${hours}h Forecast\n\n`;
  const end = Math.min(start + hours, timesArr.length);

  for (let i = start; i < end; i++) {
    const code = codeArr[i];
    const pp = probArr && probArr[i] != null ? probArr[i] : 0;
    const e = {
      time: timesArr[i],
      condition: wmoDesc(code),
      emoji: wmoEmoji(code),
      temperature: fmtTemp(tempArr[i], imperial),
      wind: fmtWind(windArr[i], imperial),
      precipProbability: pp + '%',
      toJson() {
        return {
          time: this.time, condition: this.condition, emoji: this.emoji,
          temperature: this.temperature, wind: this.wind, precip_probability: this.precipProbability,
        };
      },
    };
    entries.push(e);

    const t = e.time.includes('T') ? e.time.split('T')[1] : e.time;
    sb += `${e.emoji} ${t}  ${e.temperature}  ${e.condition}  Rain:${pp}%  Wind:${e.wind}\n`;
  }

  return {
    location: geo.name,
    hours: entries,
    summary: sb.trim(),
    toJson() {
      return { location: this.location, hours: this.hours.map(h => h.toJson()) };
    },
  };
}

// ── Alerts ────────────────────────────────────────────────

async function buildAlerts(geo, imperial) {
  const forecast = await fetchForecast(geo, imperial, 3);
  const alerts = [];

  for (const day of forecast.days) {
    if (day.rawPrecipMm > 25)
      alerts.push(`[WARNING] Heavy rain ${day.day} (${day.precipitation})`);
    else if (day.rawPrecipMm > 10)
      alerts.push(`[ADVISORY] Rain ${day.day} (${day.precipitation})`);
    if (day.rawWindKmh > 60)
      alerts.push(`[WARNING] High winds ${day.day} (${day.windMax})`);
    if ([71, 73, 75, 77, 85, 86].includes(day.rawCode))
      alerts.push(`[ADVISORY] Snow ${day.day} - ${day.condition}`);
    if ([95, 96, 99].includes(day.rawCode))
      alerts.push(`[WARNING] Thunderstorms ${day.day}`);
    if (day.rawHiC > 38)
      alerts.push(`[WARNING] Extreme heat ${day.day} (high: ${day.high})`);
    if (day.rawLoC < -5)
      alerts.push(`[ADVISORY] Freezing temps ${day.day} (low: ${day.low})`);
    if (day.uvMax >= 8)
      alerts.push(`[ADVISORY] High UV ${day.day} (UV: ${day.uvMax})`);
  }

  let summary;
  if (alerts.length > 0) {
    summary = `**${geo.name}** - ${alerts.length} Weather Alert(s)\n` + alerts.join('\n');
  } else {
    summary = `**${geo.name}** - No weather alerts for the next 3 days`;
  }

  return {
    location: geo.name,
    alertCount: alerts.length,
    alerts,
    summary,
    toJson() {
      return { location: this.location, alert_count: this.alertCount, alerts: this.alerts };
    },
  };
}

// ── Public API ────────────────────────────────────────────

class Weather {
  /** Get current weather for a location. Default: fahrenheit. */
  async getCurrent(location, unit = 'fahrenheit') {
    const geo = await geocode(location);
    return fetchCurrent(geo, unit === 'fahrenheit');
  }

  /** Get daily forecast. Default: 7 days, fahrenheit. */
  async getForecast(location, days = 7, unit = 'fahrenheit') {
    const geo = await geocode(location);
    return fetchForecast(geo, unit === 'fahrenheit', days);
  }

  /** Get hourly forecast. Default: 24 hours, fahrenheit. */
  async getHourly(location, hours = 24, unit = 'fahrenheit') {
    const geo = await geocode(location);
    return fetchHourly(geo, unit === 'fahrenheit', hours);
  }

  /** Get weather alerts for next 3 days. Default: fahrenheit. */
  async getAlerts(location, unit = 'fahrenheit') {
    const geo = await geocode(location);
    return buildAlerts(geo, unit === 'fahrenheit');
  }

  /** Get current + 3-day summary. Default: fahrenheit. */
  async getSummary(location, unit = 'fahrenheit') {
    const imperial = unit === 'fahrenheit';
    const geo = await geocode(location);
    const current = await fetchCurrent(geo, imperial);
    const forecast = await fetchForecast(geo, imperial, 3);

    let sb = current.summary + '\n\n**3-Day Outlook:**\n';
    for (const d of forecast.days) {
      sb += `  ${d.emoji} ${d.day}: ${d.high}/${d.low} - ${d.condition}\n`;
    }

    return {
      current,
      forecast,
      summary: sb.trim(),
      toJson() {
        return { current: this.current.toJson(), forecast: this.forecast.toJson() };
      },
    };
  }

  /** Get current weather by coordinates. Default: fahrenheit. */
  async getByCoords(lat, lon, unit = 'fahrenheit') {
    const geo = coordsGeo(lat, lon);
    return fetchCurrent(geo, unit === 'fahrenheit');
  }
}

module.exports = Weather;

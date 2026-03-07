# Weather Skill — SKILL.md

**Skill:** Weather lookup and forecasting
**Provider:** Open-Meteo (api.open-meteo.com) — free, no API key required
**File:** `weather.js`
**Runtime:** Node.js (18+)
**Dependencies:** None — Node.js built-in APIs only (`https`)

## What It Does

- **Current weather** for any city worldwide
- **7-day forecast** with highs/lows, precipitation, wind
- **Hourly forecast** for the next 24-48 hours
- **Weather alerts** (rain, snow, wind, heat, freeze, UV)
- **Quick summary** — current + 3-day outlook in one call
- **Geocoding** — just give it a city name, it finds coordinates
- **Units** — Fahrenheit (default) or Celsius
- **JSON output** — via `toJson()` on all result objects

## Node.js Usage

```js
const Weather = require('./weather');
const weather = new Weather();

// Current weather (async/await)
const current = await weather.getCurrent('San Francisco');
console.log(current.summary);        // formatted text
console.log(current.temperature);     // "52.9F"
console.log(current.toJson());        // plain object

// Forecast with options
const forecast = await weather.getForecast('Tokyo', 5, 'celsius');
for (const day of forecast.days) {
  console.log(`${day.day}: ${day.high}/${day.low}`);
}

// Hourly
const hourly = await weather.getHourly('London', 12, 'fahrenheit');

// Alerts
const alerts = await weather.getAlerts('Seattle');

// Summary (current + 3-day)
const summary = await weather.getSummary('Paris');

// By coordinates
const coords = await weather.getByCoords(37.7749, -122.4194);
```

## Files

| File | Description |
|------|-------------|
| `weather.js` | Node.js — async/await, built-in APIs only |
| `SKILL.md` | This documentation |

## API Methods

| Method | Args | Returns |
|--------|------|---------|
| `getCurrent` | location, [unit] | `CurrentResult` |
| `getForecast` | location, [days], [unit] | `ForecastResult` |
| `getHourly` | location, [hours], [unit] | `HourlyResult` |
| `getAlerts` | location, [unit] | `AlertResult` |
| `getSummary` | location, [unit] | `SummaryResult` |
| `getByCoords` | lat, lon, [unit] | `CurrentResult` |

All methods are async — returns Promises.

## Alert Thresholds

| Alert | Threshold |
|-------|-----------|
| Heavy rain | >25mm/day |
| Rain advisory | >10mm/day |
| High wind | >60 km/h |
| Snow | WMO codes 71-86 |
| Thunderstorm | WMO codes 95-99 |
| Extreme heat | >38C (100F) |
| Freeze | <-5C (23F) |
| High UV | UV index >= 8 |

## Requirements

- Node.js 18+ (uses `https` module)
- Internet access
- No API key needed

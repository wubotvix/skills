# Weather Skill

Current weather, forecasts, and alerts for any city. Uses Open-Meteo (free, no API key). No deps.

## CLI (no LLM needed)

```bash
node weather.js "San Francisco"           # current weather (Fahrenheit)
node weather.js "Tokyo" celsius           # current weather (Celsius)
node weather.js "London" forecast 5       # 5-day forecast
node weather.js "Seattle" alerts          # weather alerts
node weather.js "Paris" summary           # current + 3-day outlook
```

## Module Usage

```js
const w = new (require('./weather'))();
const cur = await w.getCurrent('San Francisco');       // current
const fc  = await w.getForecast('Tokyo', 5, 'celsius'); // forecast
const hr  = await w.getHourly('London', 12);           // hourly
const al  = await w.getAlerts('Seattle');               // alerts
const sum = await w.getSummary('Paris');                // summary
const co  = await w.getByCoords(37.77, -122.42);       // by coords

cur.summary       // formatted text
cur.toJson()      // raw data
```

## Features

- Current weather, 7-day forecast, hourly forecast
- Weather alerts (rain, snow, wind, heat, freeze, UV)
- Geocoding built-in — just pass a city name
- Fahrenheit (default) or Celsius

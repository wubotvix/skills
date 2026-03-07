# Weather Skill — SKILL.md

**Skill:** Weather lookup and forecasting
**Provider:** Open-Meteo (api.open-meteo.com) — free, no API key required
**File:** `Weather.java`
**Runtime:** Android (API 21+)
**Dependencies:** None — Android built-in APIs only (`HttpURLConnection`, `JSONObject`)

## What It Does

- **Current weather** for any city worldwide
- **7-day forecast** with highs/lows, precipitation, wind
- **Hourly forecast** for the next 24-48 hours
- **Weather alerts** (rain, snow, wind, heat, freeze, UV)
- **Quick summary** — current + 3-day outlook in one call
- **Geocoding** — just give it a city name, it finds coordinates
- **Units** — Fahrenheit (default) or Celsius
- **JSON output** — via `toJson()` on all result objects

## Android Java Usage

```java
Weather weather = new Weather();

// Current weather (async with callback)
weather.getCurrent("San Francisco", new Weather.Callback<Weather.CurrentResult>() {
    @Override
    public void onSuccess(Weather.CurrentResult result) {
        Log.d("Weather", result.summary);        // formatted text
        Log.d("Weather", result.temperature);     // "52.9F"
        Log.d("Weather", result.toJson().toString()); // JSON
    }
    @Override
    public void onError(String error) {
        Log.e("Weather", error);
    }
});

// Forecast with options
weather.getForecast("Tokyo", 5, "celsius", new Weather.Callback<Weather.ForecastResult>() {
    @Override
    public void onSuccess(Weather.ForecastResult result) {
        for (Weather.ForecastDay day : result.days) {
            Log.d("Weather", day.day + ": " + day.high + "/" + day.low);
        }
    }
    @Override
    public void onError(String error) { }
});

// Hourly
weather.getHourly("London", 12, "fahrenheit", callback);

// Alerts
weather.getAlerts("Seattle", callback);

// Summary (current + 3-day)
weather.getSummary("Paris", callback);

// By coordinates
weather.getByCoords(37.7749, -122.4194, callback);

// Cleanup when done
weather.shutdown();
```

## Files

| File | Description |
|------|-------------|
| `Weather.java` | Android Java — async callbacks, built-in APIs only |
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

All methods are async — results delivered via `Callback<T>`.

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

- Android API 21+ (uses `HttpURLConnection`, `org.json`, `java.net`)
- Internet access
- No API key needed

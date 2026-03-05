# Weather Skill — SKILL.md

**Skill:** Weather lookup and forecasting
**Provider:** Open-Meteo (api.open-meteo.com) — free, no API key required
**File:** `weather.py` (Python 3)
**Runtime:** Python 3.8+ (uses only stdlib: `urllib`, `json`)
**Dependencies:** None — zero pip packages, zero npm, instant startup

## What It Does

- **Current weather** for any city worldwide
- **7-day forecast** with highs/lows, precipitation, wind
- **Hourly forecast** for the next 24-48 hours
- **Weather alerts** (rain, snow, wind, heat, freeze, UV)
- **Quick summary** — current + 3-day outlook in one call
- **Geocoding** — just give it a city name, it finds coordinates
- **Units** — Fahrenheit (default) or Celsius
- **JSON output** — for programmatic use

## Performance

- **~3s** total (geocode + weather API, network-bound)
- **0 startup overhead** — pure Python stdlib, no imports to install
- **8s timeout** on API calls — fails fast if network is slow

## CLI Usage

```bash
# Use the convenience wrapper:
./weather current "San Francisco"

# Or call directly:
python3 weather.py current "San Francisco"

# Current weather
./weather current "Tokyo" --celsius

# Daily forecast (default 7 days)
./weather forecast "New York" --days 5

# Hourly forecast (default 24 hours)
./weather hourly "London" --hours 12

# Weather alerts
./weather alerts "Seattle"

# Current + 3-day summary (best for chat)
./weather summary "Paris"

# By coordinates (no geocoding needed)
./weather coords 37.7749 -122.4194

# JSON output for programmatic use
./weather current "Berlin" --json
```

## Library Usage (Python import)

```python
from weather import geocode, get_current, get_forecast, get_hourly, get_alerts, quick_summary, Fmt

fmt = Fmt('fahrenheit')  # or 'celsius'

# Geocode a city
geo = geocode('San Francisco')

# Current weather
current = get_current(geo, fmt)
print(current['summary'])       # formatted text
print(current['temperature'])   # "52.9F"

# Forecast
forecast = get_forecast(geo, fmt, days=5)
print(forecast['summary'])

# Hourly
hourly = get_hourly(geo, fmt, hours=12)

# Alerts
alerts = get_alerts(geo, fmt)
print(alerts['alert_count'])

# One-shot summary (text string)
text = quick_summary(geo, fmt)

# JSON for API responses
import json
print(json.dumps(current, indent=2))
```

## Files

| File | Description |
|------|-------------|
| `weather.py` | Main skill — Python 3, CLI + importable functions |
| `weather` | Shell wrapper — convenience script |
| `SKILL.md` | This documentation |

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--celsius` | — | Use Celsius units |
| `--fahrenheit` | — | Use Fahrenheit (default) |
| `--unit <c/f>` | fahrenheit | Alternative unit flag |
| `--days N` | 7 | Forecast days (1-16) |
| `--hours N` | 24 | Hourly forecast hours (1-48) |
| `--json` | — | Output raw JSON instead of summary |
| `-h`, `--help` | — | Show help |

## Alert Thresholds

| Alert | Threshold |
|-------|-----------|
| Heavy rain | >25mm/day |
| Rain advisory | >10mm/day |
| High wind | >60 km/h |
| Snow | WMO codes 71-86 |
| Thunderstorm | WMO codes 95-99 |
| Extreme heat | >38°C (100°F) |
| Freeze | <-5°C (23°F) |
| High UV | UV index >= 8 |

## Requirements

- **Python 3.8+** (uses `urllib.request`, `json` — all stdlib)
- No pip install needed — zero external dependencies
- Works anywhere Python 3 runs (Linux, macOS, Windows, Android/Termux)

## API

- Forecast: `https://api.open-meteo.com/v1/forecast`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- No authentication needed
- Rate limits: generous (non-commercial use)

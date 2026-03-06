#!/usr/bin/env python3
"""
AutoClaw Weather Skill — Open-Meteo (api.open-meteo.com)
No API key. No pip installs. Zero dependencies. Fast.

Usage:
  ./weather.py current "San Francisco"
  ./weather.py forecast "Tokyo" --days 5
  ./weather.py hourly "London" --hours 12
  ./weather.py alerts "Seattle"
  ./weather.py summary "Paris"
  ./weather.py coords 37.7749 -122.4194

Flags:
  --celsius / --fahrenheit   Unit system (default: fahrenheit)
  --days N                   Forecast days 1-16 (default: 7)
  --hours N                  Hourly hours 1-48 (default: 24)
  --json                     Raw JSON output
"""
import sys, json, urllib.request, urllib.parse
from datetime import datetime

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
GEOCODE_URL  = "https://geocoding-api.open-meteo.com/v1/search"
TIMEOUT      = 8

WMO = {
    0:("Clear sky","\u2600\ufe0f"),1:("Mainly clear","\U0001f324\ufe0f"),
    2:("Partly cloudy","\u26c5"),3:("Overcast","\u2601\ufe0f"),
    45:("Fog","\U0001f32b\ufe0f"),48:("Rime fog","\U0001f32b\ufe0f"),
    51:("Light drizzle","\U0001f326\ufe0f"),53:("Drizzle","\U0001f326\ufe0f"),
    55:("Dense drizzle","\U0001f327\ufe0f"),
    56:("Freezing drizzle","\U0001f327\ufe0f\u2744\ufe0f"),
    57:("Heavy freezing drizzle","\U0001f327\ufe0f\u2744\ufe0f"),
    61:("Slight rain","\U0001f326\ufe0f"),63:("Moderate rain","\U0001f327\ufe0f"),
    65:("Heavy rain","\U0001f327\ufe0f"),
    66:("Freezing rain","\U0001f9ca\U0001f327\ufe0f"),
    67:("Heavy freezing rain","\U0001f9ca\U0001f327\ufe0f"),
    71:("Slight snow","\U0001f328\ufe0f"),73:("Moderate snow","\U0001f328\ufe0f"),
    75:("Heavy snow","\u2744\ufe0f"),77:("Snow grains","\U0001f328\ufe0f"),
    80:("Light showers","\U0001f326\ufe0f"),81:("Moderate showers","\U0001f327\ufe0f"),
    82:("Violent showers","\u26c8\ufe0f"),
    85:("Light snow showers","\U0001f328\ufe0f"),86:("Heavy snow showers","\u2744\ufe0f"),
    95:("Thunderstorm","\u26c8\ufe0f"),
    96:("T-storm + hail","\u26c8\ufe0f\U0001f9ca"),
    99:("T-storm + heavy hail","\u26c8\ufe0f\U0001f9ca"),
}

DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
        'S','SSW','SW','WSW','W','WNW','NW','NNW']
DAYNAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

def c2f(c):     return round(c * 9/5 + 32, 1)
def kmh2mph(k): return round(k * 0.621371, 1)
def mm2in(mm):  return round(mm * 0.0393701, 2)
def wmo_desc(code):  return WMO.get(code, ("Unknown","?"))[0]
def wmo_emoji(code): return WMO.get(code, ("Unknown","?"))[1]
def wind_dir(deg):
    if deg is None: return "N/A"
    return DIRS[round(deg / 22.5) % 16]
def day_name(ds):
    return DAYNAMES[datetime.strptime(ds, "%Y-%m-%d").weekday()]

def api_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AutoClaw-Weather/2.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return json.loads(resp.read())

class Fmt:
    __slots__ = ('imperial',)
    def __init__(self, unit='fahrenheit'):
        self.imperial = (unit == 'fahrenheit')
    def temp(self, c):
        return f"{c2f(c)}F" if self.imperial else f"{c}C"
    def wind(self, kmh):
        return f"{kmh2mph(kmh)} mph" if self.imperial else f"{kmh} km/h"
    def precip(self, mm):
        return f'{mm2in(mm)}"' if self.imperial else f"{mm} mm"

def geocode(location):
    params = urllib.parse.urlencode({"name": location, "count": 3, "language": "en", "format": "json"})
    data = api_get(f"{GEOCODE_URL}?{params}")
    results = data.get("results")
    if not results:
        raise SystemExit(f"Location not found: '{location}'")
    r = results[0]
    parts = [r.get("name", location)]
    if r.get("admin1"): parts.append(r["admin1"])
    if r.get("country"): parts.append(r["country"])
    return {"name": ", ".join(parts), "lat": r["latitude"], "lon": r["longitude"], "tz": r.get("timezone", "auto")}

def get_current(geo, fmt):
    params = urllib.parse.urlencode({
        "latitude": geo["lat"], "longitude": geo["lon"], "timezone": geo["tz"],
        "current": "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,uv_index,is_day",
    })
    data = api_get(f"{FORECAST_URL}?{params}")
    c = data["current"]
    code = c["weather_code"]
    loc = geo["name"]
    night = "" if c.get("is_day") else " (night)"
    result = {
        "location": loc, "time": c["time"],
        "condition": wmo_desc(code), "emoji": wmo_emoji(code),
        "temperature": fmt.temp(c["temperature_2m"]),
        "feels_like": fmt.temp(c["apparent_temperature"]),
        "humidity": f'{c["relative_humidity_2m"]}%',
        "wind": f'{fmt.wind(c["wind_speed_10m"])} {wind_dir(c.get("wind_direction_10m"))}',
        "gusts": fmt.wind(c.get("wind_gusts_10m", 0)),
        "pressure": f'{c.get("pressure_msl", "N/A")} hPa',
        "cloud_cover": f'{c.get("cloud_cover", "N/A")}%',
        "precipitation": fmt.precip(c.get("precipitation", 0)),
        "uv_index": c.get("uv_index", "N/A"),
        "is_day": bool(c.get("is_day")),
    }
    result["summary"] = "\n".join([
        f'{result["emoji"]} **{loc}** - {result["condition"]}{night}',
        f'  Temp: {result["temperature"]} (feels {result["feels_like"]})',
        f'  Humidity: {result["humidity"]}  |  Cloud: {result["cloud_cover"]}',
        f'  Wind: {result["wind"]} (gusts {result["gusts"]})',
        f'  Precip: {result["precipitation"]}  |  UV: {result["uv_index"]}',
        f'  As of {result["time"]}',
    ])
    return result

def get_forecast(geo, fmt, days=7):
    days = max(1, min(16, days))
    params = urllib.parse.urlencode({
        "latitude": geo["lat"], "longitude": geo["lon"],
        "timezone": geo["tz"], "forecast_days": days,
        "daily": "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset,uv_index_max",
    })
    data = api_get(f"{FORECAST_URL}?{params}")
    d = data["daily"]
    loc = geo["name"]
    n = len(d["time"])
    forecast_days = []
    lines = [f'**{loc}** - {n}-Day Forecast\n']
    for i in range(n):
        code = d["weather_code"][i]
        hi = fmt.temp(d["temperature_2m_max"][i])
        lo = fmt.temp(d["temperature_2m_min"][i])
        pr = fmt.precip(d["precipitation_sum"][i])
        prob = d.get("precipitation_probability_max", [None]*n)[i]
        prob_s = f" ({prob}%)" if prob and prob > 0 else ""
        wn = fmt.wind(d["wind_speed_10m_max"][i])
        dn = day_name(d["time"][i])
        em = wmo_emoji(code)
        cond = wmo_desc(code)
        day_data = {
            "date": d["time"][i], "day": dn, "condition": cond, "emoji": em,
            "high": hi, "low": lo, "wind_max": wn, "precipitation": pr,
            "precip_probability": f"{prob}%" if prob is not None else "N/A",
            "uv_max": d.get("uv_index_max", [None]*n)[i],
            "_raw_hi_c": d["temperature_2m_max"][i], "_raw_lo_c": d["temperature_2m_min"][i],
            "_raw_wind_kmh": d["wind_speed_10m_max"][i],
            "_raw_precip_mm": d["precipitation_sum"][i], "_raw_code": code,
        }
        forecast_days.append(day_data)
        lines.append(f'{em} **{dn} {d["time"][i]}** - {cond}\n   H {hi}  L {lo}  Wind {wn}  Precip {pr}{prob_s}')
    return {"location": loc, "days": forecast_days, "summary": "\n".join(lines)}

def get_hourly(geo, fmt, hours=24):
    hours = max(1, min(48, hours))
    params = urllib.parse.urlencode({
        "latitude": geo["lat"], "longitude": geo["lon"],
        "timezone": geo["tz"], "forecast_days": 3,
        "current": "temperature_2m",
        "hourly": "temperature_2m,apparent_temperature,weather_code,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m",
    })
    data = api_get(f"{FORECAST_URL}?{params}")
    h = data["hourly"]
    loc = geo["name"]
    # Use the API's current time (in the requested timezone) to find start index
    now_str = data["current"]["time"]
    start = 0
    for i, t in enumerate(h["time"]):
        if t >= now_str:
            start = i
            break
    entries = []
    lines = [f'**{loc}** - Next {hours}h Forecast\n']
    for i in range(start, min(start + hours, len(h["time"]))):
        code = h["weather_code"][i]
        em = wmo_emoji(code)
        t = h["time"][i].split("T")[1] if "T" in h["time"][i] else h["time"][i]
        temp = fmt.temp(h["temperature_2m"][i])
        cond = wmo_desc(code)
        pp = h.get("precipitation_probability", [0]*len(h["time"]))[i] or 0
        wn = fmt.wind(h["wind_speed_10m"][i])
        entries.append({"time": h["time"][i], "condition": cond, "emoji": em,
            "temperature": temp, "wind": wn, "precip_probability": f"{pp}%"})
        lines.append(f'{em} {t}  {temp}  {cond}  Rain:{pp}%  Wind:{wn}')
    return {"location": loc, "hours": entries, "summary": "\n".join(lines)}

def get_alerts(geo, fmt):
    forecast = get_forecast(geo, fmt, days=3)
    alerts = []
    loc = forecast["location"]
    for day in forecast["days"]:
        mm, wk = day["_raw_precip_mm"], day["_raw_wind_kmh"]
        hi, lo = day["_raw_hi_c"], day["_raw_lo_c"]
        code, dn, uv = day["_raw_code"], day["day"], day.get("uv_max")
        if mm > 25: alerts.append(f'[WARNING] Heavy rain {dn} ({day["precipitation"]})')
        elif mm > 10: alerts.append(f'[ADVISORY] Rain {dn} ({day["precipitation"]})')
        if wk > 60: alerts.append(f'[WARNING] High winds {dn} ({day["wind_max"]})')
        if code in (71,73,75,77,85,86): alerts.append(f'[ADVISORY] Snow {dn} - {day["condition"]}')
        if code in (95,96,99): alerts.append(f'[WARNING] Thunderstorms {dn}')
        if hi > 38: alerts.append(f'[WARNING] Extreme heat {dn} (high: {day["high"]})')
        if lo < -5: alerts.append(f'[ADVISORY] Freezing temps {dn} (low: {day["low"]})')
        if uv is not None and uv >= 8: alerts.append(f'[ADVISORY] High UV {dn} (UV: {uv})')
    if alerts:
        summary = f'**{loc}** - {len(alerts)} Weather Alert(s)\n' + "\n".join(alerts)
    else:
        summary = f'**{loc}** - No weather alerts for the next 3 days'
    return {"location": loc, "alert_count": len(alerts), "alerts": alerts, "summary": summary}

def quick_summary(geo, fmt):
    current = get_current(geo, fmt)
    forecast = get_forecast(geo, fmt, days=3)
    lines = [current["summary"], "", "**3-Day Outlook:**"]
    for d in forecast["days"]:
        lines.append(f'  {d["emoji"]} {d["day"]}: {d["high"]}/{d["low"]} - {d["condition"]}')
    return "\n".join(lines)

def coords_geo(lat, lon):
    return {"name": f"{lat}, {lon}", "lat": float(lat), "lon": float(lon), "tz": "auto"}

HELP = """AutoClaw Weather Skill - Open-Meteo (api.open-meteo.com)
No API key. No pip install. Zero dependencies. Fast.

Usage:
  weather.py current  "San Francisco"
  weather.py forecast "Tokyo" --days 5
  weather.py hourly   "London" --hours 12
  weather.py alerts   "Seattle"
  weather.py summary  "Paris"
  weather.py coords   37.7749 -122.4194

Flags:
  --celsius / --fahrenheit   Unit system (default: fahrenheit)
  --days N                   Forecast days 1-16 (default: 7)
  --hours N                  Hourly hours 1-48 (default: 24)
  --json                     Raw JSON output
  -h, --help                 Show help"""

def main():
    args = sys.argv[1:]
    if not args or "-h" in args or "--help" in args or args[0] == "help":
        print(HELP); return
    unit, days, hours, as_json = "fahrenheit", 7, 24, False
    def pull(flag):
        nonlocal args
        if flag in args: args.remove(flag); return True
        return False
    def pull_val(flag):
        nonlocal args
        if flag in args:
            i = args.index(flag)
            if i + 1 < len(args):
                val = args[i + 1]; args = args[:i] + args[i+2:]; return val
            else:
                args = args[:i] + args[i+1:]; return None
        return None
    v = pull_val("--unit")
    if v: unit = v
    if pull("--celsius"): unit = "celsius"
    elif pull("--fahrenheit"): unit = "fahrenheit"
    v = pull_val("--days")
    if v:
        try: days = int(v)
        except ValueError: raise SystemExit(f"Invalid --days value: {v}")
    v = pull_val("--hours")
    if v:
        try: hours = int(v)
        except ValueError: raise SystemExit(f"Invalid --hours value: {v}")
    as_json = pull("--json")
    cmd = args[0] if args else "help"
    loc = " ".join(args[1:]) if len(args) > 1 else None
    fmt = Fmt(unit)
    try:
        if cmd == "current":
            if not loc: raise SystemExit("Error: Specify a location")
            result = get_current(geocode(loc), fmt)
        elif cmd == "forecast":
            if not loc: raise SystemExit("Error: Specify a location")
            result = get_forecast(geocode(loc), fmt, days)
        elif cmd == "hourly":
            if not loc: raise SystemExit("Error: Specify a location")
            result = get_hourly(geocode(loc), fmt, hours)
        elif cmd == "alerts":
            if not loc: raise SystemExit("Error: Specify a location")
            result = get_alerts(geocode(loc), fmt)
        elif cmd == "summary":
            if not loc: raise SystemExit("Error: Specify a location")
            geo = geocode(loc)
            if as_json:
                current = get_current(geo, fmt)
                forecast = get_forecast(geo, fmt, days=3)
                clean_current = {k: v for k, v in current.items() if not k.startswith("_") and k != "summary"}
                clean_days = [{k: v for k, v in d.items() if not k.startswith("_")} for d in forecast["days"]]
                result = {"location": geo["name"], "current": clean_current, "forecast": clean_days}
                print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print(quick_summary(geo, fmt))
            return
        elif cmd == "coords":
            if len(args) < 3: raise SystemExit("Error: Provide lat lon")
            result = get_current(coords_geo(args[1], args[2]), fmt)
        else:
            raise SystemExit(f"Unknown command: {cmd}\nCommands: current, forecast, hourly, alerts, coords, summary")
        if as_json:
            clean = {k: v for k, v in result.items() if not k.startswith("_") and k != "summary"}
            if "days" in clean:
                clean["days"] = [{k: v for k, v in d.items() if not k.startswith("_")} for d in clean["days"]]
            print(json.dumps(clean, indent=2, ensure_ascii=False))
        else:
            print(result["summary"])
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr); sys.exit(1)

if __name__ == "__main__":
    main()

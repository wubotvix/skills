package skills.weather;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * AutoClaw Weather Skill — Open-Meteo (api.open-meteo.com)
 * No API key. No external dependencies. Android built-in APIs only.
 *
 * Usage:
 *   Weather weather = new Weather();
 *   weather.getCurrent("San Francisco", new Weather.Callback<CurrentResult>() { ... });
 *   weather.getForecast("Tokyo", 5, "celsius", new Weather.Callback<ForecastResult>() { ... });
 *   weather.getHourly("London", 12, "fahrenheit", new Weather.Callback<HourlyResult>() { ... });
 *   weather.getAlerts("Seattle", new Weather.Callback<AlertResult>() { ... });
 *   weather.getSummary("Paris", new Weather.Callback<SummaryResult>() { ... });
 *   weather.getByCoords(37.7749, -122.4194, new Weather.Callback<CurrentResult>() { ... });
 */
public class Weather {

    private static final String FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
    private static final String GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final int TIMEOUT = 8000;
    private static final String UA = "AutoClaw-Weather/2.0";

    private static final String[] DIRS = {
        "N","NNE","NE","ENE","E","ESE","SE","SSE",
        "S","SSW","SW","WSW","W","WNW","NW","NNW"
    };
    private static final String[] DAY_NAMES = {"Sun","Mon","Tue","Wed","Thu","Fri","Sat"};

    private static final Map<Integer, String[]> WMO = new HashMap<>();
    static {
        WMO.put(0, new String[]{"Clear sky", "\u2600\ufe0f"});
        WMO.put(1, new String[]{"Mainly clear", "\uD83C\uDF24\ufe0f"});
        WMO.put(2, new String[]{"Partly cloudy", "\u26c5"});
        WMO.put(3, new String[]{"Overcast", "\u2601\ufe0f"});
        WMO.put(45, new String[]{"Fog", "\uD83C\uDF2B\ufe0f"});
        WMO.put(48, new String[]{"Rime fog", "\uD83C\uDF2B\ufe0f"});
        WMO.put(51, new String[]{"Light drizzle", "\uD83C\uDF26\ufe0f"});
        WMO.put(53, new String[]{"Drizzle", "\uD83C\uDF26\ufe0f"});
        WMO.put(55, new String[]{"Dense drizzle", "\uD83C\uDF27\ufe0f"});
        WMO.put(56, new String[]{"Freezing drizzle", "\uD83C\uDF27\ufe0f\u2744\ufe0f"});
        WMO.put(57, new String[]{"Heavy freezing drizzle", "\uD83C\uDF27\ufe0f\u2744\ufe0f"});
        WMO.put(61, new String[]{"Slight rain", "\uD83C\uDF26\ufe0f"});
        WMO.put(63, new String[]{"Moderate rain", "\uD83C\uDF27\ufe0f"});
        WMO.put(65, new String[]{"Heavy rain", "\uD83C\uDF27\ufe0f"});
        WMO.put(66, new String[]{"Freezing rain", "\uD83E\uDDCA\uD83C\uDF27\ufe0f"});
        WMO.put(67, new String[]{"Heavy freezing rain", "\uD83E\uDDCA\uD83C\uDF27\ufe0f"});
        WMO.put(71, new String[]{"Slight snow", "\uD83C\uDF28\ufe0f"});
        WMO.put(73, new String[]{"Moderate snow", "\uD83C\uDF28\ufe0f"});
        WMO.put(75, new String[]{"Heavy snow", "\u2744\ufe0f"});
        WMO.put(77, new String[]{"Snow grains", "\uD83C\uDF28\ufe0f"});
        WMO.put(80, new String[]{"Light showers", "\uD83C\uDF26\ufe0f"});
        WMO.put(81, new String[]{"Moderate showers", "\uD83C\uDF27\ufe0f"});
        WMO.put(82, new String[]{"Violent showers", "\u26c8\ufe0f"});
        WMO.put(85, new String[]{"Light snow showers", "\uD83C\uDF28\ufe0f"});
        WMO.put(86, new String[]{"Heavy snow showers", "\u2744\ufe0f"});
        WMO.put(95, new String[]{"Thunderstorm", "\u26c8\ufe0f"});
        WMO.put(96, new String[]{"T-storm + hail", "\u26c8\ufe0f\uD83E\uDDCA"});
        WMO.put(99, new String[]{"T-storm + heavy hail", "\u26c8\ufe0f\uD83E\uDDCA"});
    }

    private final ExecutorService executor = Executors.newCachedThreadPool();

    // ── Callback ──────────────────────────────────────────────

    public interface Callback<T> {
        void onSuccess(T result);
        void onError(String error);
    }

    // ── Data Models ───────────────────────────────────────────

    public static class GeoLocation {
        public final String name;
        public final double lat;
        public final double lon;
        public final String tz;

        public GeoLocation(String name, double lat, double lon, String tz) {
            this.name = name;
            this.lat = lat;
            this.lon = lon;
            this.tz = tz;
        }
    }

    public static class CurrentResult {
        public String location, time, condition, emoji, temperature, feelsLike;
        public String humidity, wind, gusts, pressure, cloudCover, precipitation;
        public double uvIndex;
        public boolean isDay;
        public String summary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("location", location); o.put("time", time);
                o.put("condition", condition); o.put("emoji", emoji);
                o.put("temperature", temperature); o.put("feels_like", feelsLike);
                o.put("humidity", humidity); o.put("wind", wind);
                o.put("gusts", gusts); o.put("pressure", pressure);
                o.put("cloud_cover", cloudCover); o.put("precipitation", precipitation);
                o.put("uv_index", uvIndex); o.put("is_day", isDay);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class ForecastDay {
        public String date, day, condition, emoji, high, low;
        public String windMax, precipitation, precipProbability;
        public double uvMax;
        // raw values for alert calculation
        public double rawHiC, rawLoC, rawWindKmh, rawPrecipMm;
        public int rawCode;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("date", date); o.put("day", day);
                o.put("condition", condition); o.put("emoji", emoji);
                o.put("high", high); o.put("low", low);
                o.put("wind_max", windMax); o.put("precipitation", precipitation);
                o.put("precip_probability", precipProbability);
                o.put("uv_max", uvMax);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class ForecastResult {
        public String location;
        public List<ForecastDay> days;
        public String summary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("location", location);
                JSONArray arr = new JSONArray();
                for (ForecastDay d : days) arr.put(d.toJson());
                o.put("days", arr);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class HourlyEntry {
        public String time, condition, emoji, temperature, wind, precipProbability;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("time", time); o.put("condition", condition);
                o.put("emoji", emoji); o.put("temperature", temperature);
                o.put("wind", wind); o.put("precip_probability", precipProbability);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class HourlyResult {
        public String location;
        public List<HourlyEntry> hours;
        public String summary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("location", location);
                JSONArray arr = new JSONArray();
                for (HourlyEntry h : hours) arr.put(h.toJson());
                o.put("hours", arr);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class AlertResult {
        public String location;
        public int alertCount;
        public List<String> alerts;
        public String summary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("location", location);
                o.put("alert_count", alertCount);
                JSONArray arr = new JSONArray();
                for (String a : alerts) arr.put(a);
                o.put("alerts", arr);
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    public static class SummaryResult {
        public CurrentResult current;
        public ForecastResult forecast;
        public String summary;

        public JSONObject toJson() {
            try {
                JSONObject o = new JSONObject();
                o.put("current", current.toJson());
                o.put("forecast", forecast.toJson());
                return o;
            } catch (Exception e) { return new JSONObject(); }
        }
    }

    // ── Unit Conversion ───────────────────────────────────────

    private static double c2f(double c) { return Math.round((c * 9.0 / 5.0 + 32) * 10.0) / 10.0; }
    private static double kmh2mph(double k) { return Math.round(k * 0.621371 * 10.0) / 10.0; }
    private static double mm2in(double mm) { return Math.round(mm * 0.0393701 * 100.0) / 100.0; }

    private static String wmoDesc(int code) {
        String[] v = WMO.get(code);
        return v != null ? v[0] : "Unknown";
    }

    private static String wmoEmoji(int code) {
        String[] v = WMO.get(code);
        return v != null ? v[1] : "?";
    }

    private static String windDir(double deg) {
        int idx = (int) Math.round(deg / 22.5) % 16;
        if (idx < 0) idx += 16;
        return DIRS[idx];
    }

    private static String dayName(String dateStr) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
            Date d = sdf.parse(dateStr);
            if (d == null) return "?";
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(d);
            return DAY_NAMES[cal.get(java.util.Calendar.DAY_OF_WEEK) - 1];
        } catch (Exception e) { return "?"; }
    }

    private String fmtTemp(double c, boolean imperial) {
        return imperial ? c2f(c) + "F" : c + "C";
    }

    private String fmtWind(double kmh, boolean imperial) {
        return imperial ? kmh2mph(kmh) + " mph" : kmh + " km/h";
    }

    private String fmtPrecip(double mm, boolean imperial) {
        return imperial ? mm2in(mm) + "\"" : mm + " mm";
    }

    // ── HTTP ──────────────────────────────────────────────────

    private static String httpGet(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("User-Agent", UA);
        conn.setRequestProperty("Accept", "application/json");
        conn.setConnectTimeout(TIMEOUT);
        conn.setReadTimeout(TIMEOUT);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line).append("\n");
            return sb.toString();
        } finally {
            conn.disconnect();
        }
    }

    // ── Geocoding ─────────────────────────────────────────────

    public static GeoLocation geocode(String location) throws Exception {
        String params = "name=" + URLEncoder.encode(location, "UTF-8") + "&count=3&language=en&format=json";
        JSONObject data = new JSONObject(httpGet(GEOCODE_URL + "?" + params));
        JSONArray results = data.optJSONArray("results");
        if (results == null || results.length() == 0) {
            throw new Exception("Location not found: '" + location + "'");
        }
        JSONObject r = results.getJSONObject(0);
        StringBuilder nameParts = new StringBuilder(r.optString("name", location));
        if (r.has("admin1")) nameParts.append(", ").append(r.getString("admin1"));
        if (r.has("country")) nameParts.append(", ").append(r.getString("country"));
        return new GeoLocation(
            nameParts.toString(),
            r.getDouble("latitude"),
            r.getDouble("longitude"),
            r.optString("timezone", "auto")
        );
    }

    public static GeoLocation coordsGeo(double lat, double lon) {
        return new GeoLocation(lat + ", " + lon, lat, lon, "auto");
    }

    // ── Current Weather ───────────────────────────────────────

    private CurrentResult fetchCurrent(GeoLocation geo, boolean imperial) throws Exception {
        String params = "latitude=" + geo.lat + "&longitude=" + geo.lon + "&timezone=" + URLEncoder.encode(geo.tz, "UTF-8")
            + "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,"
            + "wind_gusts_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,uv_index,is_day";
        JSONObject data = new JSONObject(httpGet(FORECAST_URL + "?" + params));
        JSONObject c = data.getJSONObject("current");

        int code = c.getInt("weather_code");
        CurrentResult r = new CurrentResult();
        r.location = geo.name;
        r.time = c.getString("time");
        r.condition = wmoDesc(code);
        r.emoji = wmoEmoji(code);
        r.temperature = fmtTemp(c.getDouble("temperature_2m"), imperial);
        r.feelsLike = fmtTemp(c.getDouble("apparent_temperature"), imperial);
        r.humidity = c.getInt("relative_humidity_2m") + "%";
        r.wind = fmtWind(c.getDouble("wind_speed_10m"), imperial) + " " + windDir(c.optDouble("wind_direction_10m", 0));
        r.gusts = fmtWind(c.optDouble("wind_gusts_10m", 0), imperial);
        r.pressure = c.optDouble("pressure_msl", 0) + " hPa";
        r.cloudCover = c.optInt("cloud_cover", 0) + "%";
        r.precipitation = fmtPrecip(c.optDouble("precipitation", 0), imperial);
        r.uvIndex = c.optDouble("uv_index", 0);
        r.isDay = c.optInt("is_day", 1) == 1;

        String night = r.isDay ? "" : " (night)";
        r.summary = r.emoji + " **" + geo.name + "** - " + r.condition + night + "\n"
            + "  Temp: " + r.temperature + " (feels " + r.feelsLike + ")\n"
            + "  Humidity: " + r.humidity + "  |  Cloud: " + r.cloudCover + "\n"
            + "  Wind: " + r.wind + " (gusts " + r.gusts + ")\n"
            + "  Precip: " + r.precipitation + "  |  UV: " + r.uvIndex + "\n"
            + "  As of " + r.time;
        return r;
    }

    // ── Forecast ──────────────────────────────────────────────

    private ForecastResult fetchForecast(GeoLocation geo, boolean imperial, int days) throws Exception {
        days = Math.max(1, Math.min(16, days));
        String params = "latitude=" + geo.lat + "&longitude=" + geo.lon
            + "&timezone=" + URLEncoder.encode(geo.tz, "UTF-8") + "&forecast_days=" + days
            + "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,"
            + "precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset,uv_index_max";
        JSONObject data = new JSONObject(httpGet(FORECAST_URL + "?" + params));
        JSONObject d = data.getJSONObject("daily");

        JSONArray times = d.getJSONArray("time");
        JSONArray hiArr = d.getJSONArray("temperature_2m_max");
        JSONArray loArr = d.getJSONArray("temperature_2m_min");
        JSONArray codeArr = d.getJSONArray("weather_code");
        JSONArray precipArr = d.getJSONArray("precipitation_sum");
        JSONArray probArr = d.optJSONArray("precipitation_probability_max");
        JSONArray windArr = d.getJSONArray("wind_speed_10m_max");
        JSONArray uvArr = d.optJSONArray("uv_index_max");

        int n = times.length();
        ForecastResult result = new ForecastResult();
        result.location = geo.name;
        result.days = new ArrayList<>();
        StringBuilder sb = new StringBuilder("**" + geo.name + "** - " + n + "-Day Forecast\n\n");

        for (int i = 0; i < n; i++) {
            int code = codeArr.getInt(i);
            ForecastDay fd = new ForecastDay();
            fd.date = times.getString(i);
            fd.day = dayName(fd.date);
            fd.condition = wmoDesc(code);
            fd.emoji = wmoEmoji(code);
            fd.rawHiC = hiArr.getDouble(i);
            fd.rawLoC = loArr.getDouble(i);
            fd.rawWindKmh = windArr.getDouble(i);
            fd.rawPrecipMm = precipArr.getDouble(i);
            fd.rawCode = code;
            fd.high = fmtTemp(fd.rawHiC, imperial);
            fd.low = fmtTemp(fd.rawLoC, imperial);
            fd.windMax = fmtWind(fd.rawWindKmh, imperial);
            fd.precipitation = fmtPrecip(fd.rawPrecipMm, imperial);
            int prob = probArr != null && !probArr.isNull(i) ? probArr.getInt(i) : -1;
            fd.precipProbability = prob >= 0 ? prob + "%" : "N/A";
            fd.uvMax = uvArr != null && !uvArr.isNull(i) ? uvArr.getDouble(i) : -1;

            result.days.add(fd);

            String probStr = prob > 0 ? " (" + prob + "%)" : "";
            sb.append(fd.emoji).append(" **").append(fd.day).append(" ").append(fd.date)
              .append("** - ").append(fd.condition).append("\n")
              .append("   H ").append(fd.high).append("  L ").append(fd.low)
              .append("  Wind ").append(fd.windMax)
              .append("  Precip ").append(fd.precipitation).append(probStr).append("\n");
        }
        result.summary = sb.toString().trim();
        return result;
    }

    // ── Hourly ────────────────────────────────────────────────

    private HourlyResult fetchHourly(GeoLocation geo, boolean imperial, int hours) throws Exception {
        hours = Math.max(1, Math.min(48, hours));
        String params = "latitude=" + geo.lat + "&longitude=" + geo.lon
            + "&timezone=" + URLEncoder.encode(geo.tz, "UTF-8") + "&forecast_days=3"
            + "&current=temperature_2m"
            + "&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,"
            + "precipitation,wind_speed_10m,relative_humidity_2m";
        JSONObject data = new JSONObject(httpGet(FORECAST_URL + "?" + params));
        JSONObject h = data.getJSONObject("hourly");
        String nowStr = data.getJSONObject("current").getString("time");

        JSONArray timesArr = h.getJSONArray("time");
        JSONArray tempArr = h.getJSONArray("temperature_2m");
        JSONArray codeArr = h.getJSONArray("weather_code");
        JSONArray probArr = h.optJSONArray("precipitation_probability");
        JSONArray windArr = h.getJSONArray("wind_speed_10m");

        int start = 0;
        for (int i = 0; i < timesArr.length(); i++) {
            if (timesArr.getString(i).compareTo(nowStr) >= 0) { start = i; break; }
        }

        HourlyResult result = new HourlyResult();
        result.location = geo.name;
        result.hours = new ArrayList<>();
        StringBuilder sb = new StringBuilder("**" + geo.name + "** - Next " + hours + "h Forecast\n\n");

        int end = Math.min(start + hours, timesArr.length());
        for (int i = start; i < end; i++) {
            int code = codeArr.getInt(i);
            HourlyEntry e = new HourlyEntry();
            e.time = timesArr.getString(i);
            e.condition = wmoDesc(code);
            e.emoji = wmoEmoji(code);
            e.temperature = fmtTemp(tempArr.getDouble(i), imperial);
            e.wind = fmtWind(windArr.getDouble(i), imperial);
            int pp = probArr != null && !probArr.isNull(i) ? probArr.getInt(i) : 0;
            e.precipProbability = pp + "%";
            result.hours.add(e);

            String t = e.time.contains("T") ? e.time.split("T")[1] : e.time;
            sb.append(e.emoji).append(" ").append(t).append("  ").append(e.temperature)
              .append("  ").append(e.condition).append("  Rain:").append(pp)
              .append("%  Wind:").append(e.wind).append("\n");
        }
        result.summary = sb.toString().trim();
        return result;
    }

    // ── Alerts ────────────────────────────────────────────────

    private AlertResult buildAlerts(GeoLocation geo, boolean imperial) throws Exception {
        ForecastResult forecast = fetchForecast(geo, imperial, 3);
        AlertResult result = new AlertResult();
        result.location = geo.name;
        result.alerts = new ArrayList<>();

        for (ForecastDay day : forecast.days) {
            if (day.rawPrecipMm > 25)
                result.alerts.add("[WARNING] Heavy rain " + day.day + " (" + day.precipitation + ")");
            else if (day.rawPrecipMm > 10)
                result.alerts.add("[ADVISORY] Rain " + day.day + " (" + day.precipitation + ")");
            if (day.rawWindKmh > 60)
                result.alerts.add("[WARNING] High winds " + day.day + " (" + day.windMax + ")");
            if (day.rawCode == 71 || day.rawCode == 73 || day.rawCode == 75 || day.rawCode == 77
                    || day.rawCode == 85 || day.rawCode == 86)
                result.alerts.add("[ADVISORY] Snow " + day.day + " - " + day.condition);
            if (day.rawCode == 95 || day.rawCode == 96 || day.rawCode == 99)
                result.alerts.add("[WARNING] Thunderstorms " + day.day);
            if (day.rawHiC > 38)
                result.alerts.add("[WARNING] Extreme heat " + day.day + " (high: " + day.high + ")");
            if (day.rawLoC < -5)
                result.alerts.add("[ADVISORY] Freezing temps " + day.day + " (low: " + day.low + ")");
            if (day.uvMax >= 8)
                result.alerts.add("[ADVISORY] High UV " + day.day + " (UV: " + day.uvMax + ")");
        }

        result.alertCount = result.alerts.size();
        if (result.alertCount > 0) {
            StringBuilder sb = new StringBuilder("**" + geo.name + "** - " + result.alertCount + " Weather Alert(s)\n");
            for (String a : result.alerts) sb.append(a).append("\n");
            result.summary = sb.toString().trim();
        } else {
            result.summary = "**" + geo.name + "** - No weather alerts for the next 3 days";
        }
        return result;
    }

    // ── Public API ────────────────────────────────────────────

    /** Get current weather for a location. Default: fahrenheit. */
    public void getCurrent(String location, Callback<CurrentResult> callback) {
        getCurrent(location, "fahrenheit", callback);
    }

    public void getCurrent(String location, String unit, Callback<CurrentResult> callback) {
        executor.execute(() -> {
            try {
                GeoLocation geo = geocode(location);
                CurrentResult r = fetchCurrent(geo, "fahrenheit".equals(unit));
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Get daily forecast. Default: 7 days, fahrenheit. */
    public void getForecast(String location, Callback<ForecastResult> callback) {
        getForecast(location, 7, "fahrenheit", callback);
    }

    public void getForecast(String location, int days, String unit, Callback<ForecastResult> callback) {
        executor.execute(() -> {
            try {
                GeoLocation geo = geocode(location);
                ForecastResult r = fetchForecast(geo, "fahrenheit".equals(unit), days);
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Get hourly forecast. Default: 24 hours, fahrenheit. */
    public void getHourly(String location, Callback<HourlyResult> callback) {
        getHourly(location, 24, "fahrenheit", callback);
    }

    public void getHourly(String location, int hours, String unit, Callback<HourlyResult> callback) {
        executor.execute(() -> {
            try {
                GeoLocation geo = geocode(location);
                HourlyResult r = fetchHourly(geo, "fahrenheit".equals(unit), hours);
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Get weather alerts for next 3 days. Default: fahrenheit. */
    public void getAlerts(String location, Callback<AlertResult> callback) {
        getAlerts(location, "fahrenheit", callback);
    }

    public void getAlerts(String location, String unit, Callback<AlertResult> callback) {
        executor.execute(() -> {
            try {
                GeoLocation geo = geocode(location);
                AlertResult r = buildAlerts(geo, "fahrenheit".equals(unit));
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Get current + 3-day summary. Default: fahrenheit. */
    public void getSummary(String location, Callback<SummaryResult> callback) {
        getSummary(location, "fahrenheit", callback);
    }

    public void getSummary(String location, String unit, Callback<SummaryResult> callback) {
        executor.execute(() -> {
            try {
                boolean imperial = "fahrenheit".equals(unit);
                GeoLocation geo = geocode(location);
                CurrentResult current = fetchCurrent(geo, imperial);
                ForecastResult forecast = fetchForecast(geo, imperial, 3);

                SummaryResult r = new SummaryResult();
                r.current = current;
                r.forecast = forecast;

                StringBuilder sb = new StringBuilder(current.summary);
                sb.append("\n\n**3-Day Outlook:**\n");
                for (ForecastDay d : forecast.days) {
                    sb.append("  ").append(d.emoji).append(" ").append(d.day)
                      .append(": ").append(d.high).append("/").append(d.low)
                      .append(" - ").append(d.condition).append("\n");
                }
                r.summary = sb.toString().trim();
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Get current weather by coordinates. Default: fahrenheit. */
    public void getByCoords(double lat, double lon, Callback<CurrentResult> callback) {
        getByCoords(lat, lon, "fahrenheit", callback);
    }

    public void getByCoords(double lat, double lon, String unit, Callback<CurrentResult> callback) {
        executor.execute(() -> {
            try {
                GeoLocation geo = coordsGeo(lat, lon);
                CurrentResult r = fetchCurrent(geo, "fahrenheit".equals(unit));
                callback.onSuccess(r);
            } catch (Exception e) {
                callback.onError(e.getMessage());
            }
        });
    }

    /** Shutdown the executor when done. */
    public void shutdown() {
        executor.shutdown();
    }
}

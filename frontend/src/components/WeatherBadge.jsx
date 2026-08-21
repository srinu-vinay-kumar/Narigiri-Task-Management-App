import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import API from "../services/api.js";

const WeatherBadge = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    const fetchWeather = async () => {
      setStatus("loading");
      try {
        const response = await API.get("/tasks/weather", {
          params: { city: location },
        });
        if (cancelled) return;
        if (response.data.weather) {
          setWeather(response.data.weather);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (!location || status === "error") return null;

  if (status === "loading") {
    return (
      <span className="weather-badge weather-badge--loading">
        <CloudSun className="weather-badge__icon" />
        <span className="weather-badge__desc">Loading...</span>
      </span>
    );
  }

  if (status !== "success" || !weather) return null;

  return (
    <span className="weather-badge">
      {weather.icon && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
          alt={weather.description}
          className="weather-badge__icon"
        />
      )}
      <span className="weather-badge__temp">{weather.temp}°C</span>
      <span className="weather-badge__desc">{weather.description}</span>
    </span>
  );
};

export default WeatherBadge;

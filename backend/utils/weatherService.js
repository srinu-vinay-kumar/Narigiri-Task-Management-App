import axios from "axios";

const getWeatherByCity = async (city) => {
  if (!city) return null;

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    );

    const { data } = response;

    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0]?.description,
      icon: data.weather[0]?.icon,
      cityName: data.name,
    };
  } catch (err) {
    console.error(`Failed to fetch weather for ${city}:`, err.message);
    return null;
  }
};

export default getWeatherByCity;

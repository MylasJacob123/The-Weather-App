import React, { useState, useEffect } from "react";
import "../components/Fetch.css";

const getWeatherImage = (description) => {
  if (!description) {
    return {
      url: "https://img.icons8.com/?size=100&id=HvsrTtUGylxy&format=png&color=000000",
      alt: "Default Weather",
      explanation: "Weather image not available yet.",
    };
  }

  switch (description.toLowerCase()) {
    case "clear sky":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c01d.png",
        alt: "Clear Skies",
        explanation: "The sky is clear with no clouds.",
      };
    case "few clouds":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c02d.png",
        alt: "Few Clouds",
        explanation: "There are a few clouds in the sky.",
      };
    case "scattered clouds":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c02d.png",
        alt: "Scattered Clouds",
        explanation: "There are scattered clouds in the sky.",
      };
    case "broken clouds":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c03d.png",
        alt: "Broken Clouds",
        explanation: "The sky is mostly covered with clouds.",
      };
    case "overcast clouds":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c04d.png",
        alt: "Overcast Clouds",
        explanation: "The sky is completely covered with clouds.",
      };
    case "shower rain":
      return {
        url: "https://www.weatherbit.io/static/img/icons/r01d.png",
        alt: "Shower Rain",
        explanation: "There is light rain.",
      };
    case "rain":
      return {
        url: "https://www.weatherbit.io/static/img/icons/r01d.png",
        alt: "Rain",
        explanation: "It is raining with varying intensity.",
      };
    case "light rain":
      return {
        url: "https://www.weatherbit.io/static/img/icons/r01d.png",
        alt: "Light Rain",
        explanation: "There is light rain.",
      };
    case "thunderstorm":
      return {
        url: "https://www.weatherbit.io/static/img/icons/t01d.png",
        alt: "Thunderstorm",
        explanation: "There are thunderstorms in the area.",
      };
    case "snow":
      return {
        url: "https://www.weatherbit.io/static/img/icons/s01d.png",
        alt: "Snow",
        explanation: "It is snowing.",
      };
    case "mist":
      return {
        url: "https://www.weatherbit.io/static/img/icons/a01d.png",
        alt: "Mist",
        explanation: "It is misty, prepare for reduced visibility.",
      };
    case "sunny":
      return {
        url: "https://www.weatherbit.io/static/img/icons/c01d.png",
        alt: "Sunny",
        explanation: "The weather is sunny and clear.",
      };
    default:
      return {
        url: "https://img.icons8.com/?size=100&id=HvsrTtUGylxy&format=png&color=000000",
        alt: "Default Weather",
        explanation: "Weather image not available yet.",
      };
  }
};

function Fetch() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lat, setLat] = useState(null);  // State for latitude
  const [long, setLong] = useState(null); // State for longitude
  const Api_Key = "6d7cbb7b547682792911c7f04f7a5ca4";

  // Geolocation handler
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        () => setError("Failed to get your current location.")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    handleGeolocation(); // Call geolocation on mount
  }, []);

  useEffect(() => {
    const storedWeather = localStorage.getItem("weatherData");
    if (storedWeather) {
      setWeather(JSON.parse(storedWeather));
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchWeatherData = async () => {
    let query = location;

    // Use coordinates if available
    if (lat && long) {
      query = `${lat},${long}`;
    }

    if (!query) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${Api_Key}&units=metric`
      );

      console.log("Response Status:", response.status);
      const data = await response.json();

      if (response.ok) {
        setWeather({
          location: data.name || "Current Location", // Fallback to "Current Location" if no name
          temperature: data.main.temp,
          feels_like: data.main.feels_like,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg,
          visibility: data.visibility,
          description: data.weather[0].description,
        });

        // Fetch the forecast using the new method
        fetchForecast(data.name);
        setError(null);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setWeather({});
      }
    } catch (error) {
      setError("Failed to fetch Weather Data. Please Try Again.");
      console.error("Fetch error:", error);
      const storedWeather = localStorage.getItem("weatherData");
      if (storedWeather) {
        setWeather(JSON.parse(storedWeather));
      }
    }
  };

  const fetchForecast = async (location) => {
    // ... [rest of the fetchForecast function remains unchanged]
  };

  useEffect(() => {
    if (isOnline) {
      fetchWeatherData();
    }
  }, [location, isOnline, lat, long]); // Add lat and long as dependencies

  useEffect(() => {
    localStorage.setItem("weatherData", JSON.stringify(weather));
  }, [weather]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isOnline) {
        fetchWeatherData();
      }
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(intervalId);
  }, [isOnline]);

  return (
    <div className="container">
      <h1>Weather Update</h1>
      <div className="align">
        <input
          type="text"
          id="locationInput"
          placeholder="Enter a city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}

      {weather.description && (
        <div className="weather-image">
          <img
            src={getWeatherImage(weather.description).url}
            alt={getWeatherImage(weather.description).alt}
          />
          <p className="description">
            {getWeatherImage(weather.description).explanation}
          </p>
        </div>
      )}

      <div className="info">
        {weather.location && (
          <div className="weather-info">
            <h2 id="location">{weather.location}</h2>
            <div className="grid-container">
              <div className="grid-item" id="temperature">
                Temperature: {weather.temperature}°C
              </div>
              <div className="grid-item" id="feels_like">
                Feels Like: {weather.feels_like}°C
              </div>
              <div className="grid-item" id="temp_min">
                Min Temp: {weather.temp_min}°C
              </div>
              <div className="grid-item" id="temp_max">
                Max Temp: {weather.temp_max}°C
              </div>
              <div className="grid-item" id="pressure">
                Pressure: {weather.pressure} hPa
              </div>
              <div className="grid-item" id="humidity">
                Humidity: {weather.humidity}%
              </div>
              <div className="grid-item" id="wind_speed">
                Wind Speed: {weather.wind_speed} m/s
              </div>
            </div>
          </div>
        )}
      </div>

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-container">
            {forecast.map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>Temp: {item.main.temp}°C</p>
                <p>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Fetch;

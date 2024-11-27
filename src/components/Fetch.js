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
  const [savedLocations, setSavedLocations] = useState(
    JSON.parse(localStorage.getItem("savedLocations")) || []
  );
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unit, setUnit] = useState("metric"); 
  const [theme, setTheme] = useState("light"); 
  const Api_Key = "6d7cbb7b547682792911c7f04f7a5ca4";

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);

      const storedWeather = localStorage.getItem("weatherData");
      if (storedWeather) {
        setWeather(JSON.parse(storedWeather));
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not retrieve current location. Please search for a city.");
        }
      );
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isOnline && location) {
        fetchWeatherData();
      }
    }, 3600000);

    return () => clearInterval(intervalId);
  }, [isOnline, location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not retrieve current location. Please search for a city.");
        }
      );
    }
  }, []);

  const saveLocation = () => {
    if (!location || savedLocations.includes(location)) return; 
    const updatedLocations = [...savedLocations, location];
    setSavedLocations(updatedLocations); 
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations)); 
  };

  const selectLocation = (selectedLocation) => {
    setLocation(selectedLocation); 
    fetchWeatherData(selectedLocation);
    fetchForecast(selectedLocation); 
  };

  const fetchWeatherData = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Api_Key}&units=${unit}`
      );

      const data = await response.json();

      if (response.ok) {
        setWeather({
          location: data.name,
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

        fetchForecast(location);
        setError(null);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setWeather({});
      }
    } catch (error) {
      setError("Failed to fetch Weather Data. Please Try Again.");
      const storedWeather = localStorage.getItem("weatherData");
      if (storedWeather) {
        setWeather(JSON.parse(storedWeather));
      }
    }
  };

  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key}&units=${unit}`
      );

      const data = await response.json();

      if (response.ok) {
        setWeather({
          location: data.name,
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

        fetchForecast();
        setError(null);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Failed to fetch Weather Data. Please Try Again.");
    }
  };

  const fetchForecast = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${Api_Key}&units=${unit}`
      );

      const data = await response.json();

      if (response.ok) {
        const dailyForecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
        setForecast(dailyForecast);
      } else {
        setError(data.message || "Unable to fetch forecast.");
      }
    } catch (error) {
      setError("Failed to fetch Forecast Data.");
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
    saveLocation();
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const convertTemperature = (temp) => {
    if (unit === "imperial") {
      return (temp * 9) / 5 + 32;
    }
    return temp; 
  };
  const weatherImage = getWeatherImage(weather.description);

  return (
    <div className={`container ${theme}`}>
      <h1>Weather App</h1>
      <div className="toggle-btn">
        <button onClick={toggleTheme}>Toggle Theme</button>
        <button onClick={toggleUnit}>
          Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="controls">
        <div className="align">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter City"
            required
          />
          <button type="submit">Get Weather</button>
        </div>
      </form>

      <div>
        <h3>Saved Locations</h3>
        <ul>
          {savedLocations.map((savedLocation, index) => (
            <li key={index}>
              <button onClick={() => selectLocation(savedLocation)}>
                {savedLocation}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && <div className="error">{error}</div>}
      {weather.location && (
        <div className="info">
          <h2>{weather.location}</h2>
          <div className="weather-image">
            <img src={weatherImage.url} alt={weatherImage.alt} />
            <p className="description">{weatherImage.explanation}</p>
          </div>
          <p>
            Temperature: {convertTemperature(weather.temperature).toFixed(1)}°{unit === "metric" ? "C" : "F"}
          </p>
          <p>
            Feels Like: {convertTemperature(weather.feels_like).toFixed(1)}°{unit === "metric" ? "C" : "F"}
          </p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Pressure: {weather.pressure} hPa</p>
          <p>Wind Speed: {weather.wind_speed} m/s</p>
          <p>Visibility: {weather.visibility / 1000} km</p>
        </div>
      )}
      
       <h3>5-Day Forecast</h3>
      <div className="forecast">
       
        {forecast.map((item, index) => (
          <div key={index} className="forecast-item">
            <h4>{new Date(item.dt * 1000).toLocaleDateString()}</h4>
            <div className="weather-image">
              <img src={getWeatherImage(item.weather[0].description).url} alt={item.weather[0].description} />
            </div>
            <p>
              Temp: {convertTemperature(item.main.temp).toFixed(1)}°{unit === "metric" ? "C" : "F"}
            </p>
            <p>Humidity: {item.main.humidity}%</p>
            <p>{item.weather[0].description}</p>
          </div>
        ))}
      </div>
      <div>
        <h3>{isOnline ? "Online" : "Offline"}</h3>
      </div>
    </div>
  );
}

export default Fetch;

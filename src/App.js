import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherByLocation = async (lat, lon) => {
  setLoading(true);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (data.cod === 200) {
      setWeather(data);
      setCity(data.name);
      setError("");
    } else {
      setError("Không lấy được thời tiết từ vị trí hiện tại.");
    }
  } catch {
    setError("Lỗi khi lấy thời tiết theo vị trí.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          getWeatherByLocation(latitude, longitude);
        },
        () => {
          setError("Không cho phép truy cập vị trí.");
        }
      );
    } else {
      setError("Trình duyệt không hỗ trợ định vị.");
    }
  }, []);

  const getWeatherByCity = async () => {
  if (!city) return;
  setLoading(true);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (data.cod === 200) {
      setWeather(data);
      setError("");
    } else {
      setWeather(null);
      setError("Không tìm thấy thành phố!");
    }
  } catch {
    setError("Đã xảy ra lỗi khi gọi API.");
    setWeather(null);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="App">
      <h1>🌤️ Weather App</h1>

      <div className="search-form">
        <input
          type="text"
          placeholder="Nhập tên thành phố..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherByCity}>Tìm kiếm</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <div className="spinner"></div>}


      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>🌡️ {weather.main.temp} °C</p>
          <p>🌤️ {weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}

export default App;

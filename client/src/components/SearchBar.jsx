import '../styles/searchBar.css';
import React, { useState } from 'react';
import { fetchWeather } from '../api/weatherService.js';
import WeatherCard from "./WeatherCard.jsx"

const SearchBar = () => {
  const [city, setCityInput] = useState('');
  const [data, setData] = useState(null);
  const [times, setTimes] = useState(null);

  const handleChange = (e) => {
    setCityInput(e.target.value);
  };

  const check = (e) => {
    e.preventDefault();
    fetchWeather(city)
      .then(res => {
        setData(res.data);
        console.log(res.data);
        setTimes(res.times);
        console.log(res.times);
      })
      .catch(err => {
        console.log(err.message);
        alert("שגיאה בכתיבת עיר");
      })
  };

  return (

    <div >
      <div className="search-container">
        <img src="/logo.svg" alt="Logo" />
        <p id='title'>
          Use our weather app to see the weather around the world
        </p>
        <div className="input-container">
          <label >City Name</label>
          <input
            type="text"
            value={city}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && check(e)}
            aria-label="City name input"
          />
          <button onClick={check} aria-label="Search for weather">Check</button>
        </div>

      </div>
      <div className="weather">
        <WeatherCard data={data} times={times} />
      </div>
      {data ? (
        <div className="location-container">
          <p className="latitude">Latitude {data?.location?.lat ?? "Loading..."}</p>
          <p className="longitude">Longitude {data?.location?.lon ?? "Loading..."}</p>
          <p className="accurate">Accurate to  {data?.current?.last_updated
            ? (() => {
              const [date, time] = data.current.last_updated.split(" ");
              const [year, month, day] = date.split("-");
              return `${day}/${month}/${year.slice(-2)} at ${time}`;
            })()
            : "Loading..."}</p>
        </div>
      ) : (null)}
    </div>
  );
};

export default SearchBar;
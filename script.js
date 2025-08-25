function getWeather() {
  const apiKey = "d283b7705d174c6cb4724322251908"; // hardcoded WeatherAPI key
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // WeatherAPI endpoints
  const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`;

  // Fetch current weather
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again later.");
    });

  // Fetch forecast
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      if (data.forecast && data.forecast.forecastday.length > 0) {
        displayHourlyForecast(data.forecast.forecastday[0].hour);
      }
    })
    .catch(error => {
      console.error("Error fetching forecast data:", error);
      alert("Failed to fetch forecast data. Please try again later.");
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");

  // Handle error response
  if (data.error) {
    weatherInfoDiv.innerHTML = `<p>${data.error.message}</p>`;
    tempDivInfo.innerHTML = "";
    weatherIcon.style.display = "none";
  } else {
    const cityName = data.location.name;
    const temperature = Math.round(data.current.temp_c);
    const description = data.current.condition.text;
    const iconUrl = `https:${data.current.condition.icon}`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = "block";
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  hourlyForecastDiv.innerHTML = "";

  const nextHours = hourlyData.slice(0, 8); // show first 8 hours

  nextHours.forEach(item => {
    const dateTime = new Date(item.time);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.temp_c);
    const iconUrl = `https:${item.condition.icon}`;
    const description = item.condition.text;

    const hourlyItemHtml = `
      <div class="hourly-item">
          <span>${hour}:00</span>
          <img src="${iconUrl}" alt="${description}">
          <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

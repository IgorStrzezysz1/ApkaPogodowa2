let weatherLocation = document.querySelector('.weatherLocation');
const weatherCountry = document.querySelector('.weatherCountry');
const weatherTemp = document.querySelector('.weatherTemp');
const weatherTempFeelLike = document.querySelector('.weatherTempFeelLike');
const weatherInfoDetails = document.querySelector('.weatherInfo');
const weatherWindSpeed = document.querySelector('.weatherWindSpeed');
const weatherImg = document.querySelector('.weatherImg');
const slideUp = document.getElementById('slideUpAnimation');
const goBackButton = document.getElementById('goBackButton');
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherImgId = document.getElementById("weatherImg");

async function fetchWeatherByCity(cityName) {
  const apiKey = `83a4e536c6cc9f7b61410fa93df99220`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    console.log(data);

    // Save weather data to localStorage
    saveToHistory(data);

    // Clear any previous error message
    document.querySelector('.error-message').textContent = '';

    updateSearch(data);
  } catch (error) {
    console.error('Error fetching weather data for city:', error);

    // Display the error message
    document.querySelector('.error-message').textContent = "Brak połączenia internetowego sprawdź swoje połączenie i spróbuj ponownie";

    // Clear weather data fields
    weatherLocation.textContent = ``;
    weatherCountry.textContent = ``;
    weatherTemp.textContent = ``;
    weatherTempFeelLike.textContent = ``;
    weatherInfoDetails.textContent = ``;
    weatherWindSpeed.textContent = ``;
    weatherImg.src = ``;
  }
}


function saveToHistory(data) {
  const weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  weatherHistory.push({
    name: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
  });
  console.log(JSON.stringify(weatherHistory))
  localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
}

function updateSearch(data) {
  weatherLocation.textContent = `Location: ${data.name}`;
  weatherCountry.textContent = `Country: ${data.sys.country}`;
  weatherTemp.textContent = `Temperature: ${data.main.temp}°C`;
  weatherTempFeelLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
  weatherInfoDetails.textContent = `Weather: ${data.weather[0].description}`;
  weatherWindSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherImgId.style.opacity = 1;
  weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherImg.alt = data.weather[0].description;
}

searchButton.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    alert('Please enter a city name');
    return;
  }
  fetchWeatherByCity(cityName);
});

goBackButton.addEventListener('click', () => {
  console.log("clicked");
  slideUp.classList.add('active');
  setTimeout(() => {
    window.location.href = "index.html"
  }, 800);

});
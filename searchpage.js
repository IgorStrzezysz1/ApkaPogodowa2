const weatherLocation = document.querySelector('.weatherLocation');
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


console.log(weatherLocation);
console.log(weatherCountry);
console.log(weatherTemp);
console.log(weatherTempFeelLike);
console.log(weatherInfoDetails);
console.log(weatherImg);
console.log(slideUp);
console.log(goBackButton);
console.log(cityInput);
console.log(searchButton);

async function fetchWeatherByCity(cityName) {
  const apiKey = `83a4e536c6cc9f7b61410fa93df99220`
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  console.log(cityName);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    console.log(data)
    updateSearch(data)
    updateWeatherUI(data);
  } catch (error) {
    console.error('Error fetching weather data for city:', error);
   // alert('City not found or error fetching data');
  }
}

function updateSearch(data) {
  weatherLocation.textContent = `Location: ${data.name}`;
  weatherCountry.textContent = `Country: ${data.sys.country}`;
  weatherTemp.textContent = `Temperature: ${data.main.temp}°C`;
  weatherTempFeelLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
  weatherInfoDetails.textContent = `Weather: ${data.weather[0].description}`;
  weatherWindSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
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
  slideUp.classList.add('active');
  setTimeout(() => {
    window.location.href = './index.html'; // Powrót do strony wyszukiwania
  }, 800);
});

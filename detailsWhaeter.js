const apiKey = '83a4e536c6cc9f7b61410fa93df99220';
const weatherLocation = document.querySelector('.weatherLocation');
const weatherCountry = document.querySelector('.weatherCountry');
const weatherTemp = document.querySelector('.weatherTemp');
const weatherTempFeelLike = document.querySelector('.weatherTempFeelLike');
const weatherInfoDetails = document.querySelector('.weatherInfo');
const weatherWindSpeed = document.querySelector('.weatherWindSpeed');
const weatherImg = document.querySelector('.weatherImg');
const slideUp = document.getElementById('slideUpAnimation');
const goBackButton = document.getElementById('goBackButton');
const fetchWeatherButton = document.getElementById('fetchWeatherButton');
const errorMessage = document.querySelector('.error-message'); // New element for error message
const weatherImgId = document.getElementById("weatherImg");
// Function to fetch weather based on geographic coordinates
async function fetchWeatherByCoords(position) {
  const { latitude, longitude } = position.coords;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Weather data unavailable');
    const data = await response.json();
    updateWeatherUI(data);

    // Clear any previous error message
    errorMessage.textContent = '';
  } catch (error) {
    // Display the error message
    console.error('Error fetching weather data:', error);
    errorMessage.textContent = "Brak połączenia internetowego. Sprawdź swoje połączenie i spróbuj ponownie.";

    // Clear weather data fields
    weatherLocation.textContent = '';
    weatherCountry.textContent = '';
    weatherTemp.textContent = '';
    weatherTempFeelLike.textContent = '';
    weatherInfoDetails.textContent = '';
    weatherWindSpeed.textContent = '';
    weatherImg.src = '';
  }
}


// Function to update the UI with weather data
function updateWeatherUI(data) {
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

// Event listener for "Go Back" button
goBackButton.addEventListener('click', () => {
  slideUp.classList.add('active');
  setTimeout(() => {
    window.location.href = "index.html"
  }, 800);
});

// Event listener for "Fetch Weather" button
fetchWeatherButton.addEventListener('click', () => {
  console.log('Fetch Weather button clicked'); // Debugging
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, (error) => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location.');
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

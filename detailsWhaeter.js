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

// Funkcja pobierania pogody na podstawie współrzędnych geograficznych
async function fetchWeatherByCoords(position) {
  const { latitude, longitude } = position.coords;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Weather data unavailable');
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Funkcja aktualizująca interfejs użytkownika na podstawie danych o pogodzie
function updateWeatherUI(data) {
  weatherLocation.textContent = `Location: ${data.name}`;
  weatherCountry.textContent = `Country: ${data.sys.country}`;
  weatherTemp.textContent = `Temperature: ${data.main.temp}°C`;
  weatherTempFeelLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
  weatherInfoDetails.textContent = `Weather: ${data.weather[0].description}`;
  weatherWindSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherImg.alt = data.weather[0].description;
}

// Obsługa przycisku powrotu
goBackButton.addEventListener('click', () => {
  console.log('Go Back button clicked'); // Debugowanie
  slideUp.classList.add('active');
  setTimeout(() => {
    const referrer = document.referrer || './index.html';
    console.log('Redirecting to:', referrer); // Debugowanie
    window.location.href = referrer;
  }, 800);
});

// Sprawdzanie, czy geolokalizacja jest dostępna w przeglądarce
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, (error) => {
    console.error('Error getting location:', error);
    alert('Unable to retrieve your location.');
  });
} else {
  alert('Geolocation is not supported by your browser.');
}

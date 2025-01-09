// Sprawdź, czy geolokalizacja jest dostępna
const locationButton = document.getElementById('getLocation');
const weatherInfo = document.getElementById('weatherInfo');
const offlineInfo = document.getElementById('offlineInfo');

locationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(fetchWeather, showError);
    } else {
        weatherInfo.textContent = 'Geolocation is not supported by your browser.';
    }
});

// Pobierz dane pogodowe
async function fetchWeather(position) {
    const { latitude, longitude } = position.coords;
    const apiKey = 'YOUR_API_KEY'; // Wstaw klucz API z OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Weather data unavailable');
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        weatherInfo.textContent = 'Error fetching weather data.';
    }
}

// Zaktualizuj interfejs użytkownika
function updateWeatherUI(data) {
    weatherInfo.textContent = `Location: ${data.name}, Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
}

// Obsłuż błędy geolokalizacji
function showError(error) {
    weatherInfo.textContent = `Error getting location: ${error.message}`;
}

// Zarejestruj Service Workera
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(error => console.error('Service Worker registration failed:', error));
}

// Sprawdź, czy użytkownik jest offline
window.addEventListener('offline', () => {
    offlineInfo.style.display = 'block';
});
window.addEventListener('online', () => {
    offlineInfo.style.display = 'none';
});

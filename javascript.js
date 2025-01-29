//const slideDown = document.getElementById('slideDownAnimation');
const slideUp = document.getElementById('slideUpAnimation');
const locationButton = document.getElementById('getLocation');
const weatherInfo = document.getElementById('weatherInfo');
const offlineInfo = document.getElementById('offlineInfo');
const detailWeatherButton = document.getElementById('DetailWhaetresButton');
const weatherLocation = document.querySelector('.weatherLocation');
const weatherCountry = document.querySelector('.weatherCountry');
const weatherTemp = document.querySelector('.weatherTemp');
const weatherTempFeelLike = document.querySelector('.weatherTempFeelLike');
const weatherInfoDetails = document.querySelector('.weatherInfo');
const weatherWindSpeed = document.querySelector('.weatherWindSpeed');
const weatherImg = document.querySelector('.weatherImg');
const goBackButton = document.getElementById('goBackButton');

const apiKey = '83a4e536c6cc9f7b61410fa93df99220'; // OpenWeatherMap API key

// // Funkcja do uruchamiania animacji i przekierowywania
// const navigateWithAnimation = (url) => {
//     if (slideDown) {
//         slideDown.classList.add('active'); // Uruchomienie animacji
//         setTimeout(() => {
//             window.location.href = url; // Przekierowanie po zakończeniu animacji
//         }, 800); // Czas trwania animacji w ms
//     }
// };

// Obsługa przycisków na stronie głównej
if (document.getElementById('detailWeatherButton')) {
    document.getElementById('detailWeatherButton').addEventListener('click', () => {
        navigateWithAnimation('./detailsWheater.html');
    });
}

if (document.getElementById('navigate-to-search')) {
    document.getElementById('navigate-to-search').addEventListener('click', () => {
        navigateWithAnimation('./searchpage.html');
    });
}

if (document.getElementById('navigate-to-history')) {
    document.getElementById('navigate-to-history').addEventListener('click', () => {
        navigateWithAnimation('./historyWheater.html');
    });
}

// Funkcja do pobierania danych pogodowych
async function fetchWeather(position) {
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Weather data unavailable');
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        weatherInfo.textContent = `Error fetching weather data: ${error.message}`;
        console.error(error);
    }
}

// Funkcja do aktualizacji interfejsu pogodowego
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

// Funkcja do obsługi błędów geolokalizacji
function showError(error) {
    weatherInfo.textContent = `Error getting location: ${error.message}`;
}

// Obsługa geolokalizacji
if (locationButton) {
    locationButton.addEventListener('click', () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(fetchWeather, showError);
        } else {
            weatherInfo.textContent = 'Geolocation is not supported by your browser.';
        }
    });
}

// Obsługa przycisku powrotu
if (goBackButton) {
    goBackButton.addEventListener('click', () => {
        if (slideUp) {
            slideUp.classList.add('active'); // Aktywacja animacji
            setTimeout(() => {
                window.history.back(); // Powrót po animacji
            }, 800);
        }
    });
}

// Rejestracja Service Workera
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Obsługa stanu offline
window.addEventListener('offline', () => {
    if (offlineInfo) offlineInfo.style.display = 'block';
});

window.addEventListener('online', () => {
    if (offlineInfo) offlineInfo.style.display = 'none';
});


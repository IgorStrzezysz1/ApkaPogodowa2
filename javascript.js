const locationButton = document.getElementById('getLocation');
const weatherInfo = document.getElementById('weatherInfo');
const offlineInfo = document.getElementById('offlineInfo');
const DetailWhaetresButton = document.getElementById('DetailWhaetresButton');

DetailWhaetresButton
locationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(fetchWeather, showError);
    } else {
        weatherInfo.textContent = 'Geolocation is not supported by your browser.';
    }
});
async function fetchWeather(position) {
    const { latitude, longitude } = position.coords;
    const apiKey = '83a4e536c6cc9f7b61410fa93df99220'; 
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
function updateWeatherUI(data) {
    weatherInfo.textContent = `Location: ${data.name}, Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
}
// Obsłuż błędy geolokalizacji
function showError(error) {
    weatherInfo.textContent = `Error getting location: ${error.message}`;
}
// Zarejestruj Service Workera
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./service-worker.js')  
//         .then(() => console.log('Service Worker registered'))
//         .catch(error => console.error('Service Worker registration failed:', error));
// }

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
} else {
    console.log('Service Workers are not supported in this browser.');
}

// Sprawdź, czy użytkownik jest offline
window.addEventListener('offline', () => {
    offlineInfo.style.display = 'block';
});
window.addEventListener('online', () => {
    offlineInfo.style.display = 'none';
});
document.getElementById("DetailWhaetresButton").addEventListener("click", () => {
    const page = document.body.querySelector(".page");

    if (page) {
        // Dodanie klasy exit dla animacji
        page.classList.add("exit");

        // Przejście na inną stronę po czasie trwania animacji
        setTimeout(() => {
            window.location.href = "./hello.html";
        }, 500); // Czas trwania animacji w ms
    } else {
        console.error("Element .page nie istnieje!");
        window.location.href = "./hello.html";
    }
});

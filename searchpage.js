const inputSearch = document.querySelector(".input-search");
const btnSearch = document.querySelector("#btn-search");
const errorMessageSpan = document.querySelector(".error-message");
const searchForm = document.getElementById("searchForm");
const searchResult = document.getElementById("searchResult");
const goBackButton = document.getElementById("goBackButton");
const slideUp = document.getElementById("slideUpAnimation");

// Funkcja do aktualizacji interfejsu po wyszukaniu pogody
function updateSearchWeatherUi(data) {
    searchResult.innerHTML = `
        <p class="weatherLocation">Location: ${data.name}</p>
        <p class="weatherCountry">Country: ${data.sys.country}</p>
        <p class="weatherTemp">Temperature: ${data.main.temp}°C</p>
        <p class="weatherInfo">Weather: ${data.weather[0].description}</p>
        <img class="weatherImg" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    `;
    searchResult.classList.add("active");
}

// Funkcja do wyszukiwania pogody dla podanego miasta
async function searchWeatherForCity(city) {
    const apiKey = "83a4e536c6cc9f7b61410fa93df99220";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Weather data not found");
        const data = await res.json();
        updateSearchWeatherUi(data);
    } catch (error) {
        console.error(error);
        errorMessageSpan.textContent = "Error fetching weather data. Please try again.";
    }
}

// Obsługa formularza wyszukiwania
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = inputSearch.value.trim();
    if (!city) {
        errorMessageSpan.textContent = "Please enter a city name.";
        return;
    }
    await searchWeatherForCity(city);
});

// Obsługa przycisku "Go Back"
goBackButton.addEventListener("click", () => {
    slideUp.classList.add("active"); // Uruchomienie animacji
    setTimeout(() => {
        searchResult.classList.remove("active"); // Ukrycie wyników
        inputSearch.value = ""; // Wyczyszczenie pola wyszukiwania
        errorMessageSpan.textContent = ""; // Wyczyszczenie błędów
        slideUp.classList.remove("active"); // Cofnięcie animacji
        window.location.href = "index.html"; // Przekierowanie na stronę index.html
    }, 2500); // Zmieniony czas trwania animacji na 3 sekundy
});

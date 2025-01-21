const inputSearch = document.querySelector(".input-search");
const btnSearch = document.querySelector("#btn-search");
const errorMessageSpan = document.querySelector(".error-message");
const searchForm = document.getElementById("searchForm");
const searchResult = document.getElementById("searchResult");
const goBackButton = document.getElementById("goBackButton");
const slideUp = document.getElementById("slideUpAnimation");
const goBacToSearchbar = document.getElementById("goBacToSearchbar");

// Flaga do śledzenia, czy wykonano wyszukiwanie
let searchPerformed = false;

// Funkcja aktualizująca UI wyników pogody
function updateSearchWeatherUi(data) {
  if (!data || !data.name || !data.sys || !data.weather || !data.main) {
    errorMessageSpan.textContent = "Nieprawidłowe dane pogodowe. Spróbuj ponownie.";
    return;
  }

  searchResult.innerHTML = `
    <p class="weatherLocation">Lokalizacja: ${data.name}</p>
    <p class="weatherCountry">Kraj: ${data.sys.country}</p>
    <p class="weatherTemp">Temperatura: ${data.main.temp}°C</p>
    <p class="weatherInfo">Pogoda: ${data.weather[0].description}</p>
    <img class="weatherImg" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
  `;
  searchResult.classList.add("active");
  searchPerformed = true; // Ustaw flagę na true
  goBacToSearchbar.style.display = 'block'; // Pokaż przycisk "Go Back to Search bar"
}

// Funkcja wyszukiwania pogody dla miasta
async function searchWeatherForCity(city) {
  const apiKey = "83a4e536c6cc9f7b61410fa93df99220";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Nie znaleziono danych pogodowych");
    const data = await res.json();
    updateSearchWeatherUi(data);
  } catch (error) {
    console.error(error);
    errorMessageSpan.textContent = "Błąd pobierania danych pogodowych. Spróbuj ponownie.";
  }
}

// Obsługa formularza wyszukiwania
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = inputSearch.value.trim();
  if (!city) {
    errorMessageSpan.textContent = "Wprowadź nazwę miasta.";
    return;
  }
  errorMessageSpan.textContent = ""; // Wyczyść poprzednie błędy
  await searchWeatherForCity(city);
});

// Obsługa przycisku "Go Back"
goBackButton.addEventListener("click", () => {
  slideUp.classList.add("active"); // Wyzwól animację
  setTimeout(() => {
    searchResult.classList.remove("active"); // Ukryj wyniki wyszukiwania
    inputSearch.value = ""; // Wyczyść pole wyszukiwania
    errorMessageSpan.textContent = ""; // Wyczyść błędy
    slideUp.classList.remove("active"); // Cofnij animację
    window.location.href = "index.html"; // Przekieruj do index.html
    searchPerformed = false; // Zresetuj flagę wyszukiwania
    goBacToSearchbar.style.display = 'none'; // Ukryj przycisk "Go Back to Search bar"
  }, 800); // Czas trwania animacji ustawiony na 800ms
});

// Obsługa przycisku "Go Back to Searchbar"
goBacToSearchbar.addEventListener("click", () => {
  if (searchPerformed) { // Sprawdź, czy wykonano wyszukiwanie
    searchResult.classList.remove("active"); // Ukryj wyniki wyszukiwania
    inputSearch.value = ""; // Wyczyść pole wyszukiwania
    errorMessageSpan.textContent = ""; // Wyczyść błędy
    searchPerformed = false; // Zresetuj flagę wyszukiwania
    goBacToSearchbar.style.display = 'none'; // Ukryj przycisk "Go Back to Search bar"
  } else {
    console.warn("Nie wykonano jeszcze wyszukiwania. Nie można wrócić do paska wyszukiwania.");
  }
});

const inputSearch = document.querySelector(".input-search");
const btnSearch = document.querySelector("#btn-search");
const errorMessageSpan = document.querySelector(".error-message");
const searchForm = document.getElementById("searchForm");
const searchResult = document.getElementById("searchResult");
const goBackButton = document.getElementById("goBackButton");
const slideUp = document.getElementById("slideUpAnimation");
const goBacToSearchbar = document.getElementById("goBacToSearchbar");

// Flag to track if a search has been performed
let searchPerformed = false;

// Function to update search weather UI
function updateSearchWeatherUi(data) {
  searchResult.innerHTML = `
    <p class="weatherLocation">Location: ${data.name}</p>
    <p class="weatherCountry">Country: ${data.sys.country}</p>
    <p class="weatherTemp">Temperature: ${data.main.temp}°C</p>
    <p class="weatherInfo">Weather: ${data.weather[0].description}</p>
    <img class="weatherImg" src="http://openweathermap.org/img.wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
  `;
  searchResult.classList.add("active");
  searchPerformed = true; // Set searchPerformed flag to true
  goBacToSearchbar.style.display = 'block'; // Show the "Go Back to Search bar" button
}

// Function to search weather for city
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

// Search form submission handler
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = inputSearch.value.trim();
  if (!city) {
    errorMessageSpan.textContent = "Please enter a city name.";
    return;
  }
  await searchWeatherForCity(city);
});

// Go Back button handler
goBackButton.addEventListener("click", () => {
    slideUp.classList.add("active"); // Trigger animation
    setTimeout(() => {
      searchResult.classList.remove("active"); // Hide search results
      inputSearch.value = ""; // Clear search input
      errorMessageSpan.textContent = ""; // Clear errors
      slideUp.classList.remove("active"); // Reverse animation
      window.location.href = "index.html"; // Redirect to index.html
      searchPerformed = false; // Reset searchPerformed flag
      goBacToSearchbar.style.display = 'none'; // Hide the "Go Back to Search bar" button
    }, 800); // Animation duration set to 800ms
  });
  
  // Go Back to Searchbar button handler
  goBacToSearchbar.addEventListener("click", () => {
    if (searchPerformed) { // Check if a search has been performed
      searchResult.classList.remove("active"); // Hide search results
      inputSearch.value = ""; // Clear search input
      errorMessageSpan.textContent = ""; // Clear errors
      searchPerformed = false; // Reset searchPerformed flag
      goBacToSearchbar.style.display = 'none'; // Hide the "Go Back to Search bar" button
    } else {
      console.warn("No search performed yet. Cannot go back to search bar.");
    }
  });
  
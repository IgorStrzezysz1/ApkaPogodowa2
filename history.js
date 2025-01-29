const historyList = document.getElementById('historyList');
const clearHistory = document.getElementById('clearHistory');
const slideUp = document.getElementById('slideUpAnimation');
const goBackButton = document.getElementById('goBackButton');

// Load history from Local Storage
const loadHistory = () => {
  const weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  console.log(weatherHistory);
  historyList.innerHTML = weatherHistory
    .map(
      (item) => `
        <li>
          <h3>${item.name}, ${item.country}</h3>
          <p>Temperature: ${item.temp}°C</p>
          <p>Feels Like: ${item.feelsLike}°C</p>
          <p>Weather: ${item.description}</p>
          <p>Wind Speed: ${item.windSpeed} m/s</p>
          <img src="http://openweathermap.org/img/wn/${item.icon}.png" alt="${item.description}">
        </li>
      `
    )
    .join('');
};

// Clear history
clearHistory.addEventListener('click', () => {
  localStorage.removeItem('weatherHistory');
  loadHistory();
  if (Notification.permission === 'granted') {
    new Notification('Informacja', {
      body: 'Twoja historia została wyczyszczona',
      icon: '/icon.png',
    });
  }

});
// Handle "Go Back" button with slide-up animation
goBackButton.addEventListener('click', () => {
  slideUp.classList.add('active');
  setTimeout(() => {
    window.location.href = "index.html"
  }, 800);

});

loadHistory();
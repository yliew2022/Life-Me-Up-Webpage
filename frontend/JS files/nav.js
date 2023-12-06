const searchField = document.getElementById("search-field");

const searchBtn = document.querySelector(".search-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const searchBox = document.querySelector(".search-box");
const id = sessionStorage.getItem('currentUserID')


const toggleButton = document.querySelector('.hamburger-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchContainer = document.querySelector('.search-container');
const logOut = document.querySelector('.log-out')

toggleButton.addEventListener('click', ()=>{
  navMenu.classList.toggle('active')
  logOut.classList.toggle('active')
  searchContainer.classList.toggle('active')
})
document.querySelectorAll('.nav-menu p').forEach((paragraph) => {
    paragraph.id = id;
});

searchBtn.onclick = () => {
    searchBox.classList.add("active");
};

cancelBtn.onclick = () => {
    searchBox.classList.remove("active");
};

searchField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
         performSearch();
    }
});



document.querySelector('.homePage').addEventListener('click',async(e)=>{
    
    window.location.href = `/myProfile/${id}`
})
document.querySelector('.editPage').addEventListener('click',async(e)=>{
    
    window.location.href = `/editProfile/${id}`
})

logOut.addEventListener('click', () =>{
    sessionStorage.removeItem('currentUserID')
    sessionStorage.removeItem('currentUsername')
    sessionStorage.removeItem('otherUser')
    window.location.href = '/'
})

async function performSearch(){
    const value = searchField.value
    window.location.href= `/search/${id}?search=${value}`
}



//weather button
const weatherButton = document.getElementById('weather-button');
const weatherPopup = document.getElementById('weather-popup');
const weatherInfo = document.getElementById('weather-info');

let isWeatherPopupVisible = false;

weatherButton.addEventListener('click', async () => {
  if (isWeatherPopupVisible) {
    weatherPopup.classList.remove('show');
    isWeatherPopupVisible = false;
  } else {
    try {
      const response = await fetch('/weather');
      const weatherData = await response.json();
      const temperature = convertToCelsius(weatherData.main.temp);
      const description = weatherData.weather[0].description;
      weatherInfo.textContent = `Temperature: ${temperature}°F Description: ${description}`;
      weatherPopup.classList.add('show');
      isWeatherPopupVisible = true;
    } catch (error) {
      console.error(error);
      weatherInfo.textContent = 'Failed to fetch weather data.';
      weatherPopup.classList.add('show');
      isWeatherPopupVisible = true;
    }
  }
});

weatherPopup.addEventListener('click', () => {
  weatherPopup.classList.remove('show');
  isWeatherPopupVisible = false;
});

function convertToCelsius(temperature) {
  return Math.round((temperature * 9) / 5 + 32);
}
// Dynamic wallpaper images based on time intervals
const wallpapers = {
    morning: 'morning.jpg',   // 06:00 am  - 12:00 am
    afternoon: 'afternoon.jpg', // 12:00 pm - 18:00 pm
    evening: 'evening.jpg',   // 18:00 pm  - 24:00 pm 
    night: 'night.jpg'        // 00:00 am - 06:00 am
};

// Get elements
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const cityEl = document.getElementById('city');
const temperatureEl = document.getElementById('temperature');
const weatherConditionEl = document.getElementById('weather-condition');
const sliderImgEl = document.getElementById('slider-img');
const taskListEl = document.getElementById('tasks');
const newTaskEl = document.getElementById('new-task');
const deleteCompletedBtn = document.getElementById('delete-completed');


// Default city is Krasnodar, stored in local storage / also ask for allow location change
let currentCity = localStorage.getItem('city') || 'Krasnodar';

// wallpaper based on the current time
function setWallpaper() {
    const currentHour = new Date().getHours();
    let wallpaper;

    if (currentHour >= 6 && currentHour < 12) {
        wallpaper = wallpapers.morning;
    } else if (currentHour >= 12 && currentHour < 18) {
        wallpaper = wallpapers.afternoon;
    } else if (currentHour >= 18 && currentHour < 24) {
        wallpaper = wallpapers.evening;
    } else {
        wallpaper = wallpapers.night;
    }

    document.body.style.backgroundImage = `url('${wallpaper}')`;
}

// Update time and date
function updateTimeAndDate() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;

    const daysOfWeek = ['воскресенье/Sunday', 'понедельник/Monday', 'вторник/Tuesday', 'среда/Wednesday', 'четверг/Thursday', 'пятница/Friday', 'суббота/Saturday'];
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const dayOfWeek = daysOfWeek[now.getDay()];

    dateEl.textContent = `${day} ${month}, ${dayOfWeek}`;
}

// Fetch weather information from API/ also added the current city
async function fetchWeather(city) {
    const apiKey = '9a3e6c7416017f92a75727f3354cdabd';  // my api key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].description;

        temperatureEl.textContent = `${temp}°C`;
        weatherConditionEl.textContent = condition;
        
        //  // Map weather condition to icons
        //  const weatherConditionMap = {
        //     rain: "🌧️",
        //     clouds: "☁️",
        //     snow: "❄️",
        //     clear: "☀️"
        // };
        // const mappedCondition = weatherConditionMap[mainCondition] || "🌍";

        // temperatureEl.textContent = `${temp}°C`;
        // weatherConditionEl.textContent = condition;
        // weatherIconEl.textContent = mappedCondition;
    // } catch (error) {
    //     temperatureEl.textContent = `N/A`;
    //     weatherConditionEl.textContent = `Error fetching data`;
    //     weatherIconEl.textContent = "--";
    // }
    } catch (error) {
        temperatureEl.textContent = `N/A`;
        weatherConditionEl.textContent = `Error fetching data`;
    }
    
}

 // Function to return weather icon based on condition
 function getWeatherIcon(condition) {
     switch (condition) {
         case 'rain':
             return '🌧️';  // Rain emoji (or you can use an actual image/icon)
         case 'clouds':
             return '☁️';  // Cloudy emoji
         case 'snow':
             return '❄️';  // Snow emoji
         case 'clear':
             return '☀️';  // Sunny emoji
         default:
             return '🌍';  // Default globe emoji
     }
    }
    


// Handle location API and fetch weather
function setLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;// we can also use google geolocation for getting latitude and longitude and then paste it here
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                .then(response => response.json())
                .then(data => {
                    currentCity = data.city || 'Krasnodar';
                    localStorage.setItem('city', currentCity);
                    fetchWeather(currentCity);
                    cityEl.value = currentCity;
                });
        },  () => {
            fetchWeather(currentCity);
            cityEl.value = currentCity;
        });
    } else {
        fetchWeather(currentCity);
        cityEl.value = currentCity;
    }
}

// Update city when user changes it
cityEl.addEventListener('change', () => {
    currentCity = cityEl.value;
    localStorage.setItem('city', currentCity);
    fetchWeather(currentCity);
});

// Handle tasks
document.getElementById('add-task').addEventListener('click', () => {
    const taskText = newTaskEl.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        taskListEl.appendChild(li);
        newTaskEl.value = '';
    }
});

// Initial Setup
setWallpaper();
setLocationAndWeather();
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);  // Update time every second


async function fetchWeather(city) {
    const apiKey = '9a3e6c7416017f92a75727f3354cdabd';  // OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].description;

        document.getElementById('temperature').textContent = `${temp}°C`;
        document.getElementById('weather-condition').textContent = condition;

    } catch (error) {
        document.getElementById('temperature').textContent = `N/A`;
        document.getElementById('weather-condition').textContent = `Error fetching data`;
    }
}




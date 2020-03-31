
// Select Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit : "celcuis",
}

// App CONSTS and VARS
const KELVIN = 273;

// API key
const key = "82005d27a116c2880c8f0fcb866998a0";

// check if browser supports geolocation
if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> Browser dons't support Geolocation. </p>";
}

// set User's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// show Error when there is an issue with Geolocation service
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// get weather from API provider
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    // console.log(api);

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        //  weather.pressure = Math.floor(data.main.pressure);
        //  weather.humadity = Math.floor(data.main.humidity);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();;
        });
}

// display weather to UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celcuisToFahrenhite(temperature) {
    return (temperature * 9/5) + 32;
}

// when the user clicks on the temperature element
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius") {
        let fahrenhite = celcuisToFahrenhite(weather.temperature.value);
        fahrenhite = Math.floor(fahrenhite);

        tempElement.innerHTML = `${fahrenhite}°<span>F</span>`;
        weather.temperature.unit = "fahrenhite";
    }
    else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit == "celcuis";
    }
});
// Weather data uses Open-Meteo, so no API key is required.

const GEOCODING_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
    "https://api.open-meteo.com/v1/forecast";


// GET HTML ELEMENTS

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const weatherCard =
    document.getElementById("weatherCard");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const cityName =
    document.getElementById("cityName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");


// SEARCH BUTTON EVENT

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    getWeather(city);
});


// ENTER KEY EVENT

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {

            showError("Please enter a city name.");

            return;
        }

        getWeather(city);
    }
});


// GET WEATHER FUNCTION

async function getWeather(city) {

    try {

        // Clear previous error
        errorMessage.textContent = "";

        // Show loading
        loading.style.display = "block";

        // Hide weather card
        weatherCard.style.display = "none";


        const locationResponse = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find that city right now.");
        }

        const locationData = await locationResponse.json();
        const location = locationData.results?.[0];

        if (!location) {
            throw new Error("City not found. Please enter a valid city.");
        }

        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to load weather data right now.");
        }

        const weatherData = await weatherResponse.json();
        displayWeather(location, weatherData.current);

    }

    catch (error) {

        showError(error.message);

    }

    finally {

        // Hide loading
        loading.style.display = "none";
    }
}

// DISPLAY WEATHER

function displayWeather(location, current) {

    cityName.textContent =
        `${location.name}, ${location.country_code}`;


    temperature.textContent =
        `${Math.round(current.temperature_2m)} °C`;


    description.textContent =
        getWeatherDescription(current.weather_code);


    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)} °C`;


    humidity.textContent =
        `${current.relative_humidity_2m} %`;


    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;


    pressure.textContent =
        `${Math.round(current.surface_pressure)} hPa`;


    weatherIcon.src =
        getWeatherIcon(current.weather_code);


    weatherIcon.alt =
        getWeatherDescription(current.weather_code);


    // Show card

    weatherCard.style.display = "block";
}

function getWeatherDescription(code) {

    const descriptions = {
        0: "clear sky",
        1: "mainly clear",
        2: "partly cloudy",
        3: "overcast",
        45: "foggy",
        48: "rime fog",
        51: "light drizzle",
        53: "drizzle",
        55: "heavy drizzle",
        61: "light rain",
        63: "rain",
        65: "heavy rain",
        71: "light snow",
        73: "snow",
        75: "heavy snow",
        80: "light showers",
        81: "showers",
        82: "heavy showers",
        95: "thunderstorm",
        96: "thunderstorm with hail",
        99: "thunderstorm with heavy hail"
    };

    return descriptions[code] || "unknown conditions";
}

function getWeatherIcon(code) {

    const iconNames = {
        0: "c01d",
        1: "c02d",
        2: "c02d",
        3: "c04d",
        45: "a05d",
        48: "a05d",
        51: "d01d",
        53: "d02d",
        55: "d03d",
        61: "r01d",
        63: "r02d",
        65: "r03d",
        71: "s01d",
        73: "s02d",
        75: "s03d",
        80: "r01d",
        81: "r02d",
        82: "r03d",
        95: "t01d",
        96: "t02d",
        99: "t03d"
    };

    return `https://www.weatherbit.io/static/img/icons/${iconNames[code] || "c04d"}.png`;
}


// ERROR FUNCTION

function showError(message) {

    errorMessage.textContent = message;

    weatherCard.style.display = "none";

    loading.style.display = "none";
}




getWeather("Hyderabad");

// Open-meteo Starting guide

// https://api.open-meteo.com/v1/gfs?latitude=52.52&longitude=13.41&hourly=temperature_2m

// Example Parameters Open-meteo guide
// For the forecast endpoint, the following parameters can be used:

// ●latitude: The latitude of the location.

// ●longitude: The longitude of the location.

// ●hourly: Comma-separated list of weather variables (e.g., temperature_2m, 
// relative_humidity_2m, precipitation).

// ●daily: Comma-separated list of daily weather variables (e.g., 
// temperature_2m_max, temperature_2m_min, precipitation_sum).

// ●current_weather: Set to true to include current weather data.

// ●start_date: The start date of the forecast (e.g., 2024-05-22).

// ●end_date: The end date of the forecast (e.g., 2024-05-22).

// ●timezone: The timezone for the data (e.g., Europe/London)


// Open-meteo api weather codes:
// ●0: Clear sky
// ●1: Mainly clear
// ●2: Partly cloudy
// ●3: Overcast
// ●45: Fog
// ●48: Depositing rime fog
// ●51: Drizzle (light)
// ●53: Drizzle (moderate)
// ●55: Drizzle (dense intensity)
// ●56: Freezing drizzle (light)
// ●57: Freezing drizzle (dense intensity)
// ●61: Rain (slight)
// ●63: Rain (moderate)
// ●65: Rain (heavy intensity)
// ●66: Freezing rain (light)
// ●67: Freezing rain (heavy intensity)
// ●71: Snow fall (slight)
// ●73: Snow fall (moderate)
// ●75: Snow fall (heavy intensity)
// ●77: Snow grains
// ●80: Rain showers (slight)
// ●81: Rain showers (moderate)
// ●82: Rain showers (violent)
// ●85: Snow showers (slight)
// ●86: Snow showers (heavy)
// ●95: Thunderstorm (slight or moderate)
// ●96: Thunderstorm with slight hail
// ●99: Thunderstorm with heavy hail

// //we should pair music playlist : sunny, cloudy,rainy  from Spotify api with the Weather 
// codes on open-meteo API


// hourly: Comma-separated list of weather variables
// 1. Temperature: temperature_2m
// 2. Relative Humidity: relative_humidity_2m
// 3. Dew Point: dewpoint_2m
// 4. Apparent Temperature: apparent_temperature
// 5. Precipitation: precipitation
// 6. Rain: rain
// 7. Showers: showers
// 8. Snowfall: snowfall
// 9. Freezing Rain: freezing_rain
// 10.Weather Code: weathercode
// 11.Pressure: surface_pressure
// 12.Cloud Cover: cloudcover
// 13.Cloud Cover Low: cloudcover_low
// 14.Cloud Cover Mid: cloudcover_mid
// 15.Cloud Cover High: cloudcover_high
// 16.Wind Speed: windspeed_10m
// 17.Wind Direction: winddirection_10m
// 18.Wind Gusts: windgusts_10m
// 19.Shortwave Radiation: shortwave_radiation
// 20.Direct Radiation: direct_radiation
// 21.Diffuse Radiation: diffuse_radiation
// 22.Solar Radiation: solar_radiation
// 23.UV Index: uv_index
// 24.Evapotranspiration: et0_fao_evapotranspiration


// daily: Comma-separated list of daily weather variables
// 1. Maximum Temperature: temperature_2m_max
// 2. Minimum Temperature: temperature_2m_min
// 3. Apparent Temperature Max: apparent_temperature_max
// 4. Apparent Temperature Min: apparent_temperature_min
// 5. Precipitation Sum: precipitation_sum
// 6. Rain Sum: rain_sum
// 7. Showers Sum: showers_sum
// 8. Snowfall Sum: snowfall_sum
// 9. Precipitation Hours: precipitation_hours
// 10.Weather Code: weathercode
// 11.Sunrise: sunrise
// 12.Sunset: sunset
// 13.Windspeed 10m Max: windspeed_10m_max
// 14.Windgusts 10m Max: windgusts_10m_max
// 15.Winddirection 10m Dominant: winddirection_10m_dominant
// 16.Shortwave Radiation Sum: shortwave_radiation_sum
// 17.ET0 FAO Evapotranspiration: et0_fao_evapotranspiration


// javaScript basic fetch for open-meteo:

// const queryUrl = (`https://api.open-meteo.com/v1/forecast?forecast_days=16&timezone=auto&latitude=35&longitude=139&timezone=auto&latitude=48.864716&longitude=2.349014&hourly=temperature_2m,precipitation,rain&daily=weathercode&current_weather=true`);
// function getApi(requestUrl) {
//     fetch(requestUrl)
//     .then(function (response){
//         return response.json();
//     })
//     .then(function(data){
//         console.log(data);
//     });
// }
// getApi(queryUrl)

// getApi(queryUrl)

// event listener which collects the value inputed. cityName as a const to be sent as a parameter for the getCityCoordinates function.
document.getElementById('searchButton').addEventListener('click', function() {
    const cityName = document.getElementById('cityInput').value;
    getCityCoordinates(cityName);
});

// this function is using  Nominatim API to get latitudes and longitudes based on a city search. we get the const values lat,lon from the data.
function getCityCoordinates(city) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                getWeatherData(latitude, longitude);
            } else {
                document.getElementById('weatherResults').innerHTML = 'City not found.';
            }
        })
        .catch(error => console.error('Error fetching city coordinates:', error));
}
// this function uses the lat,lon values as parameters to fetch weather data in Open-meteo api. it gets the response and 
// converts it to json then it is passed to the following function as a parameter
function getWeatherData(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset&timezone=auto`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            console.log(data)
        })
        .catch(error => console.error('Error fetching weather data:', error));

        
  
}

// this function takes the default value unit celsius in open-meteo api and converts it to farenheit unit
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// a function to display the data fetched  and filtered by the 'daily' parameter. it should be reworked to create a card for each day/forecast. 
// the "weather code" value from the "daily" parameter should be utilized for pairing with Spotify api playlist values.
function displayWeatherData(data) {
    const weatherResults = document.getElementById('weatherResults');
    weatherResults.innerHTML = '';

    // local storage for the 'daily' values.
    localStorage.setItem('cityWeather', JSON.stringify(data.daily));
    
    const daily = data.daily;
    for (let i = 0; i < daily.time.length; i++) {
        const date = daily.time[i];
        const maxTempC = daily.temperature_2m_max[i];
        const minTempC = daily.temperature_2m_min[i];
        const maxTempF = convertCelsiusToFahrenheit(maxTempC);
        const minTempF = convertCelsiusToFahrenheit(minTempC);
        const weatherCode = daily.weathercode[i];
        const sunrise = daily.sunrise[i];
        const sunset = daily.sunset[i];

        // the temperature values are rounded to one decimal place with '.toFixed(1)'. This avoids displaying too many decimal places, which can be unnecessary 
        // and clutter the display.
        const weatherInfo = `
            <div>
                <h3>${date}</h3>
                <p>Max Temp: ${maxTempF.toFixed(1)}°F</p>
                <p>Min Temp: ${minTempF.toFixed(1)}°F</p>
                <p>Weather Code: ${weatherCode}</p>
                <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
                <p>===========</p>
            </div>
        `;
        weatherResults.innerHTML += weatherInfo;

        // localStorage.setItem('cityWeather', JSON.stringify(data.daily));
    }
}



// const weatherCodes = {
//     0: "Clear sky",
//     1: "Mainly clear",
//     2: "Partly cloudy",
//     3: "Overcast",
//     61: "Rain Light",
//     63: "Rain mid",
//     65: "Rain heavy",
    // Add more weather codes as needed
// };

// function getParams() {
    // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
    // const searchParamsArr = document.location.forecast.split('&');
  
    // Get the query and format values
//     const query = searchParamsArr[0].split('=').pop();
//     const format = searchParamsArr[1].split('=').pop();
  
//     searchApi(query, format);
//   }

document.addEventListener('DOMContentLoaded', function () {
    // Get the navbar burger element
    const navbarBurger = document.getElementById('navbarBurger');

    // Get the dropdown menu element
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Add a click event listener to the navbar burger
    navbarBurger.addEventListener('click', function () {
        // Toggle the 'is-active' class on both the navbar-burger and the dropdown menu
        navbarBurger.classList.toggle('is-active');
        dropdownMenu.classList.toggle('is-active');
    });
});

// An idea for API Spotify

// These will be for the option buttons near the website title
const btn = document.querySelectorAll(".btn-element");
const searchBtn = document.querySelector("#btn");
const searchInput = document.querySelector("#input-element");
const apiKey = "jegeigudi9237t378y39jbedkuge9yw9";

// When the Spotify API is up, the genre should be connected to the button
btn.forEach(function(item){
    item.addEventListener("click", getGenre)
});

searchBtn.addEventListener("click", searchGenre)

function getGenre (event) {
    let element = event.target.textContent;
    let queryUrl = "https://spotify.com/?q=" + element + "/&apiKey=" + apiKey
    console.log(queryUrl)
};

function searchGenre () {
    const searchValue = searchInput.value;
    let queryUrl = "https://spotify.com/?q=" + searchValue + "/&apiKey=" + apiKey
    console.log(queryUrl);
}

//


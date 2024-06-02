const vibeTab = document.getElementById('vibeTab');
const forecastTab = document.getElementById('forecastTab');
const vibeResults = document.getElementById('vibeResults');
const forecastResults = document.getElementById('weatherResults');
const recentSearches = document.getElementById('recentSearchesCard')
const searchPrompt = document.getElementById('searchPrompt')
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
                saveSearch(city)
                displayRecentSearches()
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
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <h3>${date}</h3>
            <p>Max Temp: ${maxTempF.toFixed(1)}°F</p>
            <p>Min Temp: ${minTempF.toFixed(1)}°F</p>
            <p>Weather Code: ${weatherCode}</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        `;
        
        weatherResults.appendChild(weatherCard);
    }
}
        
        //  

        // localStorage.setItem('cityWeather', JSON.stringify(data.daily));
//     }
// }


// Function to save search to local storage
function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!searches.includes(city)) {
        searches.unshift(city); // Add new search to the beginning
    }
    // Keep only the latest 5 searches
    if (searches.length > 5) {
        searches = searches.slice(0, 5);
    }
    localStorage.setItem('recentSearches', JSON.stringify(searches));
}

// Function to display recent searches
function displayRecentSearches() {
    const localStorageDiv = document.getElementById('LocalStorage');
    localStorageDiv.innerHTML = '';

    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Reverse the searches array to show latest first
    searches.forEach(city => {
        const searchItem = document.createElement('a');
        searchItem.className = 'panel-block';
        searchItem.innerHTML = `
            <span class="panel-icon">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>${city}`;
        searchItem.addEventListener('click', () => {
            document.getElementById('cityInput').value = city;
            getCityCoordinates(city);
        });
        localStorageDiv.appendChild(searchItem);
    });
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

// API Spotify without HTML
// This is for the person who will activate the API Spotify on their account

// You get clientId and clientSecret during registation
const APIController = (function() {
    const clientId = "";
    const clientSecret = "";

    // Each https is from the Spotify API URL. The token will give us actual playlists
    const _getToken = async () => {
        const result = await fetch('https://spotify.com/?apitoken', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    // This gives us a list of catergories
    const _getGenres = async (token) => {
        const result = await fetch('https://spotify.com/v1/browse/categories?', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    // This gives us a list of catergories playlist
    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;

        const result = await fetch('https://spotify.com/?browse/playlist', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer' + token}
        });

        const data = await resultjson();
        return data.categories.items;
    }

    // This gives us items of a playlist
    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch('${tracksEndPoint}?limit=${limit}', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer' + token}

        });

        const data = await resultjson();
        return data.items;
    }

    // This gives us a track
    const _getTrack = async (token, tracksEndPoint) => {
        
        const result = await fetch('${tracksEndPoint}', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer' + token}
        });

        const data = await resultjson();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId); 
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, tracksEndPoint) {
            return _getTrack(token, tracksEndPoint);
        }
    }
})();

// Nav-burger click event listener

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

// Search City
document.getElementById('searchButton').addEventListener('click', function() {
    const cityName = document.getElementById('cityInput').value;
    getCityCoordinates(cityName);
    const searchLocation = document.getElementById(`searchPanel`);
    const panelLocation = document.getElementById(`resultsPanel`);
    panelLocation.classList.remove("hidden");
    panelLocation.classList.add("is-half");
    searchLocation.classList.add("is-half");
    forecastResults.classList.remove('hidden');
    vibeResults.classList.add('hidden')
    forecastTab.classList.add('is-active');
    vibeTab.classList.remove('is-active');
    recentSearches.classList.remove(`hidden`);
    searchPrompt.classList.add('hidden');
});

// Results tabs for Vibe and Forecast
document.addEventListener('DOMContentLoaded', () => {

    vibeTab.addEventListener('click', () => {
        vibeResults.classList.remove('hidden');
        vibeTab.classList.add('is-active');
        forecastResults.classList.add('hidden');
        forecastTab.classList.remove('is-active');
    });

    forecastTab.addEventListener('click', () => {
        forecastResults.classList.remove('hidden');
        forecastTab.classList.add('is-active');
        vibeResults.classList.add('hidden');
        vibeTab.classList.remove('is-active');
    });
    
});

// Event listener for reset search button
document.addEventListener('DOMContentLoaded', () => {

    const resetSearchButton = document.getElementById('resetSearchButton');
    if (resetSearchButton) {
        resetSearchButton.addEventListener('click', () => {
            window.location.href = 'https://wilsacker.github.io/Vibes-Cast/';
        });
    }

});

    // Panel tabs functionality
    const panelTabs = document.getElementsByClassName('panel-tabs')[0].getElementsByTagName('a');
    for (let i = 0; i < panelTabs.length; i++) {
        panelTabs[i].addEventListener('click', () => {
            for (let j = 0; j < panelTabs.length; j++) {
                panelTabs[j].classList.remove('is-active');
            }
            panelTabs[i].classList.add('is-active');

            if (panelTabs[i].id === 'forecastTab') {
                document.getElementById('weatherResults').classList.remove('hidden');
                document.getElementById('vibeResults').classList.add('hidden');
            } else if (panelTabs[i].id === 'vibeTab') {
                document.getElementById('vibeResults').classList.remove('hidden');
                document.getElementById('weatherResults').classList.add('hidden');
            }
        });
    }
    // Modal Listener Event
    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('myModal');
        const openModalButton = document.getElementById('openModal');
        const closeModalButtons = modal.querySelectorAll('.delete, .button');

        openModalButton.addEventListener('click', () => {
            modal.classList.add('is-active');
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('is-active');
            });
        });

    // Close modal when clicking on the modal background
    modal.querySelector('.modal-background').addEventListener('click', () => {
        modal.classList.remove('is-active');
    });
});

// Create function to create panels. Needs whatever object going into the Panel //


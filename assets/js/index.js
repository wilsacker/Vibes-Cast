const vibeTab = document.getElementById('vibeTab');
const forecastTab = document.getElementById('forecastTab');
const vibeResults = document.getElementById('vibeResults');
const forecastResults = document.getElementById('weatherResults');
const recentSearches = document.getElementById('recentSearchesCard')
const searchPrompt = document.getElementById('searchPrompt')
const searchBtn = document.getElementById('searchButton')
const resetSearchButton = document.getElementById('resetSearchButton');

// Function to get city coordinates (lat, lon) using Nominatim API
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
                forecastResults.innerHTML = 'City not found.';
            }
        })
        .catch(error => console.error('Error fetching city coordinates:', error));
}
// Function uses (lat, lon) to get weather data using Open-Meteo API
function getWeatherData(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset&timezone=auto`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            console.log("Weather Data: ", data)
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to convert Celsius to Fahrenheit
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to get weather icon based on weather code
function getWeatherIcon(weathercode) {
    weathercode = Number(weathercode);

    if (weathercode === 0 || weathercode === 1) {
        return '☀️'; // Sun icon for clear or mainly clear sky
    } else if (weathercode === 2 || weathercode === 3 || weathercode === 45) {
        return '☁️'; // Cloud icon for partly cloudy, overcast, or fog
    } else if ([51, 53, 55, 61, 63, 65, 66, 67, 81, 82, 85, 86, 95, 96, 99].includes(weathercode)) {
        return '🌧️'; // Rain icon for various rain and drizzle conditions
    } else {
        console.warn(`Unknown weathercode: ${weathercode}`); // Warn if the weathercode is not recognized
        return '❓'; // Default icon for any other conditions
    }
}

// Function to get weather icon and genre based on weather code
function getWeatherIconAndGenre(weathercode) {
    weathercode = Number(weathercode); // Convert to number
    if (weathercode === 0 || weathercode === 1) {
        return { icon: ':sunny:', genre: 'electronic' }; // Sun icon and electronic music for clear or mainly clear sky
    } else if (weathercode === 2 || weathercode === 3 || weathercode === 45) {
        return { icon: ':cloud:', genre: 'alternative' }; // Cloud icon and alternative music for partly cloudy, overcast, or fog
    } else if ([51, 53, 55, 61, 63, 65, 66, 67, 81, 82, 85, 86, 95, 96, 99].includes(weathercode)) {
        return { icon: ':rain_cloud:', genre: 'jazz' }; // Rain icon and jazz music for various rain and drizzle conditions
    } else {
        console.warn(`Unknown weathercode: ${weathercode}`); // Warn if the weathercode is not recognized
        return { icon: ':question:', genre: 'pop' }; // Default icon and pop music for any other conditions
    }
}

// Function to display weather data
function displayWeatherData(data) {
    const weatherResults = document.getElementById('weatherResults');
    weatherResults.innerHTML = '';

    // Store the 'daily' values in local storage
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


//Spotify Api
async function getAccessToken(clientId, clientSecret) {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

async function getJazzSongs(accessToken) {
    const result = await fetch(`https://api.spotify.com/v1/search?q=genre:jazz&type=track&limit=5`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await result.json();
    return data.tracks.items;
}

async function main(weatherCode) {
    const clientId = '85aa1b8ce49b49eb87d1cfe0ba9b3f96';
    const clientSecret = '2dd9402bc04447cd917e5c5f513603a3';

    try {
        const accessToken = await getAccessToken(clientId, clientSecret);
        const jazzSongs = await getJazzSongs(accessToken);

        // Display the list of jazz songs
        const songsContainer = document.getElementById('songs');
        jazzSongs.forEach((song, index) => {
            const songDiv = document.createElement('div');
            songDiv.innerHTML = `
                <h2>${index + 1}. ${song.name} by ${song.artists[0].name}</h2>
                <iframe src="https://open.spotify.com/embed/track/${song.id}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                <p><a href="${song.external_urls.spotify}" target="_blank">Listen on Spotify</a></p>
            `;
            songsContainer.appendChild(songDiv);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

main();


//================================================================================
//================================================================================
//================================================================================


// ALL EVENT LISTENERS

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

    // Results tabs for Vibe and Forecast
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

    // Event listener for reset search button
    if (resetSearchButton) {
        resetSearchButton.addEventListener('click', () => {
            window.location.href = 'https://wilsacker.github.io/Vibes-Cast/';
        });
    }

});


// Search City
searchBtn.addEventListener('click', function() {
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
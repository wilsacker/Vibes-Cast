const vibeTab = document.getElementById('vibeTab');
const forecastTab = document.getElementById('forecastTab');
const vibeResults = document.getElementById('vibeResults');
const forecastResults = document.getElementById('weatherResults');
const recentSearches = document.getElementById('recentSearchesCard')
const searchPrompt = document.getElementById('searchPrompt')
const searchBtn = document.getElementById('searchButton')
const resetSearchButton = document.getElementById('resetSearchButton');

// Function to get city coordinates (lat, lon)
function getCityCoordinates(city) {
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const latitude = data.results[0].latitude;
                const longitude = data.results[0].longitude;
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

// Function to get weather icon and genre based on weather code. Maps weather codes to icons and music genres
function getWeatherIconAndGenre(weathercode) {
    weathercode = Number(weathercode);
    if (weathercode === 0 || weathercode === 1) {
        return { icon: '☀️', genre: 'dance electronic reggae afrobeat' };
    } else if (weathercode === 2 || weathercode === 3 || weathercode === 45) {
        return { icon: '☁️', genre: 'alternative hip-hop indie ' };
    } else if ([51, 53, 55, 61, 63, 65, 66, 67, 81, 82, 85, 86, 95, 96, 99].includes(weathercode)) {
        return { icon: '🌧️', genre: 'jazz blues' };
    } else {
        console.warn(`Unknown weathercode: ${weathercode}`);
        return { icon: '❓', genre: 'pop' };
    }
}

// Spotify API Functions
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

// Fetches playlists from Spotify based on the genre. Moved the definition of the fetchSpotifyData function above the displayWeatherData function so it is available when called.
async function fetchSpotifyData(genre) {
    const clientId = '85aa1b8ce49b49eb87d1cfe0ba9b3f96';
    const clientSecret = '2dd9402bc04447cd917e5c5f513603a3';

    try {
        const accessToken = await getAccessToken(clientId, clientSecret);
        const result = await fetch(`https://api.spotify.com/v1/search?q=genre:${genre}&type=playlist&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const data = await result.json();
        displaySpotifyPlaylist(data.playlists.items[0]);
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
    }
}

// Displays the fetched Spotify playlist in the vibeResults div.
function displaySpotifyPlaylist(playlist) {
    vibeResults.innerHTML = ''; // Clear previous results

    if (playlist) {
        const playlistDiv = document.createElement('div');
        playlistDiv.innerHTML = `
            <h2>${playlist.name}</h2>
            <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            <p><a href="${playlist.external_urls.spotify}" target="_blank">Listen on Spotify</a></p>
        `;
        vibeResults.appendChild(playlistDiv);
    } else {
        vibeResults.innerHTML = '<p>No playlist found.</p>';
    }
}

// Function to display weather data
function displayWeatherData(data) {
    forecastResults.innerHTML = '';

    // Local storage for the 'daily' values
    localStorage.setItem('cityWeather', JSON.stringify(data));

    const daily = data.daily;

    for (let i = 0; i < daily.time.length; i++) {
        const date = dayjs(daily.time[i]).format('dddd D MMM'); // Format date using Day.js
        const maxTempC = daily.temperature_2m_max[i];
        const minTempC = daily.temperature_2m_min[i];
        const maxTempF = convertCelsiusToFahrenheit(maxTempC);
        const minTempF = convertCelsiusToFahrenheit(minTempC);
        const weatherCode = daily.weathercode[i];
        const { icon, genre } = getWeatherIconAndGenre(weatherCode);

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <h3><strong>${date}</strong></h3>
            <p><strong>Max: ${maxTempF.toFixed(1)}°F</strong></p>
            <p><strong>Min: ${minTempF.toFixed(1)}°F</strong></p>
            <p><strong>Weather: ${icon}</strong></p>
            <br>
        `;
        forecastResults.appendChild(weatherCard);

        // Fetch and display Spotify data based on the genre
        fetchSpotifyData(genre);
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
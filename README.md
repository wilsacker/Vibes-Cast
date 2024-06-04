# Vibes-Cast

## Description

- Our goal for this project was to create a site which provides a playlist and weather forecast that match each other (i.e. cold/rainy day = sad music, hot/sunny day = happy music)
- Overall, we were able to achieve functionality of our primary goal, with a few limitations, despite inherent issues with using Spotify (an 0Auth API)

## Installation

- Used Bulma for general HTML infrastructure and adjusted it to accomplish our ideal site design (based on wireframe):
    - Nav (clickable home page button)
    - Search bar
    - colomns (for site organization)
    - Modal
    - Local Storage Panel
    - Results Panel with tabs for forecast and vibe
    - Footer
- Used Javascript to add multiple core functionalities:
    - Buttons
    - Search bar
    - Results panel
    - Hiding and un-hiding HTML based on event listeners
    - Modal
    - etc.
- Set up weather API in Javascript to return results based on locational data (lat, lon)
- integrated weather API into the forecast tab within the results panel
- Set up spotify API to return songs
- Set up spotify to return playlist based on the weather conditions of the specified location (based on the weather api returns)
- Generally cleaned up site repo to match criteria

## Screenshot

![Home](/assets/images/Screenshot%202024-06-03%20at%2015.21.37.png)
![Modal](/assets/images/Screenshot%202024-06-03%20at%2015.21.46.png)
![Forecast Results](/assets/images/Screenshot%202024-06-03%20at%2015.22.02.png)
![Vibe Results](/assets/images/Screenshot%202024-06-03%20at%2015.22.08.png)

## Link to deployed website: https://wilsacker.github.io/Vibes-Cast/

## Github Repo Link: https://github.com/wilsacker/Vibes-Cast

## Credits

Collaborators:
1. https://github.com/wilsacker
2. https://github.com/AhmedGarcia
3. https://github.com/Lennymv
4. https://github.com/sickcurse

Used Bulma, https://bulma.io/, Conducted searches in Google.com, https://www.w3schools.com/, utilized ChatGPT, https://developer.spotify.com/documentation/web-ap to understand concepts and build site.

## Licensed

© 2024 Vibes-Cast, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
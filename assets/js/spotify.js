const requestSpotifyAccess = () => {
    const params = new URLSearchParams({
        response_type: "token",
        client_id: "85aa1b8ce49b49eb87d1cfe0ba9b3f96",
        scope: 'user-read-private user-read-email',// Example scopes, add other scopes as needed
        redirect_uri: location.protocol + "//" + location.host + location.pathname,
    })
    const url = "https://accounts.spotify.com/authorize?" + params
    location.href = url
}

let auth = Object.fromEntries(new URLSearchParams(location.hash.substring(1)).entries())

if (auth.access_token){
    location.hash = ""
    localStorage.setItem("spotify_access_token", auth.access_token)
}

const access_token = localStorage.getItem("spotify_access_token")
if (access_token) {
    document.querySelector("#authorize").hidden = true
    // you are authorized
    getSpotifyData("pop")   // forecast says sunny == 'pop'  --> user inputs a city for a forecast --> rainy == "jazz"
} else{
    // you need to request token
    document.querySelector("#authorize").addEventListener("click", requestSpotifyAccess)
}

console.log(auth)


//async function getProfile(accessToken) {
async function getSpotifyData(searchTerm) {
    let accessToken = localStorage.getItem('spotify_access_token');
    
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=10', {
    //  const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    // const response = await fetch(`https://api.spotify.com/v1/playlists/New%20Release/followers`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    console.log("Data: ", data);
    
    let playlistId = data.playlists.items[0].id
    console.log('ID: ', playlistId)

   
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    
    const playlistData = await playlistResponse.json();
    console.log("Playlist Data: ", playlistData);
    displayPlaylist(playlistData);
}

function displayPlaylist(playlistData) {
    const playlistContainer = document.getElementById('vibeResults');
    playlistContainer.innerHTML = ''; // Clear any existing content
    const playlistName = document.createElement('h2');
    playlistName.textContent = playlistData.name;
    playlistContainer.appendChild(playlistName);
    const trackList = document.createElement('ul');
    playlistData.tracks.items.forEach(item => {
        const trackItem = document.createElement('li');
        trackItem.textContent = `${item.track.name} by ${item.track.artists.map(artist => artist.name).join(', ')}`;
        trackList.appendChild(trackItem);
    });
    playlistContainer.appendChild(trackList);
}

// const getRefreshToken = async () => {

//     // refresh token that has been previously stored
//     const refreshToken = localStorage.getItem('refresh_token');
//     const url = "https://accounts.spotify.com/api/token";
 
//      const payload = {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/x-www-form-urlencoded'
//        },
//        body: new URLSearchParams({
//          grant_type: 'refresh_token',
//          refresh_token: refreshToken,
//          client_id: clientId
//        }),
//      }
//      const body = await fetch(url, payload);
//      const response await body.json();
 
//      localStorage.setItem('access_token', response.accessToken);
//      localStorage.setItem('refresh_token', response.refreshToken);
// }


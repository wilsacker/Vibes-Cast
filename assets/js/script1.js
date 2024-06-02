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
    const result = await fetch('https://api.spotify.com/v1/search?q=genre:jazz&type=track&limit=5', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await result.json();
    return data.tracks.items;
}

async function main() {
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
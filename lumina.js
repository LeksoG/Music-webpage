let isFirstClick = true;

function toggleChatbox() {
    const chatbox = document.getElementById('chatbox');
    const luminaButton = document.getElementById('luminaButton');
    if (isFirstClick) {
        chatbox.style.display = 'flex';
        luminaButton.style.display = 'none';
        isFirstClick = false;
    } else {
        const isChatboxVisible = chatbox.style.display === 'flex';
        chatbox.style.display = isChatboxVisible ? 'none' : 'flex';
        luminaButton.style.display = isChatboxVisible ? 'flex' : 'none';
    }
}

playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = "⏸"; // Change to pause icon
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = "▶"; // Change to play icon
    }
});

// Sync the button state whenever playback starts or ends
audioPlayer.addEventListener('play', () => {
    playPauseButton.textContent = "⏸"; // Change to pause icon
});

audioPlayer.addEventListener('pause', () => {
    playPauseButton.textContent = "▶"; // Change to play icon
});

// Function to determine if input is music-related
function isMusicRelated(input) {
    const musicKeywords = [
        'song', 'track', 'album', 'artist', 'music', 'playlist',
        'genre', 'melody', 'tune', 'beats', 'rhythm'
    ];
    return musicKeywords.some(keyword => input.toLowerCase().includes(keyword));
}

function generateChatResponse(input, isUser = false) {
    const chatboxMessages = document.getElementById('chatboxMessages');
    const message = document.createElement('div');
    message.className = `chat-response ${isUser ? 'user' : ''}`; // Add 'user' class for user messages
    message.textContent = input;
    chatboxMessages.appendChild(message);

    // Scroll to the bottom of the chatbox
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}


// Update suggestions or respond in the chatbox
function updateSuggestions(description) {
    const tracks = [
        'Happy Tune',
        'Sad Symphony',
        'Energetic Vibes',
        'Relaxing Instrumentals',
        'Classical Melodies',
        'Upbeat Pop',
        'Chill Beats',
        'Jazz Essentials'
    ];

    const suggestions = document.getElementById('suggestions');
    const results = tracks.filter(track =>
        track.toLowerCase().includes(description.toLowerCase())
    );

    while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
    }

    if (isMusicRelated(description)) {
        // Show a chat-style response for music-related input
        generateChatResponse(`Searching for music related to "${description}"`);
    } else if (description.trim() !== "" && results.length > 0) {
        // Show suggestions if input matches track names
        suggestions.style.display = 'flex';
        results.forEach(track => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = track;
            suggestion.setAttribute('onclick', `handleSuggestionClick('${track}')`);
            suggestions.appendChild(suggestion);
        });
    } else {
        suggestions.style.display = 'none';
        generateChatResponse(`I'm sorry, I couldn't find anything related to "${description}".`);
    }
}

// Function to handle the Enter key in the search bar
function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchBar = document.getElementById('searchbar');
        const description = searchBar.value.trim();
        updateSuggestions(description);
    }
}

// Function to handle suggestion clicks
function handleSuggestionClick(suggestion) {
    const searchBar = document.getElementById('searchbar');
    searchBar.value = suggestion;
    startSearch(suggestion);
}

function startSearch(suggestion) {
    const searchBar = document.getElementById('searchbar');
    const searchingText = document.getElementById('searching');
    const noResults = document.getElementById('noResults');
    const suggestions = document.getElementById('suggestions');

    const description = searchBar.value;
    const songStype = getSongStypeFromSuggestion(suggestion);

    // If songStype is invalid, log it and return early
    if (!songStype) {
        console.error('Invalid songStype:', songStype);
        return; // Exit if songStype is invalid
    }

    // Filter songs based on the selected songStype
    const filteredSongs = playlist.filter(song => {
        if (!song.songStype) {
            console.error('song.songStype is undefined for:', song);
            return false; // Skip this song if songStype is undefined
        }
        return song.songStype.toLowerCase() === songStype.toLowerCase();
    });

    searchingText.style.display = 'block';
    searchBar.classList.add('spin');
    noResults.style.display = 'none';

    setTimeout(() => {
        searchingText.style.display = 'none';
        searchBar.classList.remove('spin');

        if (filteredSongs.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            displayFilteredSongs(filteredSongs);
        }

        suggestions.style.display = filteredSongs.length > 0 ? 'flex' : 'none';
    }, 1500);
}

// Function to map a suggestion to a songStype
function getSongStypeFromSuggestion(suggestion) {
    const mapping = {
        'Happy Tune': 'Energetic',
        'Sad Symphony': 'Melancholic',
        'Energetic Vibes': 'Energetic',
        'Relaxing Instrumentals': 'Relaxing',
        'Classical Melodies': 'Classical',
        'Upbeat Pop': 'Pop',
        'Chill Beats': 'Pop',
        'Rock': 'Rock'
    };

    const songStype = mapping[suggestion];
    if (!songStype) {
        console.error(`No songStype found for suggestion: ${suggestion}`);
        return ''; // Return an empty string or handle it differently if necessary
    }
    return songStype;
}

// Display filtered songs in the UI
function displayFilteredSongs(songs) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <img src="${song.albumArt}" alt="${song.trackName}" onclick="playSong('${song.trackName}')"/>
            <span>${song.trackName}</span>
        `;
        resultsContainer.appendChild(songElement);
    });
}

function playSong(trackName) {
    // Find the song in the playlist based on the trackName
    const song = playlist.find(song => song.trackName === trackName);

    if (song) {
        const trackIndex = playlist.indexOf(song); // Get the index of the song in the playlist

        // Call your existing function to update and play the track (you may already have it defined)
        updateTrack(trackIndex);

        // Play the song
        audioPlayer.play();

        // Update play/pause button text (assuming you have a playPauseButton element)
        playPauseButton.textContent = "⏸"; // Change to pause symbol

        // Clear and hide the dropdown (assuming suggestionDropdown is the element)
        suggestionDropdown.style.display = "0";
        setTimeout(
            () => (suggestionDropdown.style.display = "none"), 
            300
        ); // Hide after fade

        // Set the search bar to the selected song
        const searchBar = document.getElementById('searchbar');
        searchBar.value = song.trackName;
    } else {
        console.error('Song not found in playlist:', trackName);
    }
  }
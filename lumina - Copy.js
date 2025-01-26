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

    if (description.trim() !== "" && results.length > 0) {
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
    }
}

function handleSearch(event) {
    if (event.key === 'Enter') {
startSearch();
    }
}

function handleSuggestionClick(suggestion) {
    const searchBar = document.getElementById('searchbar');
    searchBar.value = suggestion;
    startSearch();
}

function startSearch() {
    const searchBar = document.getElementById('searchbar');
    const searchingText = document.getElementById('searching');
    const noResults = document.getElementById('noResults');
    const suggestions = document.getElementById('suggestions');

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

    const description = searchBar.value;
    const results = tracks.filter(track =>
track.toLowerCase().includes(description.toLowerCase())
    );

    searchingText.style.display = 'block';
    searchBar.classList.add('spin');
    noResults.style.display = 'none';

    setTimeout(() => {
searchingText.style.display = 'none';
searchBar.classList.remove('spin');

if (results.length === 0) {
    noResults.style.display = 'block';
} else {
    noResults.style.display = 'none';
}

suggestions.style.display = results.length > 0 ? 'flex' : 'none';
    }, 1500);
}
let query = "";
const playPauseButton = document.getElementById("playPauseButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const albumContainer = document.getElementById("albumContainer");
const albumArt = document.getElementById("albumArt");
const audioPlayer = document.getElementById("audioPlayer");
const audioSource = document.getElementById("audioSource");
const trackNameDisplay = document.getElementById("trackName");
const lyricsButtonsContainer = document.getElementById(
    "lyricsButtonsContainer"
);
const shareButton = document.getElementById("shareButton");
const shareLinkContainer = document.getElementById("shareLinkContainer");
const shareLink = document.getElementById("shareLink");
const copyButton = document.getElementById("copyButton");
const copySuccess = document.getElementById("copySuccess");
const searchBar = document.getElementById("searchBar");
const searchContainer = document.querySelector(".search-container");

// Create a dropdown for suggestions
const suggestionDropdown = document.createElement("div");
suggestionDropdown.style.position = "absolute";
suggestionDropdown.style.top = `${searchBar.offsetTop + searchBar.offsetHeight}px`;
suggestionDropdown.style.left = `${searchBar.offsetLeft}px`;
suggestionDropdown.style.width = `${searchBar.offsetWidth}px`;
suggestionDropdown.style.backgroundColor = "#fff";
suggestionDropdown.style.border = "1px solid #ccc";
suggestionDropdown.style.borderRadius = "8px";
suggestionDropdown.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
suggestionDropdown.style.zIndex = "1000";
suggestionDropdown.style.maxHeight = "200px";
suggestionDropdown.style.overflowY = "auto";
suggestionDropdown.style.display = "none"; // Hidden by default
suggestionDropdown.style.transition = "opacity 0.3s ease"; // Smooth fade-in and fade-out effect
suggestionDropdown.style.opacity = "0"; // Start as invisible
document.body.appendChild(suggestionDropdown);

// Event listener for typing in the search bar (for suggestions)
searchBar.addEventListener("input", (event) => {
    const query = searchBar.value.trim().toLowerCase();
    suggestionDropdown.innerHTML = ""; // Clear previous suggestions

    if (!query) {
        suggestionDropdown.style.display = "none"; // Hide dropdown if input is empty
        return;
    }

    // Filter songs that match the query
    const matchingTracks = playlist.filter((track) =>
        track.trackName.toLowerCase().includes(query)
    );

    if (matchingTracks.length > 0) {
        suggestionDropdown.style.display = "block";
        suggestionDropdown.style.opacity = "1"; // Fade in the dropdown

        // Display matching tracks as suggestions
        matchingTracks.forEach((track) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.style.padding = "10px";
            suggestionItem.style.cursor = "pointer";
            suggestionItem.style.borderBottom = "1px solid #eee";
            suggestionItem.style.fontSize = "14px";
            suggestionItem.style.color = "#333";
            suggestionItem.style.transition = "background-color 0.3s ease"; // Smooth background color transition
            suggestionItem.textContent = track.trackName;

            // Highlight the suggestion on hover
            suggestionItem.addEventListener("mouseenter", () => {
                suggestionItem.style.backgroundColor = "#f5f5f5"; // Light hover effect
            });
            suggestionItem.addEventListener("mouseleave", () => {
                suggestionItem.style.backgroundColor = "#fff"; // Revert to default background
            });

            // Click event to play the selected song
            suggestionItem.addEventListener("click", () => {
                const trackIndex = playlist.indexOf(track);
                updateTrack(trackIndex);
                audioPlayer.play();
                playPauseButton.textContent = "⏸"; // Update play/pause button text

                // Clear and hide the dropdown
                suggestionDropdown.style.display = "0";
                setTimeout(
                    () => (suggestionDropdown.style.display = "none"),
                    300
                ); // Hide after fade
                searchBar.value = track.trackName; // Set the search bar to the selected song
            });

            suggestionDropdown.appendChild(suggestionItem);
        });
    } else {
        suggestionDropdown.style.display = "0"; // Hide dropdown if no matches
        setTimeout(() => (suggestionDropdown.style.display = "none"), 300); // Hide after fade
    }
});

// Hide suggestions dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (
        !suggestionDropdown.contains(event.target) &&
        event.target !== searchBar
    ) {
        suggestionDropdown.style.display = "0";
        setTimeout(() => (suggestionDropdown.style.display = "none"), 300); // Hide after fade
    }
});




// Create a result container dynamically
const resultContainer = document.createElement("div");
resultContainer.style.display = "none";
resultContainer.style.marginTop = "20px";
resultContainer.style.padding = "20px";
resultContainer.style.background = "rgba(45, 49, 56, 0.9)";
resultContainer.style.borderRadius = "15px";
resultContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.4)";
searchContainer.appendChild(resultContainer);



const style = document.createElement("style");
style.textContent = `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }

                  .fade-out {
                    animation: fadeOut 0.5s forwards;
                  }

                  @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                  }
                `;
document.head.appendChild(style);
searchBar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        query = searchBar.value.trim().toLowerCase();
        if (!query) return;

        // Show spinning loader
        const spinner = document.createElement("div");
        spinner.style.border = "4px solid rgba(255, 255, 255, 0.2)";
        spinner.style.borderTop = "4px solid #ffffff";
        spinner.style.borderRadius = "50%";
        spinner.style.width = "30px";
        spinner.style.height = "30px";
        spinner.style.animation = "spin 1s linear infinite";
        spinner.style.margin = "0 auto";
        resultContainer.innerHTML = "";
        resultContainer.appendChild(spinner);
        resultContainer.style.display = "block";

        // Simulate a delay for 1 second
        setTimeout(() => {
            const track = playlist.find(
                (t) => t.trackName.toLowerCase() === query
            );

            if (track) {
                // Display the track info
                resultContainer.innerHTML = `
                       <img src="${track.albumArt}" style="width: 100px; height: 100px; border-radius: 10px; margin-bottom: 10px;" />
                       <div style="font-size: 18px; font-weight: bold;">${track.trackName}</div>
                       <a href="#" id="playTrackLink" style="color: #ff0000; text-decoration: none;">Play</a>
                      `;
                // Add event listener to the "Play" link
                document
                    .getElementById("playTrackLink")
                    .addEventListener("click", () => {
                        // Update the track and play the music
                        const trackIndex = playlist.indexOf(track);
                        updateTrack(trackIndex);
                        audioPlayer.play();
                        playPauseButton.textContent = "⏸"; // Update play/pause button text
                    });
            } else {
                // Display "not found" message
                resultContainer.innerHTML = `<div style="color: #ff0000;">Music not found.</div>`;
            }
        }, 1000);

        // Add click listener to dismiss the results
        document.addEventListener("click", handleClickOutside);
    }
});

// Function to handle clicks outside the result container
function handleClickOutside(event) {
    if (
        !resultContainer.contains(event.target) &&
        event.target !== searchBar
    ) {
        resultContainer.classList.add("fade-out"); // Add fade-out class
        setTimeout(() => {
            resultContainer.style.display = "none"; // Hide after animation
            resultContainer.classList.remove("fade-out"); // Remove class for future use
        }, 500); // Match animation duration
        document.removeEventListener("click", handleClickOutside);
    }
}

let currentTrackIndex = 0;

function updateTrack(index) {
    history.pushState(null, "", "#" + index);

    currentTrackIndex = index;

    audioSource.src = playlist[index].src;
    albumArt.src = playlist[index].albumArt;
    audioPlayer.load();
    trackNameDisplay.textContent = playlist[index].trackName;

    const lyricsButton = document.createElement("button");
    lyricsButton.textContent = "Lyrics";
    lyricsButton.classList.add("lyrics-button");
    lyricsButton.addEventListener("click", () =>
        showLyrics(playlist[index].lyrics)
    );

    lyricsButtonsContainer.innerHTML = "";
    lyricsButtonsContainer.appendChild(lyricsButton);
    albumContainer.classList.add("active");
}

function showLyrics(lyrics) {
    // Create the lyrics modal
    const lyricsModal = document.createElement("div");
    lyricsModal.classList.add("lyrics-modal");
    lyricsModal.innerHTML = `<pre>${lyrics}</pre><button onclick="closeLyrics()">Close</button>`;

    // Add the modal to the document body
    document.body.appendChild(lyricsModal);

    // Add the animation class for the wavy effect
    lyricsModal.classList.add("animate");

    // Remove the animation class after the animation ends
    lyricsModal.addEventListener("animationend", () => {
        lyricsModal.classList.remove("animate");
    });
}

function closeLyrics() {
    const modal = document.querySelector(".lyrics-modal");
    if (modal) {
        modal.remove();
    }
}

function showAlbumOnLoad() {
    albumContainer.classList.add("active");
}

// Add Event Listeners
playPauseButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = "⏸";
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = "▶";
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // Add Event Listeners
    playPauseButton.addEventListener("click", () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = "⏸";
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = "▶";
        }
    });


    document.addEventListener("DOMContentLoaded", () => {
        const initialIndex = parseInt(
            window.location.hash.replace("#", "") || "0"
        );

        updateTrack(initialIndex);
        showAlbumOnLoad();
    });
    const initialIndex = parseInt(
        window.location.hash.replace("#", "") || "0"
    );

    updateTrack(initialIndex);
    showAlbumOnLoad();
});

nextButton.addEventListener("click", () => {
    // Add slide-out animation to the current album
    albumContainer.classList.add("slide-out-left");

    setTimeout(() => {
        // Change to the next track after the slide-out animation
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        updateTrack(currentTrackIndex);
        const track = playlist.find(
            (t) => t.trackName.toLowerCase() === query
        );
        // Add the slide-in animation for the new track
        albumContainer.classList.remove("slide-out-left");
        albumContainer.classList.add("slide-in-right");
        albumArt.src = playlist[currentTrackIndex].albumArt;
        // Automatically play the track
        audioPlayer.play();
        playPauseButton.textContent = "⏸";
    }, 500); // Match the animation duration
});

prevButton.addEventListener("click", () => {
    // Add slide-out animation to the current album
    albumContainer.classList.remove("slide-in-left", "slide-in-right");
    albumContainer.classList.add("slide-out-right");

    setTimeout(() => {
        // Change to the previous track after the slide-out animation
        currentTrackIndex =
            (currentTrackIndex - 1 + playlist.length) % playlist.length;
        updateTrack(currentTrackIndex);

        // Automatically play the track
        audioPlayer.play();
        playPauseButton.textContent = "⏸";

        // Add slide-in animation for the previous album
        albumContainer.classList.remove("slide-out-right");
        albumContainer.classList.add("slide-in-left");
    }, 500); // Match the animation duration
});

shareButton.addEventListener("click", () => {
    const trackName = playlist[currentTrackIndex].trackName
        .replace(/\s+/g, "-")
        .toLowerCase();
    const link = `https://leksog.github.io/Music-webpage/#${currentTrackIndex}`;
    shareLink.value = link;
    // Show the share link container
    shareLinkContainer.classList.remove("hidden");
});
copyButton.addEventListener("click", () => {
    // Copy the link to clipboard
    shareLink.select();
    shareLink.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    // Show success message
    copySuccess.classList.add("show");

    // Hide the success message after 2 seconds
    setTimeout(() => {
        copySuccess.classList.remove("show");
    }, 2000);
});

// Optional: Close the share link container when clicking outside
window.addEventListener("click", (e) => {
    if (
        !shareLinkContainer.contains(e.target) &&
        e.target !== shareButton
    ) {
        shareLinkContainer.classList.add("hidden");
    }
});

// Hamburger Menu

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu-options');
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
}

function toggleCustomize() {
    const customizeSection = document.getElementById('customizeSection');
    customizeSection.style.display = customizeSection.style.display === 'none' || customizeSection.style.display === '' ? 'flex' : 'none';
}

function changeButtonColor(event) {
    const color = event.target.value;
    document.documentElement.style.setProperty('--button-hover-color', color);
    document.querySelector('.color-picker').style.boxShadow = `0 0 10px ${color}`;
}

function toggleDarkLight() {
    const body = document.body;
    const isLightMode = body.classList.toggle("light-mode");

    if (isLightMode) {
        document.documentElement.style.setProperty('--button-color', '#ddd');
        document.documentElement.style.setProperty('--menu-bg', '#f4f4f4');
        document.documentElement.style.setProperty('--menu-text', 'black');
    } else {
        document.documentElement.style.setProperty('--button-color', '#333');
        document.documentElement.style.setProperty('--menu-bg', '#181818');
        document.documentElement.style.setProperty('--menu-text', 'white');
    }
}

function resizeButton(event) {
    const size = event.target.value;
    document.documentElement.style.setProperty('--button-size', size + 'px');
}
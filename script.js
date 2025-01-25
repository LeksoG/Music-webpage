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

const playlist = [
    {
        src: "tracks/track-1.mp3",
        albumArt: "images/album1.jpg",
        trackName: "Californication",
        lyrics: `Psychic spies from China try to steal your mind's elation
      And little girls from Sweden dream of silver screen quotation
      And if you want these kind of dreams it's Californication
      It's the edge of the world and all of Western civilization
      The sun may rise in the East, at least it settled in a final location
      It's understood that Hollywood sells Californication
      Pay your surgeon very well to break the spell of aging
      Celebrity skin, is this your chin, or is that war you're waging?
      First born unicorn
      Hardcore soft porn
      Dream of Californication
      Dream of Californication
      Dream of Californication
      Dream of Californication
      Marry me, girl, be my fairy to the world, be my very own constellation
      A teenage bride with a baby inside getting high on information
      And buy me a star on the boulevard, it's Californication
      Space may be the final frontier, but it's made in a Hollywood basement
      And Cobain, can you hear the spheres singing songs off Station To Station?
      And Alderaan's not far away, it's Californication
      Born and raised by those who praise control of population
      Well, everybody's been there and I don't mean on vacation
      First born unicorn
      Hardcore soft porn
      Dream of Californication
      Dream of Californication
      Dream of Californication
      Dream of Californication
      Destruction leads to a very rough road, but it also breeds creation
      And earthquakes are to a girl's guitar, they're just another good vibration
      And tidal waves couldn't save the world from Californication
      Pay your surgeon very well to break the spell of aging
      Sicker than the rest, there is no test, but this is what you're craving
      First born unicorn
      Hardcore soft porn
      Dream of Californication
      Dream of Californication
      Dream of Californication
      Dream of Californication`,
    },
    {
        src: "tracks/track-2.mp3",
        albumArt: "images/album2.jpg",
        trackName: "Lose Yourself",
        lyrics: `[Intro]
      Look... If you had... one shot... or one opportunity...
      To seize everything you ever wanted... one moment...
      Would you capture it? Or just let it slip?
      Yo

      [Verse 1]
      His palms are sweaty, knees weak, arms are heavy
      There's vomit on his sweater already, mom's spaghetti
      He's nervous, but on the surface he looks calm and ready
      to drops bombs, but he keeps on forgetting
      what he wrote down, the whole crowd goes so loud
      He opens his mouth but the words won't come out
      He's chokin, how? Everybody's jokin now
      The clock's run out, time's up, over - BLAOW!
      Snap back to reality, OHH! there goes gravity
      OHH! there goes Rabbit, he choked
      He's so mad, but he won't
      Give up that easy nope, he won't have it
      He knows, his whole back's to these ropes
      It don't matter, he's dope
      He knows that, but he's broke
      He's so sad that he knows
      when he goes back to this mobile home, that's when it's
      back to the lab again, yo, this whole rap shift
      He better go capture this moment and hope it don't pass him

      [Chorus]
      You better - lose yourself in the music, the moment
      You own it, you better never let it go (go)
      You only get one shot, do not miss your chance to blow
      This opportunity comes once in a lifetime
      You better - lose yourself in the music, the moment
      You own it, you better never let it go (go)
      You only get one shot, do not miss your chance to blow
      This opportunity comes once in a lifetime
      You better..

      [Verse 2]
      Soul's escaping, through this hole that is gaping
      This world is mine for the taking
      Make me king, as we move toward a, new world order
      A normal life is boring; but superstardom's
      close to post-mortem, it only grows harder
      Homie grows hotter, he blows it's all over
      These hoes is all on him, coast to coast shows
      He's known as the Globetrotter
      Lonely roads, God only knows
      He's grown farther from home, he's no father
      He goes home and barely knows his own daughter
      But hold your nose cause here goes the cold water
      These hoes don't want him no mo', he's cold product
      They moved on to the next schmoe who flows
      He nose-dove and sold nada, and so the soap opera
      is told, it unfolds, I suppose it's old partner
      But the beat goes on da-da-dum da-dum da-dah

      [Chorus]

      [Verse 3]
      No more games, Imma change what you call rage
      Tear this motherfuckin roof off like two dogs caged
      I was playin in the beginning, the mood all changed
      I've been chewed up and spit out and booed off stage
      But I kept rhymin and stepped right in the next cypher
      Best believe somebody's payin the pied piper
      All the pain inside amplified by the
      fact that I can't get by with my nine to
      five and I can't provide the right type of
      life for my family, cause man, these God damn
      food stamps don't buy diapers, and there's no movie
      There's no Mekhi Phifer, this is my life
      And these times are so hard, and it's gettin even harder
      Tryin to feed and water my seed plus, teeter-totter
      Caught up between bein a father and a pre-madonna
      Baby momma drama screamin on her too much for me to wanna
      stay in one spot, another day of monotony
      has gotten me to the point, I'm like a snail I've got
      to formulate a plot, or end up in jail or shot
      Success is my only motherfuckin option, failure's not
      Mom I love you but this trailer's got to go
      I cannot grow old in Salem's Lot
      So here I go it's my shot, feet fail me not
      This may be the only opportunity that I got

      [Chorus]

      [Outro]
      You can do anything you set your mind to, man.
      `,
    },
    {
        src: "tracks/track-3.mp3",
        albumArt: "images/album3.jpg",
        trackName: "The Real Slim Shady",
    },
    {
        src: "tracks/track-4.mp3",
        albumArt: "images/album4.jpg",
        trackName: "Yellow",
    },
    {
        src: "tracks/track-5.mp3",
        albumArt: "images/album5.png",
        trackName: "A Sky Full of Stars",
    },
    {
        src: "tracks/track-6.mp3",
        albumArt: "images/album6.jpg",
        trackName: "Still DR. DRE",
    },
    {
        src: "tracks/track-7.mp3",
        albumArt: "images/album7.png",
        trackName: "Rap God",
    },
    {
        src: "tracks/track-8.mp3",
        albumArt: "images/album8.jpg",
        trackName: "Radioactive",
    },
    {
        src: "tracks/track-9.mp3",
        albumArt: "images/album9.jpg",
        trackName: "Ransom",
    },
    {
        src: "tracks/track-10.mp3",
        albumArt: "images/album10.png",
        trackName: "Beat it",
    },
    {
        src: "tracks/track-11.mp3",
        albumArt: "images/album11.jpg",
        trackName: "Snow hey oh",
    },
    {
        src: "tracks/track-12.mp3",
        albumArt: "images/album12.jpg",
        trackName: "By the Way",
    },
    {
        src: "tracks/track-13.mp3",
        albumArt: "images/album13.jpg",
        trackName: "Shape of my Heart",
    },
    {
        src: "tracks/track-14.mp3",
        albumArt: "images/album14.png",
        trackName: "Blinding lights",
    },
    {
        src: "tracks/track-15.mp3",
        albumArt: "images/album15.jpg",
        trackName: "Diamonds",
    },
    {
        src: "tracks/track-16.mp3",
        albumArt: "images/album16.jpg",
        trackName: "Counting stars",
    },
    {
        src: "tracks/track-17.mp3",
        albumArt: "images/album17.jpg",
        trackName: "Wonderwall",
    },
    {
        src: "tracks/track-18.mp3",
        albumArt: "images/album17.jpg",
        trackName: "Don't look back in anger",
    },
    {
        src: "tracks/track-19.mp3",
        albumArt: "images/album19.jpg",
        trackName: "One more light",
    },
    {
        src: "tracks/track-20.mp3",
        albumArt: "images/album20.jpg",
        trackName: "Love me again",
    },
    {
        src: "tracks/track-21.mp3",
        albumArt: "images/album21.jpg",
        trackName: "Shape of you",
    },
    {
        src: "tracks/track-22.mp3",
        albumArt: "images/album22.jpg",
        trackName: "Let me down slowly",
    },
    {
        src: "tracks/track-23.mp3",
        albumArt: "images/album23.jpg",
        trackName: "Mood",
    },
    {
        src: "tracks/track-24.mp3",
        albumArt: "images/album25.jpg",
        trackName: "Crazy Aerosmith",
    },
    {
        src: "tracks/track-25.mp3",
        albumArt: "images/album27.jpg",
        trackName: "Every Breath You Take",
    },
    {
        src: "tracks/track-26.mp3",
        albumArt: "images/album30.jpg",
        trackName: "Waka Waka",
    },
    {
        src: "tracks/track-27.mp3",
        albumArt: "images/album12.jpg",
        trackName: "Can't stop",
    },
    {
        src: "tracks/track-28.mp3",
        albumArt: "images/album31.jpg",
        trackName: "Live Forever",
    },
    {
        src: "tracks/track-29.mp3",
        albumArt: "images/album28.jpg",
        trackName: "Payphone feat Wiz Kalifa",
    },
    {
        src: "tracks/track-30.mp3",
        albumArt: "images/album26.jpg",
        trackName: "Sugar Maroon 5",
    },
    {
        src: "tracks/track-31.mp3",
        albumArt: "images/album24.jpg",
        trackName: "What I,ve Done",
    },
    {
        src: "tracks/track-32.mp3",
        albumArt: "images/album32.jpg",
        trackName: "Emptiness Machine",
    },
    {
        src: "tracks/track-33.mp3",
        albumArt: "images/album29.jpg",
        trackName: "New Devide",
    },
];

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

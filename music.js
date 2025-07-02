document.addEventListener('DOMContentLoaded', () => {

    const playPauseBtn = document.getElementById('play-pause-btn');
    const audio = document.getElementById('audio-source');
    const icon = playPauseBtn.querySelector('i');

    const currentSong = {
        source: "./audio/song.mp3"
    };

    function loadSong(song) {
        audio.src = song.source;
    }
    
    function playSong() {
        audio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }

    function pauseSong() {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }

    loadSong(currentSong);
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }).catch(error => {
            console.log("Autoplay was blocked. User interaction required.");
        });
    }


    playPauseBtn.addEventListener('click', () => {
        const isPlaying = !audio.paused;
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

});
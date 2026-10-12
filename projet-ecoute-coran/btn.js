/* 🎶 Liste des audios */
const audios = [
    "s/001.mp3",
    "s/002.mp3",
    "s/003.mp3",
];

let currentIndex = 0;
let mode = "sequential"; // "sequential" ou "random"

const audioPlayer = document.getElementById("player");

/* 🎧 Éléments du lecteur */
const titleDisplay = document.getElementById("currentTrack");
const progressBar = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const playPauseBtn = document.getElementById("playPause");
const volumeSlider = document.getElementById("volume");

/* 🏷️ Met à jour le titre affiché */
function updateTitle(src) {
    const file = src.split("/").pop().replace(".mp3", "");
    titleDisplay.textContent = "Lecture : " + file;
}

/* ▶️ Lecture d’un index précis */
function playTrack(index) {
    currentIndex = index;
    audioPlayer.src = audios[currentIndex];
    updateTitle(audioPlayer.src);
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
}

/* ▶️ Lecture séquentielle */
function playSequential() {
    mode = "sequential";
    playTrack(currentIndex);

    audioPlayer.onended = () => {
        currentIndex++;
        if (currentIndex >= audios.length) currentIndex = 0;
        playTrack(currentIndex);
    };
}

/* 🔀 Lecture aléatoire */
function playRandom() {
    mode = "random";

    let randomIndex = Math.floor(Math.random() * audios.length);
    playTrack(randomIndex);

    audioPlayer.onended = () => {
        let nextRandom = Math.floor(Math.random() * audios.length);
        playTrack(nextRandom);
    };
}

/* ▶️ Play / Pause */
playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸";
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶️";
    }
});

/* ⏭ Next */
document.getElementById("next").addEventListener("click", () => {
    if (mode === "random") {
        playRandom();
        return;
    }
    currentIndex++;
    if (currentIndex >= audios.length) currentIndex = 0;
    playTrack(currentIndex);
});

/* ⏮ Prev */
document.getElementById("prev").addEventListener("click", () => {
    if (mode === "random") {
        playRandom();
        return;
    }
    currentIndex--;
    if (currentIndex < 0) currentIndex = audios.length - 1;
    playTrack(currentIndex);
});

/* 📊 Mise à jour de la barre de progression */
audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + "%";

        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    }
};

/* 🔊 Volume */
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
});

/* ⏱️ Format mm:ss */
function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

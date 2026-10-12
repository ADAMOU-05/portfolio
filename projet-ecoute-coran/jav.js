// Ce fichier regroupe les fonctions principales du site An•noor.

document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupSearch();
    setupPlayer();
    showToday();
    showVerse();
    setupBackToTop();

    // Affiche le verset quand la page est prête.
    const verseSection = document.querySelector(".coran-section");
    if (verseSection) {
        verseSection.classList.add("visible");
    }
});

// Ouvre et ferme le menu sur téléphone.
function setupMenu() {
    const menuButton = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (!menuButton || !menu) return;

    menuButton.addEventListener("click", function () {
        menu.classList.toggle("active");
        menuButton.classList.toggle("active");
        menuButton.setAttribute("aria-expanded", menu.classList.contains("active"));
        menuButton.setAttribute("aria-label", menu.classList.contains("active") ? "Fermer le menu" : "Ouvrir le menu");
        menuButton.textContent = menu.classList.contains("active") ? "×" : "☰";
    });

    // Ferme le menu après avoir choisi une page.
    menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            menu.classList.remove("active");
            menuButton.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Ouvrir le menu");
            menuButton.textContent = "☰";
        }
    });
}

// Garde seulement les sourates qui correspondent à la recherche.
function setupSearch() {
    const searchInput = document.getElementById("search");
    const sourates = document.querySelectorAll(".sourate");

    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        sourates.forEach(function (sourate) {
            const name = sourate.textContent.toLowerCase();
            sourate.style.display = name.includes(searchText) ? "block" : "none";
        });
    });
}

// Affiche la date du jour.
function showToday() {
    const dateElement = document.getElementById("days");
    if (!dateElement) return;

    dateElement.textContent = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Affiche un verset différent à chaque actualisation de la page.
function showVerse() {
    const arabicText = document.getElementById("verset-ar");
    const frenchText = document.getElementById("verset-fr");
    const reference = document.getElementById("reference");

    if (!arabicText || !frenchText || !reference) return;

    const verses = [
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", french: "Avec la difficulté vient la facilité.", source: "Sourate 94, verset 6" },
        { arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", french: "Allah est la lumière des cieux et de la terre.", source: "Sourate 24, verset 35" },
        { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", french: "Les cœurs trouvent la paix dans le rappel d’Allah.", source: "Sourate 13, verset 28" },
        { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", french: "Allah n’impose à personne une charge supérieure à sa capacité.", source: "Sourate 2, verset 286" }
    ];

    let verseIndex = Math.floor(Math.random() * verses.length);

    // Si le hasard choisit le même verset, on passe au suivant.
    try {
        const previousIndex = localStorage.getItem("lastVerseIndex");

        if (previousIndex !== null && verseIndex === Number(previousIndex)) {
            verseIndex = (verseIndex + 1) % verses.length;
        }

        localStorage.setItem("lastVerseIndex", verseIndex);
    } catch (error) {
        // Le choix aléatoire fonctionne aussi si le navigateur bloque le stockage.
    }

    const verse = verses[verseIndex];

    arabicText.textContent = verse.arabic;
    frenchText.textContent = verse.french;
    reference.textContent = verse.source;
}

// Permet de choisir et de contrôler les récitations.
function setupPlayer() {
    const audio = document.getElementById("player");
    const sourates = document.querySelectorAll(".sourate");
    const title = document.getElementById("currentTrack");
    const playButton = document.getElementById("playPause");
    const nextButton = document.getElementById("next");
    const previousButton = document.getElementById("prev");
    const volumeInput = document.getElementById("volume");
    const progress = document.getElementById("progress");
    const progressContainer = document.querySelector(".progress-container");
    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");

    if (!audio || sourates.length === 0) return;

    let currentIndex = 0;

    function playSourate(index) {
        currentIndex = index;
        const selectedSourate = sourates[currentIndex];
        const name = selectedSourate.querySelector(".title").textContent;

        audio.src = selectedSourate.dataset.src;
        title.textContent = "Lecture : " + name;
        audio.play();
    }

    function playNext() {
        const nextIndex = (currentIndex + 1) % sourates.length;
        playSourate(nextIndex);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
        return minutes + ":" + remainingSeconds;
    }

    // Clique sur une sourate pour la lancer.
    sourates.forEach(function (sourate, index) {
        sourate.addEventListener("click", function () {
            playSourate(index);
        });
    });

    playButton.addEventListener("click", function () {
        if (!audio.src) {
            playSourate(currentIndex);
        } else if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    nextButton.addEventListener("click", playNext);

    previousButton.addEventListener("click", function () {
        const previousIndex = (currentIndex - 1 + sourates.length) % sourates.length;
        playSourate(previousIndex);
    });

    audio.addEventListener("play", function () {
        playButton.textContent = "Ⅱ";
    });

    audio.addEventListener("pause", function () {
        playButton.textContent = "▶";
    });

    audio.addEventListener("ended", playNext);

    if (volumeInput) {
        volumeInput.addEventListener("input", function () {
            audio.volume = volumeInput.value;
        });
    }

    audio.addEventListener("timeupdate", function () {
        if (!audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + "%";
        currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", function () {
        duration.textContent = formatTime(audio.duration);
    });

    if (progressContainer) {
        progressContainer.addEventListener("click", function (event) {
            if (!audio.duration) return;

            const rectangle = progressContainer.getBoundingClientRect();
            const clickPosition = event.clientX - rectangle.left;
            const percent = clickPosition / rectangle.width;
            audio.currentTime = percent * audio.duration;
        });
    }
}

// Remonte en haut de la page avec le bouton flèche.
function setupBackToTop() {
    const button = document.getElementById("scrolltop");
    if (!button) return;

    button.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

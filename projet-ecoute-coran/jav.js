/* =====================================================
🚀 LOADER
===================================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }, 800);

});


/* =====================================================
🚀 INITIALISATION GLOBALE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initMenu();
    initSearch();
    initClock();
    initDates();
    initHijriDate();
    initVerse();
    initPlayer();
    initScrollTop();
    initWeather();
    initScrollAnimation();
    initFestivalsCountdown();
    initCardEffects();
    initStars();

});


/* =====================================================
📱 MENU HAMBURGER
===================================================== */

function initMenu() {

    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (!hamburger || !menu) return;

    hamburger.addEventListener("click", (e) => {

        e.stopPropagation();

        hamburger.classList.toggle("active");
        menu.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {

        if (!menu.contains(e.target) && !hamburger.contains(e.target)) {

            menu.classList.remove("active");
            hamburger.classList.remove("active");

        }

    });

}


/* =====================================================
🔎 RECHERCHE SOURATE
===================================================== */

function initSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    const sourates = document.querySelectorAll(".sourate");

    search.addEventListener("input", () => {

        const value = search.value.toLowerCase();

        sourates.forEach(s => {

            const text = s.innerText.toLowerCase();

            s.style.display = text.includes(value) ? "block" : "none";

        });

    });

}


/* =====================================================
📅 DATE FR
===================================================== */

function initDates() {

    const el = document.getElementById("days");
    if (!el) return;

    const date = new Date();

    el.textContent = "Aujourd'hui nous sommes : " + date.toLocaleDateString("fr-FR", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

}


function initHijriDate() {

    const el = document.getElementById("date-hijr");
    if (!el) return;

    const today = new Date();

    const formatter = new Intl.DateTimeFormat("fr-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    let hijri = formatter.format(today).replace(" AH", "");

    el.textContent = "Aujourdh'ui nous sommes le:" +
        hijri;
}


/* =====================================================
🕒 HORLOGE
===================================================== */

function initClock() {

    const el = document.getElementById("clock");

    if (!el) return;

    function update() {

        el.textContent = "Heure : " + new Date().toLocaleTimeString("fr-FR");

    }

    update();

    setInterval(update, 1000);

}


/* =====================================================
📖 VERSET DU JOUR
===================================================== */

function initVerse() {

    const versets = [

        { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", fr: "Avec la difficulté vient la facilité.", ref: "94:6" },
        { ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", fr: "Allah est la lumière des cieux et de la terre.", ref: "24:35" },
        { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", fr: "Les cœurs se tranquillisent par le rappel d’Allah.", ref: "13:28" },
        { ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", fr: "Allah n'impose rien au-delà de la capacité.", ref: "2:286" }

    ];

    const index = new Date().getDate() % versets.length;

    const v = versets[index];

    document.getElementById("verset-ar").textContent = v.ar;
    document.getElementById("verset-fr").textContent = v.fr;
    document.getElementById("reference").textContent = v.ref;

}


/* =====================================================
🎧 PLAYER CORAN (VERSION OPTIMISÉE)
===================================================== */

function initPlayer() {

    const player = document.getElementById("player");
    if (!player) return;

    const title = document.getElementById("currentTrack");
    const playBtn = document.getElementById("playPause");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");

    const volume = document.getElementById("volume");

    const progress = document.getElementById("progress");
    const progressContainer = document.querySelector(".progress-container");

    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");

    const sourates = [...document.querySelectorAll(".sourate")];

    let index = 0;
    let playlist = [];

    /* création playlist */

    sourates.forEach((s, i) => {

        playlist.push({
            src: s.dataset.src,
            title: s.querySelector(".title").textContent
        });

        /* click sourate */

        s.addEventListener("click", () => {

            index = i;
            loadTrack();
            play();

        });

    });


    /* charger sourate */

    function loadTrack() {

        player.src = playlist[index].src;

        if (title) {

            title.textContent = "Lecture : " + playlist[index].title;

        }

        localStorage.setItem("lastSourate", index);

    }


    /* play */

    function play() {

        player.play();
        playBtn.textContent = "⏸";

    }


    

    /* next */

    nextBtn.addEventListener("click", () => {

        index++;

        if (index >= playlist.length) {

            index = 0;

        }

        loadTrack();
        play();

    });


    /* prev */

    prevBtn.addEventListener("click", () => {

        index--;

        if (index < 0) {

            index = playlist.length - 1;

        }

        loadTrack();
        play();

    });


    /* lecture auto suivante */

    player.addEventListener("ended", () => {

        nextBtn.click();

    });


    /* volume */

    if (volume) {

        volume.addEventListener("input", () => {

            player.volume = volume.value;

        });

    }


    /* progress */

    player.addEventListener("timeupdate", () => {

        if (!player.duration) return;

        const percent = (player.currentTime / player.duration) * 100;

        if (progress) {

            progress.style.width = percent + "%";

        }

        if (currentTimeEl) {

            currentTimeEl.textContent = formatTime(player.currentTime);

        }

    });


    player.addEventListener("loadedmetadata", () => {

        if (durationEl) {

            durationEl.textContent = formatTime(player.duration);

        }

    });


    /* click barre */

    if (progressContainer) {

        progressContainer.addEventListener("click", (e) => {

            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;

            player.currentTime = (clickX / width) * player.duration;

        });

    }


    /* format temps */

    function formatTime(seconds) {

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return min + ":" + (sec < 10 ? "0" + sec : sec);

    }


    /* mémoire dernière sourate */

    const saved = localStorage.getItem("lastSourate");

    if (saved) {

        index = parseInt(saved);
        loadTrack();

    }

}


/* =====================================================
⬆️ SCROLL TOP
===================================================== */

function initScrollTop() {

    const btn = document.getElementById("scrolltop");

    if (!btn) return;

    window.addEventListener("scroll", () => {

        btn.style.display = window.scrollY > 300 ? "block" : "none";

    });

    btn.addEventListener("click", (e) => {

        e.preventDefault();

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}


/* =====================================================
🌤 METEO
===================================================== */

async function initWeather() {

    const apiKey = "a1e79e7d5aaf6620f2817358b3f463b6";
    const city = "Vendôme";

    const url = `
    https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°";

        document.getElementById("description").textContent = data.weather[0].description;

        document.getElementById("ville").textContent = data.name;

    } catch (e) {

        console.log("Erreur météo :", e);

}

}


/* =====================================================
🎉 COMPTE A REBOURS FETES ISLAMIQUES
===================================================== */

function initFestivalsCountdown() {

    const ramadan = new Date("2027-02-18");
    const fitr = new Date("2027-03-19");
    const adha = new Date("2026-05-26");

    function update(target, id, name, emoji) {

        const el = document.getElementById(id);
        if (!el) return;

        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {

            el.textContent = `${emoji} ${name} Mubarak !`;
            return;

        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff % 86400000 / 3600000);
        const m = Math.floor(diff % 3600000 / 60000);
        const s = Math.floor(diff % 60000 / 1000);

        el.textContent = `${name} : ${d}j ${h}h ${m}m ${s}s`;

    }

    setInterval(() => {

        update(ramadan, "ramadan-countdown", "Ramadan", "🌙");
        update(fitr, "aid-al-fitr-countdown", "Aid al-Fitr", "🎉");
        update(adha, "aid-al-adha-countdown", "Aid al-Adha", "🐑");

    }, 1000);

}


/* =====================================================
✨ ANIMATION SCROLL
===================================================== */

function initScrollAnimation() {

    const elements = document.querySelectorAll(".sourate");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));

}


/* =====================================================
✨ EFFET CARTE 3D
===================================================== */

function initCardEffects() {

    document.querySelectorAll(".sourate").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -(y - centerY) / 12;
            const rotateY = (x - centerX) / 12;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "rotateX(0) rotateY(0) scale(1)";

        });

    });

}


/* =====================================================
⭐ BACKGROUND ETOILES
===================================================== */

function initStars() {

    const stars = document.createElement("div");

    stars.classList.add("stars-dynamic");

    document.body.appendChild(stars);

    for (let i = 0; i < 80; i++) {

        let star = document.createElement("div");

        star.classList.add("star");

        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";

        star.style.animationDelay = Math.random() * 5 + "s";

        stars.appendChild(star);

    }

}
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.coran-section').forEach(el => el.classList.add('visible'));
});
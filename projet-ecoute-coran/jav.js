/* =========================================================
   AN•NOOR — JavaScript principal
   Menu • Recherche • Date • Versets • Audio • Récitateurs
   ========================================================= */

const QURAN_API = "https://api.alquran.cloud/v1";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupSearch();
  setupPlayer();
  setupReciters();
  showToday();
  showVerse();
  setupBackToTop();

  const verseSection = document.querySelector(".coran-section");
  if (verseSection) verseSection.classList.add("visible");
});

/* =========================================================
   MENU MOBILE
   ========================================================= */

function setupMenu() {
  const button = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if (!button || !menu) return;

  function closeMenu() {
    menu.classList.remove("active");
    button.classList.remove("active");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Ouvrir le menu");
    button.textContent = "☰";
  }

  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Ouvrir le menu");

  button.addEventListener("click", () => {
    const open = !menu.classList.contains("active");

    menu.classList.toggle("active", open);
    button.classList.toggle("active", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu"
    );
    button.textContent = open ? "×" : "☰";
  });

  menu.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

/* =========================================================
   RECHERCHE DES SOURATES
   Fonctionne avec les cartes dynamiques.
   ========================================================= */

function normalizeText(text) {
  return String(text || "")
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function setupSearch() {
  const input = document.getElementById("search");
  const noResults = document.getElementById("no-results");

  if (!input) return;

  function filterSourates() {
    const query = normalizeText(input.value);
    const sourates = document.querySelectorAll(".sourate");
    let visibleCount = 0;

    sourates.forEach(sourate => {
      const matches = normalizeText(sourate.textContent).includes(query);

      sourate.hidden = !matches;
      if (matches) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
  }

  input.addEventListener("input", filterSourates);
  filterSourates();

  const list = document.getElementById("list");

  if (list && "MutationObserver" in window) {
    const observer = new MutationObserver(filterSourates);
    observer.observe(list, { childList: true, subtree: true });
  }
}

/* =========================================================
   DATE DU JOUR
   ========================================================= */

function showToday() {
  const element = document.getElementById("days");
  if (!element) return;

  element.textContent = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* =========================================================
   VERSETS DU CORAN
   ========================================================= */

let versetsAnNoor = [];
let dernierVersetIndex = -1;
let chargementVersetsPromise = null;

async function charger100Versets() {
  const [arabicResponse, frenchResponse] = await Promise.all([
    fetch(`${QURAN_API}/quran/quran-uthmani`),
    fetch(`${QURAN_API}/quran/fr.hamidullah`)
  ]);

  if (!arabicResponse.ok || !frenchResponse.ok) {
    throw new Error("Impossible de contacter la source coranique.");
  }

  const [arabicData, frenchData] = await Promise.all([
    arabicResponse.json(),
    frenchResponse.json()
  ]);

  if (
    arabicData.code !== 200 ||
    frenchData.code !== 200 ||
    !Array.isArray(arabicData.data?.surahs) ||
    !Array.isArray(frenchData.data?.surahs)
  ) {
    throw new Error("Les données coraniques reçues sont invalides.");
  }

  function flattenSurahs(data) {
    return data.surahs.flatMap(surah =>
      surah.ayahs.map(ayah => ({
        ...ayah,
        surahNumber: surah.number
      }))
    );
  }

  const arabicAyahs = flattenSurahs(arabicData.data);
  const frenchAyahs = flattenSurahs(frenchData.data);

  if (
    arabicAyahs.length === 0 ||
    arabicAyahs.length !== frenchAyahs.length
  ) {
    throw new Error("Les éditions arabe et française ne correspondent pas.");
  }

  const verses = [];
  const total = arabicAyahs.length;

  // Sélection de 100 versets répartis dans le Coran.
  for (let i = 0; i < 100; i++) {
    const index = Math.round(i * (total - 1) / 99);
    const ar = arabicAyahs[index];
    const fr = frenchAyahs[index];

    if (
      !ar ||
      !fr ||
      ar.number !== fr.number ||
      ar.surahNumber !== fr.surahNumber ||
      ar.numberInSurah !== fr.numberInSurah ||
      !ar.text ||
      !fr.text
    ) {
      throw new Error(
        `Vérification échouée pour le verset sélectionné ${i + 1}.`
      );
    }

    verses.push({
      arabic: ar.text,
      french: fr.text,
      source: `Sourate ${ar.surahNumber}, verset ${ar.numberInSurah}`
    });
  }

  return verses;
}

async function getVersetsAnNoor() {
  if (versetsAnNoor.length === 100) return versetsAnNoor;

  if (!chargementVersetsPromise) {
    chargementVersetsPromise = charger100Versets()
      .then(verses => {
        versetsAnNoor = verses;
        return verses;
      })
      .finally(() => {
        chargementVersetsPromise = null;
      });
  }

  return chargementVersetsPromise;
}

async function showVerse() {
  const arabicText = document.getElementById("verset-ar");
  const frenchText = document.getElementById("verset-fr");
  const reference = document.getElementById("reference");

  if (!arabicText || !frenchText || !reference) return;

  arabicText.textContent = "جاري التحميل…";
  frenchText.textContent = "Chargement du verset…";
  reference.textContent = "";

  try {
    const verses = await getVersetsAnNoor();

    if (!verses.length) {
      throw new Error("Aucun verset disponible.");
    }

    let index = Math.floor(Math.random() * verses.length);

    if (verses.length > 1 && index === dernierVersetIndex) {
      index = (index + 1) % verses.length;
    }

    dernierVersetIndex = index;

    const verse = verses[index];

    arabicText.textContent = verse.arabic;
    frenchText.textContent = verse.french;
    reference.textContent = verse.source;
  } catch (error) {
    console.error("An•noor — erreur de chargement des versets :", error);

    arabicText.textContent = "";
    frenchText.textContent =
      "Le verset n’a pas pu être chargé. Vérifie ta connexion et réessaie.";
    reference.textContent = "";
  }
}

/* =========================================================
   LECTEUR AUDIO
   Sourates dynamiques • Lecture • Pause • Suivant • Précédent
   Progression • Volume facultatif • Récitateurs
   ========================================================= */

function setupPlayer() {
  const audio = document.getElementById("player");
  const title = document.getElementById("currentTrack");
  const playButton = document.getElementById("playPause");
  const nextButton = document.getElementById("next");
  const previousButton = document.getElementById("prev");
  const volumeInput = document.getElementById("volume");
  const progress = document.getElementById("progress");
  const progressContainer = document.querySelector(".progress-container");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const reciterSelect = document.getElementById("reciter");

  if (!audio) {
    console.error("An•noor : élément audio #player introuvable.");
    return;
  }

  let currentIndex = 0;
  let audioQueue = [];
  let queueIndex = 0;
  let requestNumber = 0;
  let currentSurahName = "";

  audio.preload = "metadata";

  if (volumeInput) {
    const initialVolume = Number(volumeInput.value);

    audio.volume = Number.isFinite(initialVolume)
      ? Math.min(1, Math.max(0, initialVolume))
      : 1;
  }

  function getSourates() {
    return Array.from(document.querySelectorAll(".sourate"));
  }

  function setTitle(message) {
    if (title) title.textContent = message;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secondsLeft}`;
  }

  function markSelectedSourate() {
    const sourates = getSourates();

    sourates.forEach(sourate => {
      const number = Number(sourate.dataset.number);
      sourate.classList.toggle(
        "is-playing",
        number === currentIndex + 1
      );
    });
  }

  async function playCurrentAyah() {
    const audioUrl = audioQueue[queueIndex];
    if (!audioUrl) return;

    audio.src = audioUrl;
    audio.load();

    try {
      await audio.play();
    } catch (error) {
      setTitle("Appuie sur lecture pour démarrer l’audio.");
      console.warn("An•noor : lecture audio impossible.", error);
    }
  }

  async function playSourate(index, shouldPlay = true) {
  const sourates = getSourates();

  if (index < 0 || index >= sourates.length) return;

  currentIndex = index;

  const sourate = sourates[index];
  const titleElement = sourate.querySelector(".title");
  const numero = Number(sourate.dataset.number || index + 1);

  currentSurahName = titleElement
    ? titleElement.textContent.trim()
    : `Sourate ${numero}`;

  let recitation;

  try {
    recitation = JSON.parse(reciterSelect.value);
  } catch {
    setTitle("Chargement des récitateurs en cours...");
    return;
  }

  const souratesDisponibles = recitation.surahList
    .split(",")
    .map(numero => numero.trim());

  if (!souratesDisponibles.includes(String(numero))) {
    setTitle("Cette sourate n'est pas disponible pour ce récitant.");
    return;
  }

  audio.pause();

  const serveur = recitation.server.endsWith("/")
    ? recitation.server
    : recitation.server + "/";

  audioQueue = [
    serveur + String(numero).padStart(3, "0") + ".mp3"
  ];

  queueIndex = 0;

  markSelectedSourate();
  setTitle(`Lecture : ${currentSurahName}`);

  if (shouldPlay) {
    await playCurrentAyah();
  } else {
    audio.src = audioQueue[0];
    audio.load();
  }
}

  function playNext() {
    const sourates = getSourates();

    if (sourates.length === 0) return;

    const nextIndex = (currentIndex + 1) % sourates.length;
    playSourate(nextIndex);
  }

  // Délégation d'événement : les cartes peuvent être créées
  // avant ou après l'initialisation du lecteur.
  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const sourate = target.closest(".sourate");
    if (!sourate) return;

    // Ne lance pas la récitation si un contrôle interne est cliqué.
    if (target.closest("a, input, select, textarea, [data-no-play]")) {
      return;
    }

    const sourates = getSourates();
    const index = sourates.indexOf(sourate);

    if (index !== -1) playSourate(index);
  });

  // Lecture / pause
  if (playButton) {
    playButton.addEventListener("click", async () => {
      if (!audioQueue.length) {
        await playSourate(currentIndex);
      } else if (audio.paused) {
        try {
          await audio.play();
        } catch (error) {
          setTitle("Lecture impossible. Réessaie.");
        }
      } else {
        audio.pause();
      }
    });
  }

  // Sourate suivante
  if (nextButton) {
    nextButton.addEventListener("click", playNext);
  }

  // Sourate précédente
  if (previousButton) {
    previousButton.addEventListener("click", () => {
      const sourates = getSourates();

      if (sourates.length === 0) return;

      const previousIndex =
        (currentIndex - 1 + sourates.length) % sourates.length;

      playSourate(previousIndex);
    });
  }

  // Icône lecture
  audio.addEventListener("play", () => {
    if (playButton) playButton.textContent = "Ⅱ";
  });

  // Icône pause
  audio.addEventListener("pause", () => {
    if (playButton) playButton.textContent = "▶";
  });

  // Verset suivant, puis sourate suivante à la fin de la récitation
  audio.addEventListener("ended", () => {
    if (queueIndex < audioQueue.length - 1) {
      queueIndex++;
      playCurrentAyah();
    } else if (audioQueue.length > 0) {
      playNext();
    }
  });

  audio.addEventListener("error", () => {
    if (audioQueue.length > 0) {
      setTitle("Erreur de lecture audio.");
    }
  });

  // Changement de récitant
  if (reciterSelect) {
    reciterSelect.addEventListener("change", () => {
      if (audioQueue.length === 0) return;

      playSourate(currentIndex, !audio.paused);
    });
  }

  // Volume : ce contrôle est facultatif dans le HTML.
  if (volumeInput) {
    volumeInput.addEventListener("input", () => {
      const value = Number(volumeInput.value);

      if (Number.isFinite(value)) {
        audio.volume = Math.min(1, Math.max(0, value));
      }
    });
  }

  // Barre de progression et temps écoulé
  audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const percent = (audio.currentTime / audio.duration) * 100;

    if (progress) {
      progress.style.width = `${percent}%`;
    }

    if (progressContainer) {
      progressContainer.setAttribute(
        "aria-valuenow",
        String(Math.round(percent))
      );
    }

    if (currentTime) {
      currentTime.textContent = formatTime(audio.currentTime);
    }
  });

  // Durée totale
  audio.addEventListener("loadedmetadata", () => {
    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }
  });

  // Cliquer sur la barre pour avancer ou reculer
  if (progressContainer) {
    progressContainer.addEventListener("click", event => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

      const rectangle = progressContainer.getBoundingClientRect();
      if (rectangle.width <= 0) return;

      const position = (event.clientX - rectangle.left) / rectangle.width;
      const percent = Math.min(1, Math.max(0, position));

      audio.currentTime = percent * audio.duration;
    });

    // Flèches gauche/droite : déplacement de 5 secondes
    progressContainer.addEventListener("keydown", event => {
      if (
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0 ||
        !["ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      const change = event.key === "ArrowRight" ? 5 : -5;

      audio.currentTime = Math.min(
        audio.duration,
        Math.max(0, audio.currentTime + change)
      );
    });
  }
}

js
async function setupReciters() {
  const select = document.getElementById("reciter");
  const search = document.getElementById("search-reciter");

  if (!select) return;

  try {
    const response = await fetch(
      "https://www.mp3quran.net/api/v3/reciters?language=fr"
    );

    const data = await response.json();
    select.innerHTML = "";

    data.reciters.forEach(reciter => {
      reciter.moshaf.forEach(moshaf => {
        if (!moshaf.server || !moshaf.surah_list) return;

        const option = document.createElement("option");

        option.value = JSON.stringify({
          server: moshaf.server,
          surahList: moshaf.surah_list
        });

        option.textContent = `${reciter.name} — ${moshaf.name}`;
        select.appendChild(option);
      });
    });

    if (search) {
      search.addEventListener("input", () => {
        const recherche = search.value.toLowerCase();

        Array.from(select.options).forEach(option => {
          option.hidden = !option.textContent
            .toLowerCase()
            .includes(recherche);
        });

        const premier = Array.from(select.options)
          .find(option => !option.hidden);

        if (premier) select.value = premier.value;
      });
    }
  } catch (error) {
    console.error("Erreur de chargement des récitateurs :", error);
  }
}

/* =========================================================
   RETOUR EN HAUT DE PAGE
   ========================================================= */

function setupBackToTop() {
  const button = document.getElementById("scrolltop");
  if (!button) return;

  button.addEventListener("click", event => {
    if (button.tagName === "A") event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
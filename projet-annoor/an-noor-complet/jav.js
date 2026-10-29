/* ==========================================================================
   AN•NOOR — DIGITAL QURAN EXPERIENCE
   Architecture : élégance, clarté et fiabilité
   --------------------------------------------------------------------------
   Menu • Recherche • Date • Verset du jour
   Sourates • Lecteur audio • Récitateurs
   Favoris • Playlists • Bibliothèque personnelle

   Principes :
   - Une seule source de vérité pour la bibliothèque.
   - Une seule délégation des clics sur les sourates.
   - Aucun rendu inutile lors d'un clic sur un favori.
   - Une file de lecture cohérente pour les playlists.
   - Des erreurs contrôlées et des éléments accessibles.
   - Compatibilité avec les identifiants HTML existants.
   ========================================================================== */

(() => {
  "use strict";

  /* ==========================================================================
     01 — CONFIGURATION
     ========================================================================== */

  const CONFIG = Object.freeze({
    quranApi: "https://api.alquran.cloud/v1",
    recitersApi: "https://www.mp3quran.net/api/v3/reciters?language=fr",
    storageKey: "anNoorBibliothequeV1",
    searchDelay: 120,
    verseSampleSize: 100
  });

  const SOURATES = [
    ["Al-Fatiha", "الفاتحة"],
    ["Al-Baqara", "البقرة"],
    ["Al-Imran", "آل عمران"],
    ["An-Nisa", "النساء"],
    ["Al-Ma'ida", "المائدة"],
    ["Al-An'am", "الأنعام"],
    ["Al-A'raf", "الأعراف"],
    ["Al-Anfal", "الأنفال"],
    ["At-Tawba", "التوبة"],
    ["Yunus", "يونس"],
    ["Hud", "هود"],
    ["Yusuf", "يوسف"],
    ["Ar-Ra'd", "الرعد"],
    ["Ibrahim", "إبراهيم"],
    ["Al-Hijr", "الحجر"],
    ["An-Nahl", "النحل"],
    ["Al-Isra", "الإسراء"],
    ["Al-Kahf", "الكهف"],
    ["Maryam", "مريم"],
    ["Ta-Ha", "طه"],
    ["Al-Anbiya", "الأنبياء"],
    ["Al-Hajj", "الحج"],
    ["Al-Mu'minun", "المؤمنون"],
    ["An-Nur", "النور"],
    ["Al-Furqan", "الفرقان"],
    ["Ash-Shu'ara", "الشعراء"],
    ["An-Naml", "النمل"],
    ["Al-Qasas", "القصص"],
    ["Al-Ankabut", "العنكبوت"],
    ["Ar-Rum", "الروم"],
    ["Luqman", "لقمان"],
    ["As-Sajda", "السجدة"],
    ["Al-Ahzab", "الأحزاب"],
    ["Saba", "سبأ"],
    ["Fatir", "فاطر"],
    ["Ya-Sin", "يس"],
    ["As-Saffat", "الصافات"],
    ["Sad", "ص"],
    ["Az-Zumar", "الزمر"],
    ["Ghafir", "غافر"],
    ["Fussilat", "فصلت"],
    ["Ash-Shura", "الشورى"],
    ["Az-Zukhruf", "الزخرف"],
    ["Ad-Dukhan", "الدخان"],
    ["Al-Jathiya", "الجاثية"],
    ["Al-Ahqaf", "الأحقاف"],
    ["Muhammad", "محمد"],
    ["Al-Fath", "الفتح"],
    ["Al-Hujurat", "الحجرات"],
    ["Qaf", "ق"],
    ["Adh-Dhariyat", "الذاريات"],
    ["At-Tur", "الطور"],
    ["An-Najm", "النجم"],
    ["Al-Qamar", "القمر"],
    ["Ar-Rahman", "الرحمن"],
    ["Al-Waqi'a", "الواقعة"],
    ["Al-Hadid", "الحديد"],
    ["Al-Mujadila", "المجادلة"],
    ["Al-Hashr", "الحشر"],
    ["Al-Mumtahana", "الممتحنة"],
    ["As-Saff", "الصف"],
    ["Al-Jumu'a", "الجمعة"],
    ["Al-Munafiqun", "المنافقون"],
    ["At-Taghabun", "التغابن"],
    ["At-Talaq", "الطلاق"],
    ["At-Tahrim", "التحريم"],
    ["Al-Mulk", "الملك"],
    ["Al-Qalam", "القلم"],
    ["Al-Haqqa", "الحاقة"],
    ["Al-Ma'arij", "المعارج"],
    ["Nuh", "نوح"],
    ["Al-Jinn", "الجن"],
    ["Al-Muzzammil", "المزمل"],
    ["Al-Muddaththir", "المدثر"],
    ["Al-Qiyama", "القيامة"],
    ["Al-Insan", "الإنسان"],
    ["Al-Mursalat", "المرسلات"],
    ["An-Naba", "النبأ"],
    ["An-Nazi'at", "النازعات"],
    ["Abasa", "عبس"],
    ["At-Takwir", "التكوير"],
    ["Al-Infitar", "الانفطار"],
    ["Al-Mutaffifin", "المطففين"],
    ["Al-Inshiqaq", "الانشقاق"],
    ["Al-Buruj", "البروج"],
    ["At-Tariq", "الطارق"],
    ["Al-A'la", "الأعلى"],
    ["Al-Ghashiya", "الغاشية"],
    ["Al-Fajr", "الفجر"],
    ["Al-Balad", "البلد"],
    ["Ash-Shams", "الشمس"],
    ["Al-Layl", "الليل"],
    ["Ad-Duha", "الضحى"],
    ["Ash-Sharh", "الشرح"],
    ["At-Tin", "التين"],
    ["Al-Alaq", "العلق"],
    ["Al-Qadr", "القدر"],
    ["Al-Bayyina", "البينة"],
    ["Az-Zalzala", "الزلزلة"],
    ["Al-Adiyat", "العاديات"],
    ["Al-Qari'a", "القارعة"],
    ["At-Takathur", "التكاثر"],
    ["Al-Asr", "العصر"],
    ["Al-Humaza", "الهمزة"],
    ["Al-Fil", "الفيل"],
    ["Quraysh", "قريش"],
    ["Al-Ma'un", "الماعون"],
    ["Al-Kawthar", "الكوثر"],
    ["Al-Kafirun", "الكافرون"],
    ["An-Nasr", "النصر"],
    ["Al-Masad", "المسد"],
    ["Al-Ikhlas", "الإخلاص"],
    ["Al-Falaq", "الفلق"],
    ["An-Nas", "الناس"],
  ];

  /* ==========================================================================
     02 — ÉTAT CENTRAL
     ========================================================================== */

  const dom = new Map();

  function getElement(id) {
    if (!dom.has(id)) {
      dom.set(id, document.getElementById(id));
    }

    const element = dom.get(id);

    // Permet de retrouver un élément créé ultérieurement.
    if (!element?.isConnected) {
      const refreshed = document.getElementById(id);
      dom.set(id, refreshed);
      return refreshed;
    }

    return element;
  }

  function readLibrary() {
    const emptyLibrary = {
      surahs: [],
      reciters: [],
      playlists: []
    };

    try {
      const saved = JSON.parse(
        localStorage.getItem(CONFIG.storageKey) || "null"
      );

      if (!saved || typeof saved !== "object") {
        return emptyLibrary;
      }

      return {
        surahs: Array.isArray(saved.surahs)
          ? [...new Set(saved.surahs.map(Number).filter(isValidSurah))]
          : [],

        reciters: Array.isArray(saved.reciters)
          ? saved.reciters.filter(item =>
              item &&
              typeof item.key === "string" &&
              typeof item.name === "string"
            )
          : [],

        playlists: Array.isArray(saved.playlists)
          ? saved.playlists
              .filter(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Array.isArray(item.surahs)
              )
              .map(item => ({
                id: item.id,
                name: item.name,
                surahs: [...new Set(
                  item.surahs.map(Number).filter(isValidSurah)
                )]
              }))
          : []
      };
    } catch (error) {
      console.warn("An•Noor : bibliothèque illisible.", error);
      return emptyLibrary;
    }
  }

  let library = readLibrary();

  const state = {
    currentSurah: 1,
    currentRecitation: null,
    queue: null,
    queueIndex: 0,
    verseIndex: -1,
    verses: null,
    versesPromise: null,
    reciters: [],
    recitersLoaded: false,
    searchTimer: null,
    audioRequest: 0
  };

  function isValidSurah(number) {
    return Number.isInteger(number) &&
      number >= 1 &&
      number <= SOURATES.length;
  }

  function getSurahName(number) {
    return SOURATES[Number(number) - 1]?.[0] ||
      `Sourate ${number}`;
  }

  function getSurahArabic(number) {
    return SOURATES[Number(number) - 1]?.[1] || "";
  }

  function normalizeText(value) {
    return String(value ?? "")
      .toLocaleLowerCase("fr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function showMessage(message) {
    console.info(`An•Noor : ${message}`);
  }

  function reportError(message, error) {
    console.error(`An•Noor : ${message}`, error);
  }

  /* ==========================================================================
     03 — BIBLIOTHÈQUE : SAUVEGARDE CENTRALISÉE
     ========================================================================== */

  let renderLibrary = () => {};

  function saveLibrary() {
    try {
      localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(library)
      );
    } catch (error) {
      reportError("impossible de sauvegarder la bibliothèque.", error);
      alert(
        "La bibliothèque n'a pas pu être enregistrée sur cet appareil. " +
        "Vérifie l'espace disponible et les paramètres du navigateur."
      );
      return false;
    }

    renderLibrary();
    updateAllFavoriteButtons();

    return true;
  }

  /* ==========================================================================
     04 — MENU
     ========================================================================== */

  function setupMenu() {
    const button = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (!button || !menu) return;

    const setMenuState = open => {
      menu.classList.toggle("active", open);
      button.classList.toggle("active", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu"
      );
      button.textContent = open ? "×" : "☰";
    };

    setMenuState(false);

    button.addEventListener("click", () => {
      setMenuState(!menu.classList.contains("active"));
    });

    menu.addEventListener("click", event => {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setMenuState(false);
    });

    document.addEventListener("click", event => {
      if (
        menu.classList.contains("active") &&
        !menu.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setMenuState(false);
      }
    });
  }

  /* ==========================================================================
     05 — RECHERCHE
     ========================================================================== */

  function filterSourates() {
    const input = getElement("search");
    const noResults = getElement("no-results");

    if (!input) return;

    const query = normalizeText(input.value);
    const cards = document.querySelectorAll("#list .sourate");

    let visibleCount = 0;

    cards.forEach(card => {
      const matches = normalizeText(card.textContent).includes(query);

      card.hidden = !matches;

      if (matches) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount > 0;
    }
  }

  function setupSearch() {
    const input = getElement("search");
    if (!input) return;

    input.addEventListener("input", () => {
      clearTimeout(state.searchTimer);

      state.searchTimer = setTimeout(
        filterSourates,
        CONFIG.searchDelay
      );
    });

    filterSourates();
  }

  /* ==========================================================================
     06 — DATE DU JOUR
     ========================================================================== */

  function showToday() {
    const element = getElement("days");
    if (!element) return;

    element.textContent = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }

  /* ==========================================================================
     07 — VERSET DU JOUR
     ========================================================================== */

  async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    return response.json();
  }

  async function loadVerses() {
    const [arabicData, frenchData] = await Promise.all([
      fetchJson(`${CONFIG.quranApi}/quran/quran-uthmani`),
      fetchJson(`${CONFIG.quranApi}/quran/fr.hamidullah`)
    ]);

    if (arabicData.code !== 200 || frenchData.code !== 200) {
      throw new Error("Les données coraniques ne sont pas disponibles.");
    }

    const flatten = data =>
      data.data.surahs.flatMap(surah =>
        surah.ayahs.map(ayah => ({
          number: ayah.number,
          surahNumber: surah.number,
          verseNumber: ayah.numberInSurah,
          text: ayah.text
        }))
      );

    const arabicAyahs = flatten(arabicData);
    const frenchAyahs = flatten(frenchData);

    if (
      !arabicAyahs.length ||
      arabicAyahs.length !== frenchAyahs.length
    ) {
      throw new Error("Les éditions arabe et française ne correspondent pas.");
    }

    const verses = [];
    const sampleSize = Math.min(
      CONFIG.verseSampleSize,
      arabicAyahs.length
    );

    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(
        (i * arabicAyahs.length) / sampleSize
      );

      const arabic = arabicAyahs[index];
      const french = frenchAyahs[index];

      if (
        !arabic ||
        !french ||
        arabic.number !== french.number ||
        arabic.surahNumber !== french.surahNumber ||
        arabic.verseNumber !== french.verseNumber ||
        !arabic.text ||
        !french.text
      ) {
        throw new Error("La vérification d'un verset a échoué.");
      }

      verses.push({
        arabic: arabic.text,
        french: french.text,
        reference:
          `Sourate ${arabic.surahNumber}, verset ${arabic.verseNumber}`
      });
    }

    return verses;
  }

  async function getVerses() {
    if (state.verses) return state.verses;

    if (!state.versesPromise) {
      state.versesPromise = loadVerses()
        .then(verses => {
          state.verses = verses;
          return verses;
        })
        .finally(() => {
          state.versesPromise = null;
        });
    }

    return state.versesPromise;
  }

  async function showVerse() {
    const arabicElement = getElement("verset-ar");
    const frenchElement = getElement("verset-fr");
    const referenceElement = getElement("reference");

    if (!arabicElement || !frenchElement || !referenceElement) return;

    arabicElement.textContent = "جاري التحميل…";
    frenchElement.textContent = "Chargement du verset…";
    referenceElement.textContent = "";

    try {
      const verses = await getVerses();

      if (!verses.length) {
        throw new Error("Aucun verset disponible.");
      }

      let index = Math.floor(Math.random() * verses.length);

      if (verses.length > 1 && index === state.verseIndex) {
        index = (index + 1) % verses.length;
      }

      state.verseIndex = index;

      const verse = verses[index];

      arabicElement.textContent = verse.arabic;
      frenchElement.textContent = verse.french;
      referenceElement.textContent = verse.reference;
    } catch (error) {
      reportError("chargement du verset impossible.", error);

      arabicElement.textContent = "";
      frenchElement.textContent =
        "Le verset n'a pas pu être chargé. Vérifie ta connexion.";
      referenceElement.textContent = "";
    }
  }

  /* ==========================================================================
     08 — SOURATES : CRÉATION ET AFFICHAGE
     ========================================================================== */

  function createSurahCard(surah, index) {
    const [name, arabic] = surah;
    const number = index + 1;

    const card = createElement("article", "sourate");
    card.dataset.number = String(number);

    const textContainer = createElement("div", "sourate-text");

    const title = createElement(
      "span",
      "title",
      `${String(number).padStart(3, "0")}. ${name}`
    );

    const arabicName = createElement(
      "span",
      "sourate-arabic",
      arabic
    );

    arabicName.lang = "ar";
    arabicName.dir = "rtl";

    textContainer.append(title, arabicName);

    const actions = createElement("div", "sourate-actions");

    const playButton = createElement(
      "button",
      "sourate-play",
      "▶"
    );

    playButton.type = "button";
    playButton.setAttribute("aria-label", `Écouter ${name}`);
    playButton.title = `Écouter ${name}`;

    const favoriteButton = createElement(
      "button",
      "favorite-surah"
    );

    favoriteButton.type = "button";
    favoriteButton.dataset.noPlay = "";
    favoriteButton.dataset.id = String(number);

    const playlistButton = createElement(
      "button",
      "add-to-playlist",
      "+"
    );

    playlistButton.type = "button";
    playlistButton.dataset.noPlay = "";
    playlistButton.dataset.id = String(number);
    playlistButton.setAttribute(
      "aria-label",
      `Ajouter ${name} à une playlist`
    );
    playlistButton.title = "Ajouter à une playlist";

    actions.append(playButton, favoriteButton, playlistButton);
    card.append(textContainer, actions);

    updateFavoriteButton(favoriteButton, number);

    return card;
  }

  function renderSourates() {
    const list = getElement("list");

    if (!list) {
      reportError("élément #list introuvable.");
      return;
    }

    const fragment = document.createDocumentFragment();

    SOURATES.forEach((surah, index) => {
      fragment.appendChild(createSurahCard(surah, index));
    });

    list.replaceChildren(fragment);

    filterSourates();
    updateAllFavoriteButtons();
  }

  /* ==========================================================================
     09 — FAVORIS
     ========================================================================== */

  function updateFavoriteButton(button, number) {
    const isFavorite = library.surahs.includes(number);

    button.textContent = isFavorite ? "♥" : "♡";
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute(
      "aria-label",
      isFavorite
        ? `Retirer ${getSurahName(number)} des favoris`
        : `Ajouter ${getSurahName(number)} aux favoris`
    );
    button.title = isFavorite
      ? "Retirer des favoris"
      : "Ajouter aux favoris";
  }

  function updateAllFavoriteButtons() {
    document.querySelectorAll(".favorite-surah").forEach(button => {
      const number = Number(button.dataset.id);

      if (isValidSurah(number)) {
        updateFavoriteButton(button, number);
      }
    });
  }

  function toggleSurahFavorite(number) {
    number = Number(number);

    if (!isValidSurah(number)) return;

    const index = library.surahs.indexOf(number);

    if (index >= 0) {
      library.surahs.splice(index, 1);
    } else {
      library.surahs.push(number);
      library.surahs.sort((a, b) => a - b);
    }

    saveLibrary();
  }

 /* ==========================================================================
     10 — RÉCITATEURS : CHARGEMENT, RECHERCHE ET FAVORIS
     ========================================================================== */

  function getSelectedRecitation() {
    const select = getElement("reciter");

    if (!select?.value) return null;

    try {
      const value = JSON.parse(select.value);

      if (
        typeof value.server !== "string" ||
        typeof value.surahList !== "string"
      ) {
        return null;
      }

      return value;
    } catch {
      return null;
    }
  }

  // Reconstruit le menu à partir de la liste complète mémorisée.
  // On filtre les options au lieu d'utiliser option.hidden,
  // qui n'est pas fiable avec certains menus déroulants mobiles.
  function applyReciterSearch(preferredKey) {
    const select = getElement("reciter");
    const search = getElement("search-reciter");

    if (!select || !search || !state.recitersLoaded) return;

    const previousKey =
      preferredKey !== undefined ? preferredKey : select.value;

    const query = normalizeText(search.value);

    const filteredReciters = state.reciters.filter(reciter =>
      normalizeText(reciter.name).includes(query)
    );

    const fragment = document.createDocumentFragment();

    if (filteredReciters.length === 0) {
      const emptyOption = document.createElement("option");

      emptyOption.value = "";
      emptyOption.textContent = "Aucun récitant trouvé";
      emptyOption.disabled = true;

      fragment.appendChild(emptyOption);
      select.replaceChildren(fragment);
      return;
    }

    filteredReciters.forEach(reciter => {
      const option = document.createElement("option");

      option.value = reciter.key;
      option.textContent = reciter.name;

      fragment.appendChild(option);
    });

    select.replaceChildren(fragment);

    const previousStillExists = filteredReciters.some(
      reciter => reciter.key === previousKey
    );

    if (previousStillExists) {
      select.value = previousKey;
    } else {
      select.selectedIndex = 0;
    }
  }

  async function setupReciters() {
    const select = getElement("reciter");

    if (!select) {
      reportError("menu des récitateurs #reciter introuvable.");
      return;
    }

    const previousSelection = select.value;

    try {
      const data = await fetchJson(CONFIG.recitersApi);

      if (!Array.isArray(data.reciters)) {
        throw new Error(
          "Format de réponse des récitateurs invalide."
        );
      }

      const recitations = [];

      data.reciters.forEach(reciter => {
        if (!Array.isArray(reciter.moshaf)) return;

        reciter.moshaf.forEach(moshaf => {
          if (
            !moshaf.server ||
            moshaf.surah_list === undefined ||
            moshaf.surah_list === null ||
            String(moshaf.surah_list).trim() === ""
          ) {
            return;
          }

          const key = JSON.stringify({
            server: moshaf.server,
            surahList: String(moshaf.surah_list)
          });

          recitations.push({
            key,
            name: `${reciter.name} — ${moshaf.name}`
          });
        });
      });

      if (recitations.length === 0) {
        throw new Error("Aucun récitant n'a été trouvé.");
      }

      // Une seule liste de référence pour la recherche et le menu.
      state.reciters = recitations;
      state.recitersLoaded = true;

      // Retrouver un récitant déjà enregistré dans les favoris.
      const preferred = library.reciters.find(reciter =>
        recitations.some(item => item.key === reciter.key)
      );

      const selectionExists = recitations.some(
        reciter => reciter.key === previousSelection
      );

      const preferredKey = selectionExists
        ? previousSelection
        : preferred?.key || recitations[0].key;

      // Appliquer la recherche après le chargement des données.
      applyReciterSearch(preferredKey);

      // Si le texte de recherche exclut le récitant préféré,
      // le menu sélectionne le premier résultat correspondant.
    } catch (error) {
      state.recitersLoaded = false;

      reportError(
        "chargement des récitateurs impossible.",
        error
      );
    }
  }

  function setupReciterSearch() {
    const search = getElement("search-reciter");

    if (!search) {
      reportError("champ de recherche #search-reciter introuvable.");
      return;
    }

    // Empêche d'ajouter plusieurs fois le même écouteur.
    if (search.dataset.reciterSearchInitialized === "true") {
      return;
    }

    search.dataset.reciterSearchInitialized = "true";

    search.addEventListener("input", () => {
      applyReciterSearch();
    });
  }

  function toggleReciterFavorite() {
    const select = getElement("reciter");

    if (!select?.value) {
      alert("Choisis d'abord un récitant.");
      return;
    }

    const option = select.selectedOptions[0];

    const reciter = {
      key: select.value,
      name: option?.textContent.trim() || "Récitant"
    };

    const exists = library.reciters.some(
      item => item.key === reciter.key
    );

    if (exists) {
      alert("Ce récitant figure déjà dans tes favoris.");
      return;
    }

    library.reciters.push(reciter);
    saveLibrary();
  }

  function setupReciterFavoriteButton() {
    const select = getElement("reciter");

    if (!select || getElement("add-favorite-reciter")) return;

    const button = createElement(
      "button",
      "add-favorite-reciter",
      "♡ Ajouter ce récitant aux favoris"
    );

    button.id = "add-favorite-reciter";
    button.type = "button";
    button.dataset.noPlay = "";

    button.addEventListener("click", toggleReciterFavorite);

    select.insertAdjacentElement("afterend", button);
  }
  /* ==========================================================================
     11 — LECTEUR AUDIO
     ========================================================================== */

  const audio = getElement("player");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);

    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function setTrackTitle(message) {
    const title = getElement("currentTrack");

    if (title) title.textContent = message;
  }

  function markPlayingSurah(number) {
    document.querySelectorAll("#list .sourate").forEach(card => {
      const isPlaying = Number(card.dataset.number) === number;

      card.classList.toggle("is-playing", isPlaying);

      const playButton = card.querySelector(".sourate-play");

      if (playButton) {
        playButton.textContent = isPlaying ? "Ⅱ" : "▶";
        playButton.setAttribute(
          "aria-label",
          isPlaying
            ? `En cours de lecture : ${getSurahName(number)}`
            : `Écouter ${getSurahName(Number(card.dataset.number))}`
        );
      }
    });
  }

  function stopQueue() {
    state.queue = null;
    state.queueIndex = 0;
  }

  async function playSurahByNumber(number, shouldPlay = true) {
    number = Number(number);

    if (!isValidSurah(number)) return;

    const select = getElement("reciter");
    const recitation = getSelectedRecitation();

    state.currentSurah = number;

    if (!recitation) {
      setTrackTitle("Chargement des récitateurs…");
      return;
    }

    const availableSurahs = recitation.surahList
      .split(",")
      .map(value => value.trim());

    if (!availableSurahs.includes(String(number))) {
      setTrackTitle(
        `${getSurahName(number)} n'est pas disponible pour ce récitant.`
      );
      return;
    }

    state.currentRecitation = recitation;

    const audioElement = getElement("player");

    if (!audioElement) {
      reportError("lecteur audio #player introuvable.");
      return;
    }

    const requestId = ++state.audioRequest;

    const server = recitation.server.endsWith("/")
      ? recitation.server
      : `${recitation.server}/`;

    const url = `${server}${String(number).padStart(3, "0")}.mp3`;

    audioElement.pause();
    audioElement.src = url;
    audioElement.load();

    markPlayingSurah(number);
    setTrackTitle(`Lecture : ${getSurahName(number)}`);

    const currentTime = getElement("currentTime");
    const duration = getElement("duration");
    const progress = getElement("progress");

    if (currentTime) currentTime.textContent = "0:00";
    if (duration) duration.textContent = "0:00";
    if (progress) progress.style.width = "0%";

    if (!shouldPlay) return;

    try {
      await audioElement.play();

      if (requestId !== state.audioRequest) return;
    } catch (error) {
      if (requestId !== state.audioRequest) return;

      setTrackTitle("Appuie sur lecture pour démarrer l'écoute.");
      reportError("lecture audio impossible.", error);
    }
  }

  function playCurrentSurah() {
    const audioElement = getElement("player");

    if (!audioElement) return;

    if (!audioElement.src) {
      playSurahByNumber(state.currentSurah);
      return;
    }

    if (audioElement.paused) {
      audioElement.play().catch(error => {
        reportError("reprise de la lecture impossible.", error);
        setTrackTitle("Lecture impossible. Réessaie.");
      });
    } else {
      audioElement.pause();
    }
  }

  function playNext() {
    if (state.queue) {
      if (state.queueIndex < state.queue.length - 1) {
        state.queueIndex++;
        playSurahByNumber(state.queue[state.queueIndex]);
      } else {
        stopQueue();
        setTrackTitle("Playlist terminée.");
      }

      return;
    }

    const next = state.currentSurah % SOURATES.length + 1;
    playSurahByNumber(next);
  }

  function playPrevious() {
    if (state.queue) {
      if (state.queueIndex > 0) {
        state.queueIndex--;
        playSurahByNumber(state.queue[state.queueIndex]);
      } else {
        playSurahByNumber(state.queue[0]);
      }

      return;
    }

    const previous =
      (state.currentSurah - 2 + SOURATES.length) % SOURATES.length + 1;

    playSurahByNumber(previous);
  }

  function playPlaylist(playlist) {
    if (!playlist || !Array.isArray(playlist.surahs) ||
        playlist.surahs.length === 0) {
      alert("Cette playlist ne contient aucune sourate.");
      return;
    }

    const validSurahs = playlist.surahs.filter(isValidSurah);

    if (!validSurahs.length) {
      alert("Cette playlist ne contient aucune sourate valide.");
      return;
    }

    state.queue = validSurahs.slice();
    state.queueIndex = 0;

    setTrackTitle(`Playlist : ${playlist.name}`);
    playSurahByNumber(state.queue[0]);
  }

  function setupPlayer() {
    const audioElement = getElement("player");
    const playButton = getElement("playPause");
    const nextButton = getElement("next");
    const previousButton = getElement("prev");
    const volumeInput = getElement("volume");
    const reciterSelect = getElement("reciter");
    const progress = getElement("progress");
    const progressContainer = document.querySelector(".progress-container");

    if (!audioElement) {
      reportError("élément audio #player introuvable.");
      return;
    }

    if (volumeInput) {
      const initialVolume = Number(volumeInput.value);

      audioElement.volume = Number.isFinite(initialVolume)
        ? Math.min(1, Math.max(0, initialVolume))
        : 1;

      volumeInput.addEventListener("input", () => {
        const value = Number(volumeInput.value);

        if (Number.isFinite(value)) {
          audioElement.volume = Math.min(1, Math.max(0, value));
        }
      });
    }

    playButton?.addEventListener("click", playCurrentSurah);
    nextButton?.addEventListener("click", playNext);
    previousButton?.addEventListener("click", playPrevious);

    audioElement.addEventListener("play", () => {
      if (playButton) playButton.textContent = "Ⅱ";
    });

    audioElement.addEventListener("pause", () => {
      if (playButton) playButton.textContent = "▶";
    });

    audioElement.addEventListener("ended", playNext);

    audioElement.addEventListener("error", () => {
      if (audioElement.currentSrc || audioElement.src) {
        setTrackTitle("Erreur de lecture audio. Essaie une autre source.");
      }
    });

    audioElement.addEventListener("timeupdate", () => {
      if (!Number.isFinite(audioElement.duration) ||
          audioElement.duration <= 0) return;

      const percent =
        (audioElement.currentTime / audioElement.duration) * 100;

      if (progress) {
        progress.style.width = `${percent}%`;
      }

      if (progressContainer) {
        progressContainer.setAttribute(
          "aria-valuenow",
          String(Math.round(percent))
        );
      }

      const currentTime = getElement("currentTime");

      if (currentTime) {
        currentTime.textContent = formatTime(audioElement.currentTime);
      }
    });

    audioElement.addEventListener("loadedmetadata", () => {
      const duration = getElement("duration");

      if (duration) {
        duration.textContent = formatTime(audioElement.duration);
      }
    });

    if (progressContainer) {
      progressContainer.addEventListener("click", event => {
        if (!Number.isFinite(audioElement.duration) ||
            audioElement.duration <= 0) return;

        const rectangle = progressContainer.getBoundingClientRect();

        if (rectangle.width <= 0) return;

        const ratio = Math.min(
          1,
          Math.max(0, (event.clientX - rectangle.left) / rectangle.width)
        );

        audioElement.currentTime = ratio * audioElement.duration;
      });

      progressContainer.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

        if (!Number.isFinite(audioElement.duration) ||
            audioElement.duration <= 0) return;

        event.preventDefault();

        const adjustment = event.key === "ArrowRight" ? 5 : -5;

        audioElement.currentTime = Math.max(
          0,
          Math.min(
            audioElement.duration,
            audioElement.currentTime + adjustment
          )
        );
      });
    }

    reciterSelect?.addEventListener("change", () => {
      if (!audioElement.src) return;

      const shouldResume = !audioElement.paused;

      playSurahByNumber(state.currentSurah, shouldResume);
    });
  }

  /* ==========================================================================
     12 — PLAYLISTS
     ========================================================================== */

  function addSurahToPlaylist(number) {
    number = Number(number);

    if (!isValidSurah(number)) return;

    if (!library.playlists.length) {
      alert("Crée d'abord une playlist dans Ma bibliothèque.");
      return;
    }

    const choices = library.playlists
      .map((playlist, index) => `${index + 1}. ${playlist.name}`)
      .join("\n");

    const answer = prompt(
      `Ajouter ${getSurahName(number)} à quelle playlist ?\n\n` +
      `${choices}\n\nSaisis le numéro de la playlist :`
    );

    if (answer === null || !answer.trim()) return;

    const selectedIndex = Number(answer) - 1;
    const playlist = library.playlists[selectedIndex];

    if (!Number.isInteger(selectedIndex) || !playlist) {
      alert("Ce numéro de playlist n'est pas valide.");
      return;
    }

    if (playlist.surahs.includes(number)) {
      alert("Cette sourate figure déjà dans cette playlist.");
      return;
    }

    playlist.surahs.push(number);

    saveLibrary();
  }

  function createPlaylist() {
    const answer = prompt("Comment souhaites-tu appeler ta playlist ?");

    if (answer === null) return;

    const name = answer.trim();

    if (!name) return;

    const duplicate = library.playlists.some(
      playlist => normalizeText(playlist.name) === normalizeText(name)
    );

    if (duplicate) {
      alert("Une playlist porte déjà ce nom.");
      return;
    }

    library.playlists.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      surahs: []
    });

    saveLibrary();
  }

  function removeSurahFromPlaylist(playlistId, number) {
    const playlist = library.playlists.find(
      item => item.id === playlistId
    );

    if (!playlist) return;

    playlist.surahs = playlist.surahs.filter(
      item => item !== number
    );

    saveLibrary();
  }

  function deletePlaylist(playlistId) {
    const playlist = library.playlists.find(
      item => item.id === playlistId
    );

    if (!playlist) return;

    if (!confirm(`Supprimer la playlist « ${playlist.name} » ?`)) {
      return;
    }

    if (state.queue) {
      const activePlaylistSurahs = state.queue.slice();

      if (
        activePlaylistSurahs.length &&
        playlist.surahs.length &&
        activePlaylistSurahs.every(number =>
          playlist.surahs.includes(number)
        )
      ) {
        stopQueue();
      }
    }

    library.playlists = library.playlists.filter(
      item => item.id !== playlistId
    );

    saveLibrary();
  }

  /* ==========================================================================
     13 — BIBLIOTHÈQUE PERSONNELLE
     ========================================================================== */

  function makeLibraryButton(label, action, className = "library-button") {
    const button = createElement("button", className, label);

    button.type = "button";
    button.addEventListener("click", action);

    return button;
  }

  function makeEmptyMessage(message) {
    return createElement("p", "library-empty", message);
  }

  function createLibraryRow(number, onRemove) {
    const row = createElement("div", "library-row");

    const name = createElement(
      "span",
      "",
      `${String(number).padStart(3, "0")}. ${getSurahName(number)}`
    );

    const arabicName = createElement(
      "span",
      "library-arabic",
      getSurahArabic(number)
    );

    arabicName.lang = "ar";
    arabicName.dir = "rtl";

    const playButton = makeLibraryButton("▶ Écouter", () => {
      stopQueue();
      playSurahByNumber(number);
    });

    const addButton = makeLibraryButton("+ Playlist", () => {
      addSurahToPlaylist(number);
    });

    const removeButton = makeLibraryButton("Retirer", onRemove);

    row.append(name, arabicName, playButton, addButton, removeButton);

    return row;
  }

  function getLibrarySection() {
    let section = getElement("an-noor-library");

    if (section) return section;

    const list = getElement("list");

    if (!list?.parentNode) return null;

    section = createElement("section", "an-noor-library");
    section.id = "an-noor-library";

    const heading = createElement("h2", "", "Ma bibliothèque");
    const intro = createElement(
      "p",
      "library-intro",
      "Retrouve tes sourates, tes récitateurs et tes playlists."
    );

    const createButton = makeLibraryButton(
      "+ Créer une playlist",
      createPlaylist,
      "library-create"
    );

    createButton.id = "create-playlist";

    const reciterArea = createElement("div");
    reciterArea.id = "favorite-reciter-area";

    const surahArea = createElement("div");
    surahArea.id = "favorite-surahs-area";

    const playlistArea = createElement("div");
    playlistArea.id = "playlists-area";

    section.append(
      heading,
      intro,
      createButton,
      reciterArea,
      surahArea,
      playlistArea
    );

    list.parentNode.insertBefore(section, list);

    return section;
  }

  renderLibrary = function () {
    const section = getLibrarySection();

    if (!section) return;

    const reciterArea = section.querySelector("#favorite-reciter-area");
    const surahArea = section.querySelector("#favorite-surahs-area");
    const playlistArea = section.querySelector("#playlists-area");

    if (!reciterArea || !surahArea || !playlistArea) return;

    reciterArea.replaceChildren();
    surahArea.replaceChildren();
    playlistArea.replaceChildren();

    /* Récitateurs favoris */
    reciterArea.appendChild(
      createElement("h3", "", "Mes récitateurs favoris")
    );

    if (!library.reciters.length) {
      reciterArea.appendChild(
        makeEmptyMessage("Aucun récitant favori pour le moment.")
      );
    } else {
      library.reciters.forEach(reciter => {
        const row = createElement("div", "library-row");
        const name = createElement("span", "", reciter.name);

        const chooseButton = makeLibraryButton("Choisir", () => {
          const select = getElement("reciter");

          if (!select) return;

          const optionExists = Array.from(select.options).some(
            option => option.value === reciter.key
          );

          if (!optionExists) {
            alert("Ce récitant n'est pas disponible dans la liste actuelle.");
            return;
          }

          select.value = reciter.key;
          select.dispatchEvent(new Event("change", { bubbles: true }));

          select.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        });

        const removeButton = makeLibraryButton("Retirer", () => {
          library.reciters = library.reciters.filter(
            item => item.key !== reciter.key
          );

          saveLibrary();
        });

        row.append(name, chooseButton, removeButton);
        reciterArea.appendChild(row);
      });
    }

    /* Sourates favorites */
    surahArea.appendChild(
      createElement("h3", "", "Mes sourates favorites")
    );

    if (!library.surahs.length) {
      surahArea.appendChild(
        makeEmptyMessage("Tes sourates favorites apparaîtront ici.")
      );
    } else {
      library.surahs
        .slice()
        .sort((a, b) => a - b)
        .forEach(number => {
          surahArea.appendChild(
            createLibraryRow(number, () => {
              library.surahs = library.surahs.filter(
                item => item !== number
              );

              saveLibrary();
            })
          );
        });
    }

    /* Playlists */
    playlistArea.appendChild(
      createElement("h3", "", "Mes playlists")
    );

    if (!library.playlists.length) {
      playlistArea.appendChild(
        makeEmptyMessage(
          "Crée ta première playlist pour organiser tes écoutes."
        )
      );
    }

    library.playlists.forEach(playlist => {
      const box = createElement("div", "playlist-box");

      const title = createElement(
        "h4",
        "",
        `${playlist.name} (${playlist.surahs.length})`
      );

      const playButton = makeLibraryButton(
        "▶ Écouter la playlist",
        () => playPlaylist(playlist)
      );

      const deleteButton = makeLibraryButton(
        "Supprimer la playlist",
        () => deletePlaylist(playlist.id)
      );

      box.append(title, playButton, deleteButton);

      if (!playlist.surahs.length) {
        box.appendChild(
          makeEmptyMessage("Cette playlist est encore vide.")
        );
      }

      playlist.surahs.forEach(number => {
        box.appendChild(
          createLibraryRow(number, () => {
            removeSurahFromPlaylist(playlist.id, number);
          })
        );
      });

      playlistArea.appendChild(box);
    });
  };

  /* ==========================================================================
     14 — CLICS : UN SEUL GESTIONNAIRE POUR LES SOURATES
     ========================================================================== */

  function setupSurahInteractions() {
    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      const target = event.target;

      /* Favoris : l'action ne doit jamais lancer la lecture. */
      const favoriteButton = target.closest(".favorite-surah");

      if (favoriteButton && favoriteButton.dataset.id) {
        event.preventDefault();
        event.stopPropagation();

        toggleSurahFavorite(Number(favoriteButton.dataset.id));

        return;
      }

      /* Ajout à une playlist : pas de propagation vers la carte. */
      const playlistButton = target.closest(".add-to-playlist");

      if (playlistButton && playlistButton.dataset.id) {
        event.preventDefault();
        event.stopPropagation();

        addSurahToPlaylist(Number(playlistButton.dataset.id));

        return;
      }

      /* Lecture directe : uniquement dans la liste des sourates. */
      const card = target.closest("#list .sourate");

      if (!card) return;

      if (
        target.closest(
          "a, input, select, textarea, [data-no-play], " +
          ".favorite-surah, .add-to-playlist"
        )
      ) {
        return;
      }

      const number = Number(card.dataset.number);

      if (!isValidSurah(number)) return;

      stopQueue();
      playSurahByNumber(number);
    });
  }

  /* ==========================================================================
     15 — RETOUR EN HAUT DE PAGE
     ========================================================================== */

  function setupBackToTop() {
    const button = getElement("scrolltop");

    button?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ==========================================================================
     16 — INITIALISATION
     ========================================================================== */

  async function initialize() {
    setupMenu();
    setupSearch();
    setupReciterSearch();
    showToday();
    renderSourates();
    setupBackToTop();
    setupPlayer();
    setupSurahInteractions();
    setupReciterFavoriteButton();

    const verseSection = document.querySelector(".coran-section");

    if (verseSection) {
      verseSection.classList.add("visible");
    }

    // Le rendu de la bibliothèque reste accessible à saveLibrary().
    renderLibrary();

    // Ces chargements réseau ne doivent pas bloquer les autres fonctions.
    void setupReciters();
    void showVerse();

    showMessage("application initialisée.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    void initialize();
  }
})();
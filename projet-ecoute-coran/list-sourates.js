const list = document.getElementById("list");

const sourates =[
"Al-Fatiha — الفاتحة",
"Al-Baqara — البقرة",
"Al-Imran — آل عمران",
"An-Nisa — النساء",
"Al-Ma'idah — المائدة",
"Al-An'am — الأنعام",
"Al-A'raf — الأعراف",
"Al-Anfal — الأنفال",
"At-Tawbah — التوبة",
"Yunus — يونس",
"Hud — هود",
"Yusuf — يوسف",
"Ar-Ra'd — الرعد",
"Ibrahim — إبراهيم",
"Al-Hijr — الحجر",
"An-Nahl — النحل",
"Al-Isra — الإسراء",
"Al-Kahf — الكهف",
"Maryam — مريم",
"Ta-Ha — طه",
"Al-Anbiya — الأنبياء",
"Al-Hajj — الحج",
"Al-Mu'minun — المؤمنون",
"An-Nur — النور",
"Al-Furqan — الفرقان",
"Ash-Shu'ara — الشعراء",
"An-Naml — النمل",
"Al-Qasas — القصص",
"Al-Ankabut — العنكبوت",
"Ar-Rum — الروم",
"Luqman — لقمان",
"As-Sajda — السجدة",
"Al-Ahzab — الأحزاب",
"Saba — سبأ",
"Fatir — فاطر",
"Ya-Sin — يس",
"As-Saffat — الصافات",
"Sad — ص",
"Az-Zumar — الزمر",
"Ghafir — غافر",
"Fussilat — فصلت",
"Ash-Shura — الشورى",
"Az-Zukhruf — الزخرف",
"Ad-Dukhan — الدخان",
"Al-Jathiya — الجاثية",
"Al-Ahqaf — الأحقاف",
"Muhammad — محمد",
"Al-Fath — الفتح",
"Al-Hujurat — الحجرات",
"Qaf — ق",
"Adh-Dhariyat — الذاريات",
"At-Tur — الطور",
"An-Najm — النجم",
"Al-Qamar — القمر",
"Ar-Rahman — الرحمن",
"Al-Waqia — الواقعة",
"Al-Hadid — الحديد",
"Al-Mujadila — المجادلة",
"Al-Hashr — الحشر",
"Al-Mumtahina — الممتحنة",
"As-Saff — الصف",
"Al-Jumu'a — الجمعة",
"Al-Munafiqun — المنافقون",
"At-Taghabun — التغابن",
"At-Talaq — الطلاق",
"At-Tahrim — التحريم",
"Al-Mulk — الملك",
"Al-Qalam — القلم",
"Al-Haqqa — الحاقة",
"Al-Ma'arij — المعارج",
"Nuh — نوح",
"Al-Jinn — الجن",
"Al-Muzzammil — المزمل",
"Al-Muddathir — المدثر",
"Al-Qiyama — القيامة",
"Al-Insan — الإنسان",
"Al-Mursalat — المرسلات",
"An-Naba — النبأ",
"An-Nazi'at — النازعات",
"Abasa — عبس",
"At-Takwir — التكوير",
"Al-Infitar — الانفطار",
"Al-Mutaffifin — المطففين",
"Al-Inshiqaq — الانشقاق",
"Al-Buruj — البروج",
"At-Tariq — الطارق",
"Al-A'la — الأعلى",
"Al-Ghashiya — الغاشية",
"Al-Fajr — الفجر",
"Al-Balad — البلد",
"Ash-Shams — الشمس",
"Al-Layl — الليل",
"Ad-Duha — الضحى",
"Ash-Sharh — الشرح",
"At-Tin — التين",
"Al-Alaq — العلق",
"Al-Qadr — القدر",
"Al-Bayyina — البينة",
"Az-Zalzala — الزلزلة",
"Al-Adiyat — العاديات",
"Al-Qaria — القارعة",
"At-Takathur — التكاثر",
"Al-Asr — العصر",
"Al-Humaza — الهمزة",
"Al-Fil — الفيل",
"Quraysh — قريش",
"Al-Ma'un — الماعون",
"Al-Kawthar — الكوثر",
"Al-Kafirun — الكافرون",
"An-Nasr — النصر",
"Al-Masad — المسد",
"Al-Ikhlas — الإخلاص",
"Al-Falaq — الفلق",
"An-Nas — الناس"
];

sourates.forEach((name,i)=>{

let num=(i+1).toString().padStart(3,"0");

list.innerHTML+=`
<div class="sourate" data-src="s/${num}.mp3">
<p class="title">${num}. ${name}</p>
</div>
`;

});


let currentSource = null;

// Création du contexte audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Cache pour stocker les buffers audio
const audioCache = new Map();

// Précharge un fichier audio
async function preloadAudio(url) {
    if (audioCache.has(url)) return audioCache.get(url);

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    audioCache.set(url, audioBuffer);
    return audioBuffer;
}

// Précharge plusieurs fichiers
async function preloadMultipleAudios(urls) {
    await Promise.all(urls.map(preloadAudio));
    console.log("Tous les audios sont préchargés !");
}

// Lecture depuis le cache
function playAudio(url) {
    const buffer = audioCache.get(url);
    if (!buffer) return console.warn("Audio non trouvé :", url);

    if (currentSource) currentSource.stop();

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);

    currentSource = source;
}

// Playlist adaptée à ton dossier s/
const playlist = [
    { title: "Al-Fatiha — الفاتحة 1", url: "s/001.mp3" },
    { title: "Al-Baqara — البقرة2", url: "s/002.mp3" },
    { title: "Al-Imran — 3آل عمران", url: "s/003.mp3" }
];

// Boutons
sourates.forEach((s, i) => {
    s.addEventListener("click", () => {
        playAudio(playlist[i].url);

        document.getElementById("currentTrack").textContent =
            "Lecture : " + playlist[i].title;
    });
});

// Préchargement au démarrage
(async () => {
    await preloadMultipleAudios(playlist.map(p => p.url));
})();

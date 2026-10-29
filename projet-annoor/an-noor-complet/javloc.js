(() => {
  "use strict";

  const boutonPartage = document.querySelector(".partage .button");

  if (!boutonPartage) return;

  boutonPartage.addEventListener("click", async () => {
    const arabe = document.getElementById("verset-ar")?.textContent.trim();
    const francais = document.getElementById("verset-fr")?.textContent.trim();
    const reference = document.getElementById("reference")?.textContent.trim();
    const lien = window.location.href;

    // Éviter de partager un contenu incomplet.
    if (!arabe || !francais || !reference) {
      console.warn("An•Noor : le verset à partager est incomplet.");
      return;
    }

    const texte = `${arabe}

${francais}

${reference}

An•Noor — Écouter, méditer, se rapprocher.

${lien}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Un verset du Coran — An•Noor",
          text: texte
        });
      } catch (erreur) {
        // Annuler le partage est un comportement normal.
        if (erreur.name !== "AbortError") {
          console.error("An•Noor : impossible de partager le verset.", erreur);
        }
      }

      return;
    }

    // Solution de secours pour les navigateurs sans partage natif.
    try {
      await navigator.clipboard.writeText(texte);
      boutonPartage.textContent = "Copié !";

      window.setTimeout(() => {
        boutonPartage.textContent = "Partager";
      }, 2000);
    } catch (erreur) {
      console.error("An•Noor : impossible de copier le verset.", erreur);
      alert("Le partage n'est pas disponible sur ce navigateur.");
    }
  });
})();
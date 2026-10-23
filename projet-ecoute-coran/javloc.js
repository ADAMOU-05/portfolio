
document.querySelector(".partage .button").addEventListener("click", async () => {
  const arabe = document.getElementById("verset-ar").textContent;
  const francais = document.getElementById("verset-fr").textContent;
  const reference = document.getElementById("reference").textContent;
  const lien = window.location.href;

  const texte = `${arabe}\n\n${francais}\n\n${reference}\n\nAn•noor\n${lien}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Verset du Coran — An•noor",
        text: texte,
        url: lien
      });
    } catch (erreur) {
      if (erreur.name !== "AbortError") console.error(erreur);
    }
  } else {
    alert("Le partage direct n'est pas disponible sur ce navigateur.");
  }
});

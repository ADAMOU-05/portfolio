function setupReciterSearch() {
  const search = document.getElementById("search-reciter");
  const select = document.getElementById("reciter");

  if (!search || !select) {
    console.error("An•Noor : champ de recherche ou menu des récitateurs introuvable.");
    return;
  }

  // Mémoriser les options originales
  const originalOptions = Array.from(select.options).map(option => ({
    value: option.value,
    text: option.textContent
  }));

  function normalize(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase()
      .trim();
  }

  function filterReciters() {
    const query = normalize(search.value);
    const previousValue = select.value;

    const filtered = originalOptions.filter(option => {
      return normalize(option.text).includes(query);
    });

    // Reconstruire la liste avec les résultats
    select.replaceChildren();

    if (filtered.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Aucun récitant trouvé";
      option.disabled = true;
      select.appendChild(option);
      return;
    }

    filtered.forEach(item => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.text;
      select.appendChild(option);
    });

    // Conserver le récitant sélectionné s'il correspond encore
    if (filtered.some(item => item.value === previousValue)) {
      select.value = previousValue;
    } else {
      select.selectedIndex = 0;
    }

    // Signaler le changement au reste du site
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  search.addEventListener("input", filterReciters);
}
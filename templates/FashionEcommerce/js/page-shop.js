// Shop page — category filter, search (?q=), price filter, sort.
(function () {
  const params = new URLSearchParams(location.search);
  let activeCat = params.get("cat") || "All";
  if (!CATEGORIES.includes(activeCat)) activeCat = "All";
  let query = (params.get("q") || "").trim();

  const PRICE_MIN = Math.floor(Math.min(...PRODUCTS.map(p => p.price)));
  const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)));
  let sortBy = "featured";
  let maxPrice = PRICE_MAX;

  const priceInput = document.getElementById("price");
  const priceLabel = document.getElementById("price-label");
  const priceReset = document.getElementById("price-reset");
  const sortSelect = document.getElementById("sort");

  priceInput.min = PRICE_MIN;
  priceInput.max = PRICE_MAX;
  priceInput.value = PRICE_MAX;

  const matchesQuery = (p, q) => `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q.toLowerCase());

  const SORTERS = {
    featured:     (a, b) => a.id - b.id,
    "price-asc":  (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating:       (a, b) => b.rating - a.rating,
    name:         (a, b) => a.name.localeCompare(b.name),
  };

  function render() {
    const searching = query.length > 0;

    document.getElementById("filters").innerHTML = searching ? "" : CATEGORIES.map(c => `
      <button onclick="selectCat('${c}')" class="px-4 py-2 text-sm font-medium transition-colors ${c === activeCat ? "t-chip-active" : "t-chip"}">${c}</button>`).join("");

    let list;
    if (searching) {
      list = PRODUCTS.filter(p => matchesQuery(p, query));
      document.getElementById("shop-title").innerHTML =
        `Results for “${query.replace(/</g, "&lt;")}” <a href="shop.html" class="text-base font-normal t-muted hover:underline align-middle ml-2">✕ clear</a>`;
    } else {
      list = activeCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCat);
      document.getElementById("shop-title").textContent = activeCat === "All" ? "Shop All" : activeCat;
    }

    const baseCount = list.length;
    list = list.filter(p => p.price <= maxPrice);
    list = [...list].sort(SORTERS[sortBy]);

    const priceActive = maxPrice < PRICE_MAX;
    priceLabel.textContent = priceActive ? `≤ ${money(maxPrice)}` : "Any";
    priceReset.classList.toggle("hidden", !priceActive);

    document.getElementById("shop-count").textContent =
      `${list.length} product${list.length !== 1 ? "s" : ""}` +
      (priceActive && list.length !== baseCount ? ` of ${baseCount}` : "");
    document.getElementById("product-grid").innerHTML = list.map(productCardHTML).join("");
    document.getElementById("empty").textContent = priceActive
      ? "No products match your filters. Try raising the max price."
      : (searching ? `No products match “${query}”.` : "No products found in this category.");
    document.getElementById("empty").classList.toggle("hidden", list.length > 0);
    refreshHearts();
  }

  window.selectCat = function (c) {
    activeCat = c;
    query = "";
    history.replaceState(null, "", c === "All" ? "shop.html" : `shop.html?cat=${c}`);
    render();
  };

  priceInput.addEventListener("input", () => { maxPrice = +priceInput.value; render(); });
  sortSelect.addEventListener("change", () => { sortBy = sortSelect.value; render(); });
  priceReset.addEventListener("click", () => { maxPrice = PRICE_MAX; priceInput.value = PRICE_MAX; render(); });

  render();
})();

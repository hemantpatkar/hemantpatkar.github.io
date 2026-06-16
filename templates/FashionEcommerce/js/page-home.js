// Fills the featured product grid on themed home pages.
(function () {
  const grid = document.getElementById("home-grid");
  if (grid) {
    grid.innerHTML = PRODUCTS.slice(0, 8).map(productCardHTML).join("");
    refreshHearts();
  }
})();

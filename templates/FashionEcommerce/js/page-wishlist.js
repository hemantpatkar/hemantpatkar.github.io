// Wishlist page — renders saved products; re-renders when an item is removed.
function renderWishlist() {
  const items = getWishlist().map(getProduct).filter(Boolean);
  const grid = document.getElementById("wish-grid");
  const empty = document.getElementById("wish-empty");

  document.getElementById("wish-count").textContent =
    items.length ? `${items.length} saved item${items.length !== 1 ? "s" : ""}` : "";
  grid.innerHTML = items.map(productCardHTML).join("");
  grid.classList.toggle("hidden", items.length === 0);
  empty.classList.toggle("hidden", items.length > 0);
  refreshHearts();
}

document.addEventListener("wishlist:change", renderWishlist);
renderWishlist();

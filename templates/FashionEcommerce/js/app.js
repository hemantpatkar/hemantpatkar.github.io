// Shared cart logic + rendering helpers for the LUXE storefront.
// Cart is persisted in localStorage as an array of { id, qty }.

const CART_KEY = "luxe_cart";
const WISHLIST_KEY = "luxe_wishlist";

/* ---------- cart state ---------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  toast("Added to cart");
}
function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(l => l.id !== id);
  else { const line = cart.find(l => l.id === id); if (line) line.qty = qty; }
  saveCart(cart);
}
function removeFromCart(id) {
  saveCart(getCart().filter(l => l.id !== id));
}
function cartCount() {
  return getCart().reduce((n, l) => n + l.qty, 0);
}
function cartTotal() {
  return getCart().reduce((sum, l) => {
    const p = PRODUCTS.find(p => p.id === l.id);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
}

/* ---------- wishlist state ---------- */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}
function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  updateWishlistCount();
}
function inWishlist(id) {
  return getWishlist().includes(id);
}
function toggleWishlist(id) {
  const list = getWishlist();
  const i = list.indexOf(id);
  if (i === -1) { list.push(id); toast("Added to wishlist"); }
  else { list.splice(i, 1); toast("Removed from wishlist"); }
  saveWishlist(list);
  refreshHearts();
  document.dispatchEvent(new CustomEvent("wishlist:change", { detail: { id } }));
}
function wishlistCount() {
  return getWishlist().length;
}
function updateWishlistCount() {
  const n = wishlistCount();
  document.querySelectorAll("[data-wishlist-count]").forEach(el => {
    el.textContent = n;
    el.classList.toggle("hidden", n === 0);
  });
}

/* ---------- helpers ---------- */
const money = n => "$" + n.toFixed(2);
const getProduct = id => PRODUCTS.find(p => p.id === id);

function stars(rating) {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

function updateCartCount() {
  const n = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = n;
    el.classList.toggle("hidden", n === 0);
  });
}

function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-full text-sm shadow-lg opacity-0 transition-opacity duration-300";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("opacity-0");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add("opacity-0"), 1800);
}

/* ---------- wishlist heart ---------- */
const HEART_PATH = "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z";
function heartButtonHTML(id) {
  const active = inWishlist(id);
  return `
    <button onclick="toggleWishlist(${id})" data-wish="${id}" aria-label="Toggle wishlist"
      class="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 transition-transform">
      <svg class="h-5 w-5 ${active ? 'text-red-500' : 'text-gray-700'}" viewBox="0 0 24 24"
           fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6">
        <path stroke-linecap="round" stroke-linejoin="round" d="${HEART_PATH}"/>
      </svg>
    </button>`;
}
// Re-sync every heart icon on the page with current wishlist state.
function refreshHearts() {
  document.querySelectorAll("[data-wish]").forEach(btn => {
    const active = inWishlist(parseInt(btn.dataset.wish, 10));
    const svg = btn.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("fill", active ? "currentColor" : "none");
    svg.classList.toggle("text-red-500", active);
    svg.classList.toggle("text-gray-700", !active);
  });
}

/* ---------- product card ---------- */
function productCardHTML(p) {
  return `
    <div class="group t-card overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative">
        <a href="product.html?id=${p.id}" class="block overflow-hidden aspect-[3/4] t-surface">
          <img src="${p.image}" alt="${p.name}" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-3 left-3 t-surface t-pill text-xs font-medium px-2.5 py-1 border t-line">${p.category}</span>
        </a>
        ${heartButtonHTML(p.id)}
      </div>
      <div class="p-4">
        <a href="product.html?id=${p.id}">
          <h3 class="t-display font-medium truncate">${p.name}</h3>
        </a>
        <div class="flex items-center gap-1 mt-1 text-amber-500 text-sm">${stars(p.rating)}<span class="t-muted ml-1">${p.rating}</span></div>
        <div class="flex items-center justify-between mt-3">
          <span class="text-lg font-semibold">${money(p.price)}</span>
          <button onclick="addToCart(${p.id})" class="t-btn text-sm px-3.5 py-2">Add</button>
        </div>
      </div>
    </div>`;
}

/* ---------- shared header (search + wishlist + mobile nav) ---------- */
const NAV_LINKS = [
  { label: "Home",        href: "index.html" },
  { label: "Shop",        href: "shop.html" },
  { label: "Women",       href: "shop.html?cat=Women" },
  { label: "Men",         href: "shop.html?cat=Men" },
  { label: "Accessories", href: "shop.html?cat=Accessories" },
];

function isActiveLink(href) {
  const page = location.pathname.split("/").pop() || "index.html";
  const cat = new URLSearchParams(location.search).get("cat");
  const [hPage, hQuery] = href.split("?");
  if (hPage !== page) return false;
  const hCat = hQuery ? new URLSearchParams(hQuery).get("cat") : null;
  return (hCat || null) === (cat || null);
}

function searchIconSVG(cls) {
  return `<svg class="${cls}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>`;
}

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const q = new URLSearchParams(location.search).get("q") || "";

  const desktopLinks = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="hover:text-gray-500 ${isActiveLink(l.href) ? 'text-gray-900 font-semibold' : ''}">${l.label}</a>`
  ).join("");
  const mobileLinks = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="block py-3 border-b border-gray-100 text-lg ${isActiveLink(l.href) ? 'font-semibold' : ''}">${l.label}</a>`
  ).join("");

  host.innerHTML = `
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
      <div class="flex items-center gap-1.5">
        <button onclick="toggleMobileMenu()" class="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg" aria-label="Open menu">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
        <a href="index.html" class="text-2xl font-bold tracking-tight">LUXE</a>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium">${desktopLinks}</nav>

      <div class="flex items-center gap-1 sm:gap-2">
        <form onsubmit="return submitSearch(event)" class="hidden lg:flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1">
          ${searchIconSVG("h-4 w-4 text-gray-400")}
          <input name="q" value="${q.replace(/"/g, "&quot;")}" placeholder="Search products…"
                 class="bg-transparent text-sm px-2 py-1 w-40 focus:outline-none">
        </form>

        <a href="wishlist.html" class="relative p-2 hover:bg-gray-100 rounded-lg" aria-label="Wishlist">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="${HEART_PATH}"/></svg>
          <span data-wishlist-count class="hidden absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[10px] font-semibold h-5 w-5 flex items-center justify-center rounded-full">0</span>
        </a>

        <a href="cart.html" class="relative p-2 hover:bg-gray-100 rounded-lg" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
          </svg>
          <span data-cart-count class="hidden absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[10px] font-semibold h-5 w-5 flex items-center justify-center rounded-full">0</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="fixed inset-0 z-50 hidden md:hidden">
    <div class="absolute inset-0 bg-black/40" onclick="toggleMobileMenu()"></div>
    <div class="absolute top-0 left-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-6 flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <span class="text-2xl font-bold">LUXE</span>
        <button onclick="toggleMobileMenu()" class="p-2 -mr-2 hover:bg-gray-100 rounded-lg" aria-label="Close menu">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <form onsubmit="return submitSearch(event)" class="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1.5 mb-6">
        ${searchIconSVG("h-5 w-5 text-gray-400")}
        <input name="q" value="${q.replace(/"/g, "&quot;")}" placeholder="Search products…"
               class="bg-transparent text-sm px-2 py-1 w-full focus:outline-none">
      </form>
      <nav class="flex-1">${mobileLinks}</nav>
      <div class="flex gap-3 pt-4">
        <a href="wishlist.html" class="flex-1 text-center border border-gray-300 rounded-lg py-2.5 text-sm font-medium">Wishlist</a>
        <a href="cart.html" class="flex-1 text-center bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium">Cart</a>
      </div>
    </div>
  </div>`;

  updateCartCount();
  updateWishlistCount();
}

function toggleMobileMenu() {
  const m = document.getElementById("mobile-menu");
  if (!m) return;
  const opening = m.classList.contains("hidden");
  m.classList.toggle("hidden");
  document.body.classList.toggle("overflow-hidden", opening);
}

function submitSearch(e) {
  e.preventDefault();
  const q = (new FormData(e.target).get("q") || "").toString().trim();
  location.href = q ? `shop.html?q=${encodeURIComponent(q)}` : "shop.html";
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();        // no-op on themed pages (no #site-header); they ship a static header
  updateCartCount();
  updateWishlistCount();
  refreshHearts();
});

/* Generates templates/<theme>/{index,shop,product,cart,checkout,wishlist}.html
   Each page = themed static header + shared body + themed footer + shared scripts.
   Theming is driven by a `theme-<name>` body class (see src/input.css tokens). */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "templates");

const THEMES = [
  { folder: "modern",     label: "Modern",     brand: `<a href="index.html" class="text-2xl font-bold tracking-tight">LUXE</a>` },
  { folder: "luxury",     label: "Luxury",     brand: `<a href="index.html" class="t-display text-xl tracking-[0.25em]">MAISON&nbsp;LUXE</a>` },
  { folder: "streetwear", label: "Streetwear", brand: `<a href="index.html" class="text-2xl font-black tracking-tighter">LUXE<span class="t-accent">/ST</span></a>` },
  { folder: "playful",    label: "Playful",    brand: `<a href="index.html" class="text-2xl font-extrabold t-accent">POP!</a>` },
  { folder: "minimal",    label: "Minimal",    brand: `<a href="index.html" class="text-lg tracking-[0.35em] font-medium">ÉTUDE</a>` },
];

const SVG_CART = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>`;
const SVG_HEART = `<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`;
const SVG_SEARCH = `<svg class="h-4 w-4 t-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>`;

const NAV = `
  <a href="index.html" class="hover:opacity-60">Home</a>
  <a href="shop.html" class="hover:opacity-60">Shop</a>
  <a href="shop.html?cat=Women" class="hover:opacity-60">Women</a>
  <a href="shop.html?cat=Men" class="hover:opacity-60">Men</a>
  <a href="shop.html?cat=Accessories" class="hover:opacity-60">Accessories</a>`;

function header(t) {
  const ticker = t.folder === "streetwear"
    ? `<div class="t-badge text-xs font-bold uppercase tracking-widest py-2 text-center">Free shipping over $100 · New drop live now · Members get early access</div>`
    : "";
  return `
  ${ticker}
  <header class="sticky top-0 z-40 t-surface border-b t-line">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5">
        <button onclick="toggleMobileMenu()" class="md:hidden p-2 -ml-2 hover:opacity-60" aria-label="Menu">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
        ${t.brand}
      </div>
      <nav class="hidden md:flex items-center gap-7 text-sm font-medium">${NAV}</nav>
      <div class="flex items-center gap-2">
        <form onsubmit="return submitSearch(event)" class="hidden lg:flex items-center t-chip px-3 py-1.5">
          ${SVG_SEARCH}
          <input name="q" placeholder="Search…" class="bg-transparent text-sm px-2 w-36 focus:outline-none">
        </form>
        <a href="wishlist.html" class="relative p-2 hover:opacity-60" aria-label="Wishlist">
          ${SVG_HEART}
          <span data-wishlist-count class="hidden absolute -top-0.5 -right-0.5 t-badge text-[10px] font-semibold h-5 w-5 flex items-center justify-center rounded-full">0</span>
        </a>
        <a href="cart.html" class="relative p-2 hover:opacity-60" aria-label="Cart">
          ${SVG_CART}
          <span data-cart-count class="hidden absolute -top-0.5 -right-0.5 t-badge text-[10px] font-semibold h-5 w-5 flex items-center justify-center rounded-full">0</span>
        </a>
      </div>
    </div>
  </header>
  <div id="mobile-menu" class="fixed inset-0 z-50 hidden md:hidden">
    <div class="absolute inset-0 bg-black/40" onclick="toggleMobileMenu()"></div>
    <div class="absolute top-0 left-0 h-full w-80 max-w-[85%] t-surface p-6 flex flex-col">
      <div class="flex items-center justify-between mb-6">${t.brand}
        <button onclick="toggleMobileMenu()" class="p-2 -mr-2 hover:opacity-60" aria-label="Close">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <form onsubmit="return submitSearch(event)" class="flex items-center t-chip px-3 py-1.5 mb-6">
        ${SVG_SEARCH}<input name="q" placeholder="Search…" class="bg-transparent text-sm px-2 w-full focus:outline-none">
      </form>
      <nav class="flex flex-col gap-3 text-lg">${NAV}</nav>
    </div>
  </div>`;
}

function footer(t) {
  return `
  <footer class="t-surface border-t t-line mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
      <div class="mb-2">${t.brand}</div>
      <p class="t-muted text-sm">Modern fashion essentials — ${t.label} template.</p>
      <p class="t-muted text-xs mt-4">© 2026 LUXE · <a href="/templates/FashionEcommerce/index.html" class="underline hover:opacity-70">All templates</a></p>
    </div>
  </footer>`;
}

function shell(t, title, body, scripts) {
  const tags = scripts.map(s => `  <script src="${s}"></script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/templates/FashionEcommerce/dist/styles.css">
</head>
<body class="theme-${t.folder}" data-theme="${t.folder}">
${header(t)}
${body}
${footer(t)}
  <script src="/templates/FashionEcommerce/js/products.js"></script>
  <script src="/templates/FashionEcommerce/js/app.js"></script>
${tags}
</body>
</html>
`;
}

/* ---------------- home bodies (bespoke per theme) ---------------- */
const catTile = (cat, img, label) =>
  `<a href="shop.html?cat=${cat}" class="group relative aspect-square t-rounded-lg overflow-hidden"><img src="/templates/FashionEcommerce/images/${img}" alt="${label}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"><div class="absolute inset-0 bg-black/30 flex items-end p-4"><span class="text-white font-semibold text-lg">${label}</span></div></a>`;

const HOME = {
  modern: `
  <section class="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center py-16 md:py-24">
    <div>
      <p class="text-sm font-medium tracking-widest t-muted uppercase mb-4">New Collection 2026</p>
      <h1 class="t-display text-5xl md:text-6xl font-bold leading-tight mb-6">Style that speaks for itself.</h1>
      <p class="text-lg t-muted mb-8 max-w-md">Discover curated fashion essentials designed for the modern wardrobe.</p>
      <div class="flex gap-4">
        <a href="shop.html" class="t-btn px-7 py-3.5 font-medium">Shop Now</a>
        <a href="shop.html?cat=Women" class="t-btn-outline px-7 py-3.5 font-medium">Women's</a>
      </div>
    </div>
    <div class="aspect-[4/5] t-rounded-lg overflow-hidden t-surface"><img src="/templates/FashionEcommerce/images/hero.jpg" alt="" class="w-full h-full object-cover"></div>
  </section>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <h2 class="t-display text-2xl font-bold mb-8">Shop by Category</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${catTile("Women","cat-women.jpg","Women")}${catTile("Men","cat-men.jpg","Men")}${catTile("Shoes","cat-shoes.jpg","Shoes")}${catTile("Accessories","cat-acc.jpg","Accessories")}
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div class="flex items-center justify-between mb-8"><h2 class="t-display text-2xl font-bold">Featured Products</h2><a href="shop.html" class="text-sm font-medium hover:underline">View all →</a></div>
    <div id="home-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-5"></div>
  </section>`,

  luxury: `
  <section class="relative">
    <img src="/templates/FashionEcommerce/images/hero.jpg" alt="" class="w-full h-[70vh] object-cover">
    <div class="absolute inset-0 bg-black/25"></div>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
      <p class="text-[11px] uppercase tracking-[0.3em] mb-5">The 2026 Collection</p>
      <h1 class="t-display text-5xl md:text-7xl leading-tight max-w-3xl">Timeless pieces, quietly made.</h1>
      <a href="shop.html" class="mt-9 inline-block border border-white/80 px-10 py-3.5 text-[11px] uppercase tracking-[0.25em] hover:bg-white hover:text-neutral-900 transition-colors">Explore the Maison</a>
    </div>
  </section>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <div class="text-center mb-14"><p class="text-[11px] uppercase tracking-[0.3em] t-muted mb-3">Curated Selection</p><h2 class="t-display text-4xl">The Edit</h2></div>
    <div id="home-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"></div>
  </section>`,

  streetwear: `
  <section class="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
    <div class="grid md:grid-cols-2 gap-6 items-center">
      <div>
        <p class="t-accent font-bold uppercase tracking-[0.3em] text-sm mb-4">Drop 04 — Out Now</p>
        <h1 class="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">Own<br>The<br><span class="t-accent">Street.</span></h1>
        <p class="t-muted mt-6 max-w-sm">Limited runs. Bold cuts. Built for the city and everyone watching.</p>
        <div class="flex gap-3 mt-8">
          <a href="shop.html" class="t-btn px-8 py-4 font-bold uppercase tracking-wide">Shop the drop</a>
          <a href="shop.html?cat=Shoes" class="t-btn-outline px-8 py-4 font-bold uppercase tracking-wide">Kicks</a>
        </div>
      </div>
      <div class="relative"><div class="absolute -inset-2 t-badge"></div><img src="/templates/FashionEcommerce/images/hero.jpg" alt="" class="relative w-full aspect-[4/5] object-cover"></div>
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div class="flex items-end justify-between mb-8 border-b t-line pb-4"><h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter">Latest Heat</h2><a href="shop.html" class="text-sm font-bold uppercase hover:opacity-70">View all →</a></div>
    <div id="home-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-4"></div>
  </section>`,

  playful: `
  <section class="px-4 sm:px-6 py-10">
    <div class="max-w-6xl mx-auto bg-gradient-to-br from-fuchsia-400 via-rose-400 to-orange-300 rounded-[2.5rem] p-8 md:p-14 grid md:grid-cols-2 gap-8 items-center text-white overflow-hidden">
      <div>
        <span class="inline-block bg-white/25 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold mb-5">New season ✨</span>
        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight">Look good,<br>feel amazing.</h1>
        <p class="text-white/90 mt-5 text-lg max-w-sm">Colorful drops and everyday faves to brighten your wardrobe.</p>
        <a href="shop.html" class="mt-8 inline-block bg-white text-fuchsia-600 font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-transform">Shop now →</a>
      </div>
      <img src="/templates/FashionEcommerce/images/hero.jpg" alt="" class="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl">
    </div>
  </section>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div class="flex items-center justify-between mb-8"><h2 class="text-3xl font-extrabold">Fresh picks 🎉</h2><a href="shop.html" class="text-sm font-bold t-accent hover:underline">See all</a></div>
    <div id="home-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-5"></div>
  </section>`,

  minimal: `
  <section class="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
    <p class="text-xs uppercase tracking-[0.3em] t-muted mb-8">Autumn / Winter 2026</p>
    <h1 class="text-4xl md:text-5xl font-normal leading-tight max-w-2xl mx-auto">Considered essentials for a calmer wardrobe.</h1>
    <a href="shop.html" class="mt-10 inline-block text-xs uppercase tracking-[0.25em] border-b border-current pb-1 hover:opacity-60">Shop the collection</a>
  </section>
  <img src="/templates/FashionEcommerce/images/hero.jpg" alt="" class="w-full h-[60vh] object-cover">
  <section class="max-w-5xl mx-auto px-6 py-20">
    <div class="flex items-baseline justify-between mb-12"><h2 class="text-xs uppercase tracking-[0.3em] t-muted">Selected</h2><a href="shop.html" class="text-xs uppercase tracking-[0.2em] t-muted hover:opacity-70">All products</a></div>
    <div id="home-grid" class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14"></div>
  </section>`,
};

/* ---------------- shared inner-page bodies ---------------- */
const SHOP_BODY = `
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <h1 id="shop-title" class="t-display text-3xl font-bold mb-2">Shop All</h1>
    <p id="shop-count" class="t-muted mb-8"></p>
    <div id="filters" class="flex flex-wrap gap-2 mb-6"></div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-y t-line py-4 mb-8">
      <div class="flex items-center gap-3">
        <label for="price" class="text-sm font-medium whitespace-nowrap">Max price</label>
        <input id="price" type="range" min="0" max="100" value="100" class="w-40">
        <span id="price-label" class="text-sm t-muted tabular-nums w-16"></span>
        <button id="price-reset" class="hidden text-xs t-muted underline hover:opacity-70">reset</button>
      </div>
      <div class="flex items-center gap-2">
        <label for="sort" class="text-sm font-medium">Sort</label>
        <select id="sort" class="t-input text-sm px-3 py-2">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>
    </div>
    <div id="product-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"></div>
    <p id="empty" class="hidden text-center t-muted py-20">No products found in this category.</p>
  </main>`;

const PRODUCT_BODY = `
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <nav class="text-sm t-muted mb-6"><a href="index.html" class="hover:underline">Home</a> / <a href="shop.html" class="hover:underline">Shop</a> / <span id="crumb"></span></nav>
    <div id="detail"></div>
    <section class="mt-20">
      <h2 class="t-display text-2xl font-bold mb-8">You may also like</h2>
      <div id="related" class="grid grid-cols-2 lg:grid-cols-4 gap-5"></div>
    </section>
  </main>`;

const CART_BODY = `
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="t-display text-3xl font-bold mb-8">Your Cart</h1>
    <div id="cart-wrap" class="grid lg:grid-cols-3 gap-8"></div>
  </main>`;

const WISHLIST_BODY = `
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="t-display text-3xl font-bold mb-2">Your Wishlist</h1>
    <p id="wish-count" class="t-muted mb-8"></p>
    <div id="wish-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"></div>
    <div id="wish-empty" class="hidden text-center py-20">
      <p class="text-xl font-medium mb-2">Your wishlist is empty</p>
      <p class="t-muted mb-6">Tap the heart on any product to save it here.</p>
      <a href="shop.html" class="t-btn inline-block px-7 py-3 font-medium">Browse Products</a>
    </div>
  </main>`;

const field = (id, label, attrs = "", optional = false) => `
  <div>
    <label class="block text-sm font-medium mb-1.5" for="${id}">${label}${optional ? ` <span class="t-muted font-normal">(optional)</span>` : ""}</label>
    <input id="${id}" name="${id}" ${attrs} class="t-input w-full px-3 py-2.5 text-sm">
    ${optional ? "" : `<p class="t-err text-xs mt-1"></p>`}
  </div>`;

const CHECKOUT_BODY = `
  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <nav class="text-sm t-muted mb-6"><a href="cart.html" class="hover:underline">Cart</a> / <span>Checkout</span></nav>
    <h1 class="t-display text-3xl font-bold mb-8">Checkout</h1>

    <div id="empty-state" class="hidden text-center py-20">
      <p class="text-xl font-medium mb-2">Your cart is empty</p>
      <p class="t-muted mb-6">Add some items before checking out.</p>
      <a href="shop.html" class="t-btn inline-block px-7 py-3 font-medium">Start Shopping</a>
    </div>

    <div id="confirmation" class="hidden text-center py-20">
      <div class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
      </div>
      <h2 class="t-display text-2xl font-bold mb-2">Order confirmed!</h2>
      <p class="t-muted mb-1">Thank you for your purchase.</p>
      <p class="t-muted mb-6">Your order number is <span id="order-no" class="font-semibold t-accent"></span>.</p>
      <a href="index.html" class="t-btn inline-block px-7 py-3 font-medium">Back to Home</a>
    </div>

    <form id="checkout-form" class="grid lg:grid-cols-3 gap-8" novalidate>
      <div class="lg:col-span-2 space-y-8">
        <section class="t-card p-6">
          <h2 class="text-lg font-semibold mb-5">Contact</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">${field("email", "Email", 'type="email" autocomplete="email" required placeholder="you@example.com"').trim()}</div>
            <div class="sm:col-span-2">${field("phone", "Phone", 'type="tel" autocomplete="tel" required placeholder="(555) 123-4567"').trim()}</div>
          </div>
        </section>

        <section class="t-card p-6">
          <h2 class="text-lg font-semibold mb-5">Shipping Address</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            ${field("firstName", "First name", 'autocomplete="given-name" required')}
            ${field("lastName", "Last name", 'autocomplete="family-name" required')}
            <div class="sm:col-span-2">${field("address", "Address", 'autocomplete="street-address" required placeholder="123 Main St"').trim()}</div>
            <div class="sm:col-span-2">${field("apt", "Apartment, suite, etc.", 'autocomplete="address-line2"', true).trim()}</div>
            ${field("city", "City", 'autocomplete="address-level2" required')}
            ${field("state", "State / Province", 'autocomplete="address-level1" required')}
            ${field("zip", "ZIP / Postal code", 'autocomplete="postal-code" required placeholder="10001"')}
            <div>
              <label class="block text-sm font-medium mb-1.5" for="country">Country</label>
              <select id="country" name="country" autocomplete="country-name" required class="t-input w-full px-3 py-2.5 text-sm">
                <option value="">Select…</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>India</option><option>Other</option>
              </select>
              <p class="t-err text-xs mt-1"></p>
            </div>
          </div>
          <h3 class="text-sm font-semibold mt-6 mb-3">Shipping method</h3>
          <div class="space-y-2">
            <label class="t-radio flex items-center justify-between p-3 cursor-pointer">
              <span class="flex items-center gap-3 text-sm"><input type="radio" name="ship" value="standard" checked onchange="recalc()"><span><span class="font-medium">Standard</span> · 5–7 business days</span></span>
              <span class="text-sm font-medium" id="ship-std-label">$9.99</span>
            </label>
            <label class="t-radio flex items-center justify-between p-3 cursor-pointer">
              <span class="flex items-center gap-3 text-sm"><input type="radio" name="ship" value="express" onchange="recalc()"><span><span class="font-medium">Express</span> · 2–3 business days</span></span>
              <span class="text-sm font-medium">$19.99</span>
            </label>
          </div>
        </section>

        <section class="t-card p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-semibold">Payment</h2>
            <span class="text-xs t-muted">Secure &amp; encrypted</span>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">${field("cardName", "Name on card", 'autocomplete="cc-name" required').trim()}</div>
            <div class="sm:col-span-2">${field("cardNumber", "Card number", 'inputmode="numeric" autocomplete="cc-number" required placeholder="1234 5678 9012 3456" maxlength="19"').trim()}</div>
            ${field("expiry", "Expiry (MM/YY)", 'inputmode="numeric" autocomplete="cc-exp" required placeholder="MM/YY" maxlength="5"')}
            ${field("cvc", "CVC", 'inputmode="numeric" autocomplete="cc-csc" required placeholder="123" maxlength="4"')}
          </div>
          <p class="text-xs t-muted mt-4">Demo only — do not enter a real card number.</p>
        </section>
      </div>

      <aside class="t-card p-6 h-fit lg:sticky lg:top-24">
        <h2 class="text-lg font-semibold mb-5">Order Summary</h2>
        <div id="summary-items" class="space-y-4 max-h-72 overflow-y-auto pr-1"></div>
        <div class="space-y-3 text-sm border-t t-line mt-5 pt-5">
          <div class="flex justify-between"><span class="t-muted">Subtotal</span><span id="sum-subtotal"></span></div>
          <div class="flex justify-between"><span class="t-muted">Shipping</span><span id="sum-shipping"></span></div>
          <div class="flex justify-between"><span class="t-muted">Tax (8%)</span><span id="sum-tax"></span></div>
        </div>
        <div class="flex justify-between font-semibold text-lg border-t t-line mt-4 pt-4"><span>Total</span><span id="sum-total"></span></div>
        <button type="submit" class="t-btn w-full py-3.5 font-medium mt-6">Place Order</button>
        <a href="cart.html" class="block text-center text-sm t-muted hover:opacity-70 mt-4">Back to cart</a>
      </aside>
    </form>
  </main>`;

const PAGES = [
  { file: "index.html",    title: t => `${t.label} — LUXE`,  body: t => HOME[t.folder], scripts: ["/templates/FashionEcommerce/js/page-home.js"] },
  { file: "shop.html",     title: () => "Shop — LUXE",       body: () => SHOP_BODY,     scripts: ["/templates/FashionEcommerce/js/page-shop.js"] },
  { file: "product.html",  title: () => "Product — LUXE",    body: () => PRODUCT_BODY,  scripts: ["/templates/FashionEcommerce/js/page-product.js"] },
  { file: "cart.html",     title: () => "Cart — LUXE",       body: () => CART_BODY,     scripts: ["/templates/FashionEcommerce/js/page-cart.js"] },
  { file: "checkout.html", title: () => "Checkout — LUXE",   body: () => CHECKOUT_BODY, scripts: ["/templates/FashionEcommerce/js/page-checkout.js"] },
  { file: "wishlist.html", title: () => "Wishlist — LUXE",   body: () => WISHLIST_BODY, scripts: ["/templates/FashionEcommerce/js/page-wishlist.js"] },
];

let count = 0;
for (const t of THEMES) {
  const dir = path.join(OUT, t.folder);
  fs.mkdirSync(dir, { recursive: true });
  for (const pg of PAGES) {
    const html = shell(t, pg.title(t), pg.body(t), pg.scripts);
    fs.writeFileSync(path.join(dir, pg.file), html);
    count++;
  }
}
console.log(`Generated ${count} pages across ${THEMES.length} themes in templates/`);

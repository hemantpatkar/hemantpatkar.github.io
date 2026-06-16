# Maison Decor — Static Home Decor Website

A fast, fully static **home decor + interior styling** website. No build step, no
framework, no dependencies to install — just open `index.html` in a browser, or
drop the folder on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

It reuses the design language of the reference portfolio site
(`hemantpatkar.github.io`) — sticky blurred nav, light/dark theme via CSS tokens,
scroll-reveal animations, and a Web3Forms contact form — restyled with a warm,
earthy palette and elegant serif headings suited to a decor brand.

> **Brand and content are placeholders** ("Maison Decor"). Everything is easy to
> rename — see [Customizing](#customizing) below.

---

## Pages

| File            | Purpose                                                        |
| --------------- | ------------------------------------------------------------- |
| `index.html`    | Home — hero, categories, featured products, services, stats, testimonials carousel, newsletter |
| `products.html` | Shop — filterable product grid (by room), quick-view, add-to-cart, wishlist |
| `product.html`  | Product detail (`product.html?id=…`) — gallery, variants, related items; rendered from the catalog |
| `services.html` | Interior styling services, process, pricing                   |
| `booking.html`  | Consultation booking form (date/time, Web3Forms)             |
| `gallery.html`  | Project gallery with click-to-zoom lightbox                   |
| `about.html`    | Brand story, values, team                                     |
| `contact.html`  | Contact form (Web3Forms), studio info, map embed             |
| `404.html`      | Friendly not-found page                                       |

### Shop features (all client-side, no backend)
- **Cart** — a slide-out drawer with quantities + subtotal, persisted in
  `localStorage`. The bag icon (with count badge) is injected into the nav on
  every page. Checkout is a demo (shows a message) — wire it to Stripe / Snipcart
  / Gumroad to actually sell.
- **Product catalog** — a single source of truth in `js/products.js`. Add or edit
  products there; the shop grid, product pages, quick-view, related items and cart
  all read from it. Each product `id` is the slug of its name, so the static
  "Add" buttons resolve automatically.
- **Quick-view** — hover a product → "Quick view" opens a modal preview.
- **Promo bar** — dismissible top bar (remembers dismissal); edit the text in
  `initPromoBar()` in `js/main.js`.

### PWA / offline
`manifest.webmanifest` + `sw.js` make the site installable and offline-capable.
The service worker only registers over **http(s)** (not `file://`), so test it
via a local server. It caches pages network-first and assets cache-first,
including the Google Fonts / Font Awesome CDN responses at runtime — so after the
first online visit it also works offline. Bump `VERSION` in `sw.js` when you
change assets to force an update.

### SEO
`sitemap.xml`, `robots.txt`, and JSON-LD structured data are included
(`HomeGoodsStore` on the home page, `Product` injected on each product page).
After deploying, replace `https://your-domain.example/` in `sitemap.xml` and
`robots.txt` with your real domain.

## Project structure

```
Home decor/
├── index.html, products.html, product.html, services.html,
│   booking.html, gallery.html, about.html, contact.html, 404.html
├── css/
│   ├── styles.css          # All base styling + theme tokens
│   ├── themes.css          # Alternate swappable themes
│   └── fonts.css           # Self-hosted @font-face declarations
├── js/
│   ├── products.js         # Product catalog (data) — load before main.js
│   └── main.js             # Theme, nav, cart, quick-view, PDP, forms, carousel, PWA…
├── assets/img/             # Photos (Pexels) + favicon + icon-512
├── assets/fonts/           # Self-hosted .woff2 (Inter, Playfair, Cormorant, Fraunces, Poppins)
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker (offline)
├── sitemap.xml
└── robots.txt
```

## Running locally

- **Easiest:** double-click `index.html` — it works straight from `file://`.
- **Recommended (so the map embed and fonts behave like production):** serve over
  HTTP from this folder:

  ```bash
  # Python 3
  python -m http.server 8000
  # then open http://localhost:8000
  ```

  ```powershell
  # Or with Node, if installed
  npx serve .
  ```

> Note: Fonts are **self-hosted** (`assets/fonts/`), so headings render offline.
> Only **Font Awesome** icons still load from a CDN (cdnjs) — self-host those too
> if you want zero third-party requests.

---

## Customizing

### 1. Rename the brand
The name appears in the nav, footer, page titles and copy. Find-and-replace
**`Maison Decor`** across the `.html` files, and change the monogram letter
**`M`** in:
- every `<span class="brand-mark">M</span>` (nav + footer)
- `assets/img/favicon.svg`

### 2. Switch template themes
The site ships with **five swappable themes**, same layouts, different look:
**Boutique** (warm terracotta, default), **Modern Minimal**, **Luxe Dark**,
**Scandi / Natural**, and **Bold Editorial**. Each also has its own light/dark
variant (the moon/sun button still works within any theme).

- **Live preview:** click the floating swatch button (bottom-left) on any page,
  pick a theme — your choice is remembered across pages via `localStorage`.
- **Hard-set one site-wide:** add the attribute to the `<html>` tag on every
  page, e.g. `<html lang="en" data-theme="scandi">` (valid ids: `minimal`,
  `luxe`, `scandi`, `editorial`; omit the attribute for Boutique).
- **Edit / add a theme:** themes live in `css/themes.css`, each a block of CSS
  variables under `html[data-theme="…"]` (plus a `.dark-mode` variant). Copy a
  block to create your own, then add it to the `THEMES` array in `js/main.js` so
  it appears in the picker.

To remove the picker entirely, delete the `initThemePicker()` call in
`js/main.js`.

### 3. Change the colours
All colours are CSS variables at the top of `css/styles.css`. Edit the `:root`
(light) and `.dark-mode` (dark) blocks — the whole site updates. Key tokens:

```css
--accent:        #bf6240;   /* terracotta — buttons, links, highlights */
--accent-strong: #a3502f;   /* hover / gradient end */
--gold:          #c9a35b;   /* star ratings, small accents */
--bg / --surface / --heading / --text ...
```

Also update `<meta name="theme-color" content="#bf6240">` in each page if you
change the accent.

### 4. Swap in your own photos
The site now ships with **real photos** in `assets/img/` (`*.jpg`) — royalty-free
stock from [Pexels](https://www.pexels.com) (free for commercial use, no
attribution required). Replace any of them with your own product/room shots by
overwriting the file of the same name — no code changes needed. References use
two patterns:
  - `<img src="assets/img/hero.jpg" ...>` (hero / feature / about / studio)
  - `style="background-image:url('assets/img/prod-01.jpg')"` (cards, tiles, gallery)

Product images are also listed in `js/products.js` (the `img:` field) — update
there if you rename files. Recommended sizes: hero ~800×1000, product/category
800×800 (square), gallery 700–1000px. Compress to keep the site fast.
`favicon.svg`, `icon-512.svg` and `og-image.svg` remain SVG (brand marks).

### 5. Edit products
Each product is one `<article class="product-card" data-category="…">` block in
`products.html`. Copy a block to add one; the `data-category` value must match a
filter button's `data-filter` (`living`, `lighting`, `textiles`, `wall`,
`dining`, `outdoor`). The home page shows four featured cards in `index.html`.

> The cart and wishlist are **front-end demos** (they show a toast and a count).
> Wire them to a real store/checkout if you need e-commerce.

### 6. Make the contact form work
The form uses [Web3Forms](https://web3forms.com) (free, no backend):
1. Get a free access key at web3forms.com.
2. In `contact.html`, replace `YOUR_ACCESS_KEY_HERE` in:
   `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">`.

Until a real key is set, the form shows a friendly "not configured yet" message
instead of submitting. The newsletter form on the home page is a demo (shows a
toast); point it at your email provider when ready.

### 7. Update contact details & map
Edit the address, email, phone and hours in the `info-card` of `contact.html`.
The map is an OpenStreetMap embed — change the `bbox` coordinates in the
`<iframe src="…">`, or paste a Google Maps embed iframe instead.

---

## Deploying

**GitHub Pages**
1. Push this folder to a GitHub repo.
2. Settings → Pages → deploy from the `main` branch, root (`/`).

**Netlify / Vercel / Cloudflare Pages**
- Drag-and-drop the folder, or connect the repo. No build command needed —
  publish directory is the project root.

After deploying, update the `Sitemap:` line in `robots.txt` and the `og:image` /
canonical URLs if you want richer SEO and social cards.

---

## License / credits
Full asset licensing, attribution and a **pre-launch legal checklist** are in
**[CREDITS.md](CREDITS.md)**. In short:
- Photos: [Pexels](https://www.pexels.com/license/) — free for commercial use, no attribution required (don't resell unaltered; check for any brands/people/artwork shown).
- Fonts: Inter, Playfair Display, Cormorant Garamond, Fraunces, Poppins — SIL OFL (free, commercial). ✅ Self-hosted in `assets/fonts/` via `css/fonts.css` (no Google CDN call).
- Icons: [Font Awesome Free](https://fontawesome.com/license/free) — CC BY 4.0 (attribution kept in CREDITS.md) / SIL OFL / MIT.
- All copy, products, photos, reviews and contact details are placeholder demo content — replace with accurate info before going live.

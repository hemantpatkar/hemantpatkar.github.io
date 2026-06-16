# Blush Beauty Salon — Static Website

A clean, responsive marketing site for a fictional beauty salon, built as **plain
static HTML/CSS/JS** — no build step, no framework, no dependencies to install.
Just open the files in a browser.

It ships with **three interchangeable design templates** for the same salon. A
landing page at the root lets you preview them and pick one.

## Templates

| Folder | Name | Look | Signature layout | Fonts |
|--------|------|------|------------------|-------|
| `template-blush/` | **Blush Rose** | Soft, romantic, light | Split two-column hero + horizontal service strip | Playfair Display · Poppins |
| `template-gold/`  | **Gold Luxe**  | Dark, luxurious | Full-bleed image hero + overlay nav | Cormorant Garamond · Jost |
| `template-sage/`  | **Sage Spa**   | Calm, natural, light | Asymmetric organic hero + sidebar booking | Fraunces · Inter |

Each template is a complete site with the **same four pages** and identical salon
content (services, prices, team, testimonials, hours) — only the design differs:

| Page | Contents |
|------|----------|
| `index.html` | Home — hero, services preview, why-us, stats, testimonials, CTA |
| `services.html` | Services & Pricing — full treatment menu, process, FAQ |
| `about.html` | About + Gallery — story, values, team, photo gallery |
| `contact.html` | Contact & Booking — info, hours, booking form, map |

Every template has its own light **and** dark mode (toggle in the header, saved to
`localStorage` under a per-template key so they don't clash).

## Structure

```
Blush Beauty Salon/
├── index.html              # template picker / landing page
├── template-blush/         # Blush Rose
│   ├── index.html · services.html · about.html · contact.html
│   ├── css/styles.css
│   └── js/main.js
├── template-gold/          # Gold Luxe  (same file layout)
├── template-sage/          # Sage Spa   (same file layout)
├── assets/                 # SHARED across all templates
│   ├── favicon.svg
│   ├── fonts/              # self-hosted web fonts + per-template .css
│   ├── fontawesome/        # Font Awesome 6.5.2 (css + webfonts)
│   └── img/                # all photography (local .jpg)
├── robots.txt
└── README.md
```

> Heavy assets (fonts, icons, images) live once in the shared `assets/` folder and
> each template references them via `../assets/…`, so the project stays ~3 MB instead
> of tripling. Keep `assets/` alongside whichever template(s) you publish.

## Running it

Either way works since it's fully static:

- **Double-click** `index.html` to open the picker, **or**
- Serve the folder for cleaner local URLs:
  ```bash
  # Python 3
  python -m http.server 8080
  # then visit http://localhost:8080
  ```

## Picking / publishing one template

To go live with just one design, publish that template's folder **plus** the shared
`assets/` folder. For a single-folder site at the root, move the chosen template's
files up one level and rewrite its `../assets/` references to `assets/` — just ask
and this can be done for you.

## Features (all templates)

- Fully responsive (desktop / tablet / mobile) with a mobile hamburger menu
- Light **and** dark theme (toggle in the header, saved to `localStorage`)
- Scroll-reveal animations, sticky/overlay header, back-to-top button
- Accessible markup (labels, ARIA, semantic landmarks)
- Distinct palette + typography per template

## Customising

- **Brand & colours:** edit the CSS variables under `:root` (and the dark/light
  override) at the top of each template's `css/styles.css`.
- **Text & prices:** edit the relevant `.html` file directly.
- **Images:** photos live in `assets/img/`. Replace any file with your own (keep the
  same filename, or update the `src` in the relevant `.html`).
- **Booking form:** the form in `contact.html` is a front-end demo. Wire it up to a
  service such as [Formspree](https://formspree.io), Netlify Forms, or your booking
  system to receive real submissions.

## Fully offline

This site has **no external dependencies** — every font, icon, and image is bundled
locally, so it works with no internet connection at all:

```
assets/
├── fonts/              # self-hosted .woff2 + per-template css:
│                       #   blush.css (Playfair Display + Poppins)
│                       #   gold.css  (Cormorant Garamond + Jost)
│                       #   sage.css  (Fraunces + Inter)
├── fontawesome/        # Font Awesome 6.5.2 (css + webfonts)
└── img/                # all photography (local .jpg files)
```

The only outbound links are user-initiated navigations — the **WhatsApp** link and
the **"Get directions"** link on the contact page — which simply open in a new tab
when clicked (online). The contact map is a styled, offline placeholder rather than
a live embed.

### Bundled assets & licences

- **Playfair Display, Poppins, Cormorant Garamond, Jost, Fraunces, Inter** — Google Fonts (SIL Open Font License 1.1), self-hosted; license text bundled in `assets/fonts/licenses/`
- **Font Awesome 6.5.2 Free** — [Font Awesome Free License](https://fontawesome.com/license/free) (icons CC BY 4.0, fonts SIL OFL); license bundled at `assets/fontawesome/LICENSE.txt`
- **Photography** — sourced from [Unsplash](https://unsplash.com) (Unsplash License)

> **📋 See [`CREDITS.md`](CREDITS.md) for full license details and an important
> pre‑publish checklist.** Licensing is clear and compliant, but two items must be
> handled before launching this as a real business site: (1) the placeholder photos
> of **identifiable people** (staff/clients) carry no model release — replace them
> with your own; and (2) the **testimonials, ratings and stats are invented** —
> publishing fake reviews for a real business is deceptive advertising and is illegal
> in many regions, so replace them with genuine data.

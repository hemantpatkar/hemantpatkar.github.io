# Wanderlust — Tours & Travels Website

A modern, vibrant, fully static travel website built with **HTML + Tailwind CSS (CDN)**. No build step required.

## Pages

| File | Page |
|------|------|
| `index.html` | Home / Landing — hero, search bar, stats, featured packages, why-us, CTA |
| `packages.html` | Tour Packages — filterable grid (Beach / Mountain / City / Culture) |
| `destinations.html` | Destinations — featured + grid of popular spots |
| `about.html` | About + Contact — story, values, testimonials, contact form |

## Structure

```
.
├── index.html
├── packages.html
├── destinations.html
├── about.html
├── css/
│   └── style.css      # custom styles (animations, gradients, hovers)
└── js/
    └── main.js        # mobile menu, scroll nav, reveal animations, form, filters
```

## Running it

It's static — just open `index.html` in a browser. For best results (so relative paths and animations behave), serve it locally:

```bash
# Python
python -m http.server 8000

# Node
npx serve
```

Then visit http://localhost:8000

## Notes / next steps

- **Images** load from Unsplash via URL. Swap them for your own under an `images/` folder for production.
- The **contact & newsletter forms** are front-end only (demo). Wire them to a backend or a service like Formspree/Netlify Forms to actually receive submissions.
- Tailwind uses the **Play CDN** (great for prototyping). For production, install Tailwind via the CLI/PostCSS to get a smaller, purged stylesheet.
- Icons: [Remix Icon](https://remixicon.com/) · Font: Poppins (Google Fonts).

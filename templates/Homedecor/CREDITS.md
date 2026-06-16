# Credits & Licensing

A record of every third-party asset used in this site, its license, and what you
need to do (if anything) before using it commercially. **None of these require a
paid license**, but a few have conditions worth knowing.

---

## 1. Photography — Pexels (free, commercial use OK)

All photos in `assets/img/*.jpg` are from **[Pexels](https://www.pexels.com)** and
covered by the **[Pexels License](https://www.pexels.com/license/)**:

- ✅ Free for **commercial and personal** use.
- ✅ **No attribution required** (appreciated, listed below anyway).
- ✅ You may modify them.
- ⚠️ You may **not** sell unaltered copies (e.g. as stock photos, prints or
  posters). Using them as website imagery is fine.
- ⚠️ Pexels does **not** grant rights to any **trademarks, logos, brands,
  identifiable people, or copyrighted artwork** that happen to appear in a photo.
  If a shot contains a recognisable logo, person, or piece of wall art, getting
  the relevant release/permission is your responsibility.

### Photo manifest (file → Pexels photo)

| File | Pexels photo |
|------|--------------|
| prod-01.jpg | https://www.pexels.com/photo/7119222/ |
| prod-02.jpg | https://www.pexels.com/photo/18764952/ |
| prod-03.jpg | https://www.pexels.com/photo/7885120/ |
| prod-04.jpg | https://www.pexels.com/photo/5978722/ |
| prod-05.jpg | https://www.pexels.com/photo/5598305/ |
| prod-06.jpg | https://www.pexels.com/photo/6053887/ |
| prod-07.jpg | https://www.pexels.com/photo/30324277/ |
| prod-08.jpg | https://www.pexels.com/photo/3847482/ |
| prod-09.jpg | https://www.pexels.com/photo/15269290/ |
| prod-10.jpg | https://www.pexels.com/photo/1765005/ |
| prod-11.jpg | https://www.pexels.com/photo/35920773/ |
| prod-12.jpg | https://www.pexels.com/photo/7737412/ |
| cat-living.jpg | https://www.pexels.com/photo/29012619/ |
| cat-lighting.jpg | https://www.pexels.com/photo/35392792/ |
| cat-textiles.jpg | https://www.pexels.com/photo/7218188/ |
| cat-wall.jpg | https://www.pexels.com/photo/8521987/ |
| cat-dining.jpg | https://www.pexels.com/photo/14598479/ |
| cat-outdoor.jpg | https://www.pexels.com/photo/32960959/ |
| hero.jpg | https://www.pexels.com/photo/30386991/ |
| about.jpg | https://www.pexels.com/photo/10903296/ |
| studio.jpg | https://www.pexels.com/photo/19866414/ |
| gallery-01.jpg | https://www.pexels.com/photo/8146330/ |
| gallery-02.jpg | https://www.pexels.com/photo/10071390/ |
| gallery-03.jpg | https://www.pexels.com/photo/5825409/ |
| gallery-04.jpg | https://www.pexels.com/photo/32053089/ |
| gallery-05.jpg | https://www.pexels.com/photo/34574606/ |
| gallery-06.jpg | https://www.pexels.com/photo/4119832/ |
| gallery-07.jpg | https://www.pexels.com/photo/20418771/ |
| gallery-08.jpg | https://www.pexels.com/photo/6748972/ |

> **Honesty note (not a license issue, but important):** these are stock photos,
> not pictures of actual inventory. If you sell real products, replace product
> shots with photos of the items you actually ship — selling against a stock
> photo of a *different* item can be misleading to customers and to platforms.

`favicon.svg`, `icon-512.svg` and `og-image.svg` are original brand marks created
for this project — no third-party rights.

---

## 2. Fonts — self-hosted (SIL Open Font License 1.1)

Inter, Playfair Display, Cormorant Garamond, Fraunces and Poppins are all under
the **SIL Open Font License 1.1** — free for commercial use, including web
embedding. No attribution required.

✅ **Self-hosted — no third-party request.** The `.woff2` files live in
`assets/fonts/` (latin subset) and are declared in `css/fonts.css`. The site no
longer calls the Google Fonts CDN, so there's **no IP leak to Google and no
GDPR concern** from fonts. (To regenerate or add weights, re-run a Google Fonts
CSS request with a modern-browser User-Agent and drop the `.woff2` files in
`assets/fonts/` with matching `@font-face` rules.)

---

## 3. Icons — Font Awesome Free 6 (via cdnjs)

Loaded from `cdnjs.cloudflare.com`. **[Font Awesome Free license](https://fontawesome.com/license/free):**

- Icons: **CC BY 4.0** — free for commercial use; *attribution is technically
  required*. A line in this file (and the README) satisfies it.
- Fonts: SIL OFL 1.1. Code: MIT.

Attribution: *Icons by [Font Awesome](https://fontawesome.com), CC BY 4.0.*

---

## 4. Services & embeds

- **OpenStreetMap** map embed (contact page) — map data © OpenStreetMap
  contributors, **ODbL**. The embed shows its own attribution; keep it visible.
- **Web3Forms** (`api.web3forms.com`) — contact/booking form backend; governed by
  their Terms when you create an account/key. No content-license impact.
- Social links in the footer point to placeholder URLs — set them to your real
  accounts (or remove).

---

## ✅ Before you go live — quick legal checklist

1. **Brand name** — "Maison Decor" is a placeholder. Check it isn't an existing
   trademark in your market before trading under it.
2. **Product photos** — swap stock shots for photos of the items you actually
   sell (see honesty note above).
3. **Check photos for embedded IP** — make sure no shot shows a recognisable
   brand logo, identifiable person, or copyrighted artwork you don't have rights
   to (watch the framed-art / wall-decor shots in particular).
4. **Fonts & GDPR** — ✅ done: fonts are self-hosted (`assets/fonts/`), no Google
   CDN call. (Font Awesome icons still load from cdnjs — self-host those too if
   you want zero third-party requests.)
5. **Privacy/cookies** — `localStorage` (cart, theme) is first-party and usually
   fine without a banner; add a privacy policy if you enable analytics or the
   Google Fonts CDN for EU traffic.
6. **Domain** — replace `your-domain.example` in `sitemap.xml` and `robots.txt`.
7. **Demo copy** — addresses, phone, prices, reviews and stats are placeholders;
   replace with real, accurate details (false reviews/claims can breach
   consumer-protection rules).

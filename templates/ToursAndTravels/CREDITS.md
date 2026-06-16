# Credits, Licenses & Compliance Notes

This project uses only third-party resources that are free for commercial use.
This file documents each one and flags items to address before publishing a
real, live business website.

## Third-party libraries & assets

| Asset | Source | License | Commercial use | Attribution required |
|-------|--------|---------|----------------|----------------------|
| Tailwind CSS | https://tailwindcss.com | MIT | Yes | No |
| Remix Icon | https://remixicon.com | Apache License 2.0 | Yes | No (appreciated) |
| Google Fonts (Poppins, Inter, Playfair Display, Bebas Neue, Barlow, Cormorant Garamond, Jost, Plus Jakarta Sans) | https://fonts.google.com | SIL Open Font License 1.1 / Apache 2.0 | Yes | No |
| Photos | https://unsplash.com | Unsplash License | Yes | No (appreciated) |

### Unsplash License summary
Free to use for commercial and non-commercial purposes, no permission or
attribution needed. You may NOT: (1) sell unaltered copies of a photo, or
(2) build a competing/replacement photo service using Unsplash photos.
Unsplash does not guarantee model or property releases — do not imply that any
person, brand, or landmark shown endorses your business.

## ⚠️ Action items before going live with a real business

1. **Replace placeholder people photos.** The testimonial avatars (previously
   `i.pravatar.cc`) show real people and are not licensed for endorsement use.
   Use real customer photos (with consent) or non-photographic avatars.

2. **Make all claims true.** Testimonials, statistics ("15K+ travelers",
   "Est. 2014", "98% return guests", "100% safe returns", ratings) are
   placeholder content. Fabricated reviews/stats can violate advertising and
   consumer-protection rules (e.g. India's ASCI guidelines & Consumer
   Protection Act 2019; FTC in the US; ASA in the UK). Only publish what is real.

3. **Self-host images for production.** Download the Unsplash photos and serve
   them from your own `images/` folder instead of hot-linking
   `images.unsplash.com` (more reliable and the recommended approach).

4. **Compile Tailwind for production.** The Tailwind Play CDN
   (`cdn.tailwindcss.com`) is for prototyping only and warns against production
   use. Install via the Tailwind CLI/PostCSS for a smaller, purged stylesheet.

5. **Check brand names.** "Wanderlust", "Voyage", "Summit", "Élan Voyages",
   and "TravelKit" are placeholders. Run a trademark search before using one
   commercially.

6. **Add the usual legal pages.** A live site collecting contact-form data
   needs a Privacy Policy and Terms of Service, and (depending on region) a
   cookie/consent notice.

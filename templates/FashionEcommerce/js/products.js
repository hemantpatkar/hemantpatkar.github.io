// Product catalog for the LUXE fashion storefront.
//
// You can edit SEED_PRODUCTS by hand, OR manage products visually in admin.html
// (the admin saves a working copy to localStorage for live preview, and can
// export a drop-in replacement for this file when you're ready to publish).

const SEED_PRODUCTS = [
  { "id": 1,  "name": "Classic White Tee",      "category": "Men",         "price": 29,  "image": "/images/tee.jpg",        "rating": 4.5, "desc": "A wardrobe staple. Soft combed cotton with a relaxed fit and reinforced collar." },
  { "id": 2,  "name": "Slim Fit Denim Jeans",   "category": "Men",         "price": 79,  "image": "/images/jeans.jpg",      "rating": 4.7, "desc": "Mid-rise slim jeans in stretch denim with a clean, modern silhouette." },
  { "id": 3,  "name": "Wool Blend Overcoat",    "category": "Men",         "price": 189, "image": "/images/coat.jpg",       "rating": 4.8, "desc": "Tailored single-breasted overcoat in a warm wool blend. Timeless and sharp." },
  { "id": 4,  "name": "Floral Summer Dress",    "category": "Women",       "price": 89,  "image": "/images/dress.jpg",      "rating": 4.6, "desc": "Lightweight floral midi dress with a flattering wrap waist and flowing hem." },
  { "id": 5,  "name": "Fringed Knit Poncho",    "category": "Women",       "price": 64,  "image": "/images/cardigan.jpg",   "rating": 4.4, "desc": "Cozy open-knit poncho with a tasseled hem. Perfect for layering year-round." },
  { "id": 6,  "name": "High-Waist Trousers",    "category": "Women",       "price": 72,  "image": "/images/trousers.jpg",   "rating": 4.5, "desc": "Elegant high-waist trousers with a tapered leg and side pockets." },
  { "id": 7,  "name": "Leather Crossbody Bag",  "category": "Accessories", "price": 119, "image": "/images/bag.jpg",        "rating": 4.9, "desc": "Compact full-grain leather bag with adjustable strap and polished hardware." },
  { "id": 8,  "name": "Round Metal Sunglasses", "category": "Accessories", "price": 45,  "image": "/images/sunglasses.jpg", "rating": 4.3, "desc": "Classic round frames with polarized lenses and a lightweight gold-tone metal frame." },
  { "id": 9,  "name": "Minimalist Watch",       "category": "Accessories", "price": 149, "image": "/images/watch.jpg",      "rating": 4.8, "desc": "Clean dial, genuine leather band, and a slim case. Understated everyday elegance." },
  { "id": 10, "name": "Leather Derby Shoes",    "category": "Shoes",       "price": 59,  "image": "/images/derby.jpg",      "rating": 4.5, "desc": "Polished lace-up derby shoes in smooth leather. A versatile dress-casual staple." },
  { "id": 11, "name": "Suede Chelsea Boots",    "category": "Shoes",       "price": 139, "image": "/images/boots.jpg",      "rating": 4.7, "desc": "Tan leather ankle boots with a side zip and a stacked block heel." },
  { "id": 12, "name": "Pointed Stiletto Heels", "category": "Shoes",       "price": 84,  "image": "/images/heels.jpg",      "rating": 4.4, "desc": "Elegant pointed-toe stiletto pumps in a soft neutral tone — an everyday dress-up essential." }
];

const ADMIN_KEY = "luxe_admin_catalog";

// Use the admin working copy from localStorage if present (live preview of unpublished edits).
let PRODUCTS = SEED_PRODUCTS;
try {
  const saved = JSON.parse(localStorage.getItem(ADMIN_KEY));
  if (saved && Array.isArray(saved.products) && saved.products.length) PRODUCTS = saved.products;
} catch (e) { /* ignore malformed working copy */ }

// Categories derive from the catalog, so new ones appear in the shop filter automatically.
// Preferred ones keep their order; any extras are appended alphabetically.
const PREFERRED_CATEGORIES = ["Women", "Men", "Shoes", "Accessories"];
const presentCats = [...new Set(PRODUCTS.map(p => p.category))];
const CATEGORIES = ["All",
  ...PREFERRED_CATEGORIES.filter(c => presentCats.includes(c)),
  ...presentCats.filter(c => !PREFERRED_CATEGORIES.includes(c)).sort()
];

/* Builds a showcase cover poster for the template pack.
   Output: images/template-poster.svg (self-contained, images embedded as data URIs)
   and _poster.html (inline SVG + Inter stylesheet) used to rasterize a PNG. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMG = path.join(ROOT, "images");

const W = 1600, H = 1000, M = 80;
const SANS = "Inter, ui-sans-serif, system-ui, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

const dataUri = file => {
  const b64 = fs.readFileSync(path.join(IMG, file)).toString("base64");
  return `data:image/jpeg;base64,${b64}`;
};

const THEMES = [
  { name: "Modern",     tag: "Default",    img: "dress.jpg",    panel: "#ffffff", text: "#111111", dot: "#111827", tagc: "#9ca3af", rx: 16, serif: false, upper: false },
  { name: "Luxury",     tag: "Elegant",    img: "coat.jpg",     panel: "#ffffff", text: "#1c1917", dot: "#1c1917", tagc: "#a8a29e", rx: 0,  serif: true,  upper: false },
  { name: "Streetwear", tag: "Bold",       img: "boots.jpg",    panel: "#0a0a0a", text: "#fafafa", dot: "#c4f000", tagc: "#c4f000", rx: 0,  serif: false, upper: true  },
  { name: "Playful",    tag: "Vibrant",    img: "heels.jpg",    panel: "#ffffff", text: "#1f2937", dot: "#db2777", tagc: "#db2777", rx: 28, serif: false, upper: false },
  { name: "Minimal",    tag: "Scandi",     img: "trousers.jpg", panel: "#ffffff", text: "#171717", dot: "#171717", tagc: "#9ca3af", rx: 0,  serif: false, upper: false },
];

const N = THEMES.length;
const gap = 28;
const cardW = Math.round((W - 2 * M - (N - 1) * gap) / N);
const cardY = 300, imgH = 300, panelH = 160, cardH = imgH + panelH;
const panelY = cardY + imgH;

const cards = THEMES.map((t, i) => {
  const x = M + i * (cardW + gap);
  const cx = x + 28;
  return `
  <g>
    <rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${t.rx}" fill="#ffffff" filter="url(#shadow)"/>
    <clipPath id="clip${i}"><rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${t.rx}"/></clipPath>
    <g clip-path="url(#clip${i})">
      <image href="${dataUri(t.img)}" x="${x}" y="${cardY}" width="${cardW}" height="${imgH}" preserveAspectRatio="xMidYMid slice"/>
      <rect x="${x}" y="${panelY}" width="${cardW}" height="${panelH}" fill="${t.panel}"/>
    </g>
    <circle cx="${cx + 4}" cy="${panelY + 46}" r="7" fill="${t.dot}"/>
    <text x="${cx + 22}" y="${panelY + 53}" font-family="${t.serif ? SERIF : SANS}" font-size="26" font-weight="700"
          fill="${t.text}" ${t.upper ? 'letter-spacing="1"' : ""}>${t.upper ? t.name.toUpperCase() : t.name}</text>
    <text x="${cx}" y="${panelY + 92}" font-family="${SANS}" font-size="13" font-weight="600" letter-spacing="2"
          fill="${t.tagc}">${t.tag.toUpperCase()}</text>
    <text x="${cx}" y="${panelY + 124}" font-family="${SANS}" font-size="14" fill="${t.text}" opacity="0.55">6 themed pages</text>
  </g>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${SANS}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbfbf9"/><stop offset="1" stop-color="#f2f1ee"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#000000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- top bar -->
  <text x="${M}" y="92" font-size="40" font-weight="800" letter-spacing="2" fill="#111111">LUXE</text>
  <text x="${W - M}" y="88" text-anchor="end" font-size="19" letter-spacing="1" fill="#9a958d">FASHION E-COMMERCE · TEMPLATE PACK</text>
  <line x1="${M}" y1="120" x2="${W - M}" y2="120" stroke="#e2e0db" stroke-width="1"/>

  <!-- title -->
  <text x="${M}" y="214" font-size="64" font-weight="800" fill="#111111">Five storefronts. One catalog.</text>
  <text x="${M}" y="256" font-size="22" fill="#6b6760">Modern · Luxury · Streetwear · Playful · Minimal — sharing the same products, cart &amp; wishlist.</text>

  ${cards}

  <!-- footer -->
  <line x1="${M}" y1="812" x2="${W - M}" y2="812" stroke="#e2e0db" stroke-width="1"/>
  <text x="${M}" y="858" font-size="20" font-weight="700" fill="#111111">30 pages · 5 themes · 1 shared catalog</text>
  <text x="${M}" y="888" font-size="17" fill="#9a958d">Built with Tailwind CSS · self-hosted Inter · fully static &amp; offline-ready</text>
  <text x="${W - M}" y="875" text-anchor="end" font-size="17" fill="#9a958d">© 2026 LUXE</text>
</svg>`;

fs.writeFileSync(path.join(IMG, "template-poster.svg"), svg);
fs.writeFileSync(path.join(ROOT, "_poster.html"),
  `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/templates/FashionEcommerce/dist/styles.css"><style>html,body{margin:0;padding:0}</style></head><body>${svg}</body></html>`);
console.log("Wrote images/template-poster.svg and _poster.html");

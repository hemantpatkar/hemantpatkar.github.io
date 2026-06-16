/* ============================================================
   Maison Decor — product catalog (single source of truth)
   Used by: cart, product detail pages, quick-view, related items.

   Each product `id` equals the slug of its name, so the existing
   "Add" buttons (which carry data-name) resolve to a product
   automatically — no per-card wiring needed.

   To add a product: copy a block, keep `id` = slugified `name`
   (lowercase, spaces/symbols → "-"), and reuse or add an image
   in assets/img/.
   ============================================================ */
window.PRODUCTS = [
    {
        id: "terracotta-ceramic-vase", name: "Terracotta Ceramic Vase", category: "living",
        categoryLabel: "Living Room", price: 64, oldPrice: null, tag: "New",
        img: "assets/img/prod-01.jpg", rating: 5, reviews: 48,
        blurb: "A hand-thrown stoneware vase with a warm matte glaze — perfect for dried stems or a single statement branch.",
        details: ["Hand-thrown stoneware", "H 28cm × Ø 14cm", "Food-safe matte glaze", "Wipe clean, not dishwasher safe"],
        variant: { label: "Size", options: ["Small", "Medium", "Large"] }
    },
    {
        id: "rattan-pendant-light", name: "Rattan Pendant Light", category: "lighting",
        categoryLabel: "Lighting", price: 129, oldPrice: null, tag: null,
        img: "assets/img/prod-02.jpg", rating: 4, reviews: 31,
        blurb: "A woven rattan shade that throws a soft, dappled glow — instant warmth over a dining table or island.",
        details: ["Natural woven rattan", "Ø 40cm", "E27 fitting, bulb not included", "1.2m adjustable cord"],
        variant: { label: "Finish", options: ["Natural", "Black"] }
    },
    {
        id: "washed-linen-cushion", name: "Washed Linen Cushion", category: "textiles",
        categoryLabel: "Textiles", price: 38, oldPrice: 52, tag: "Sale",
        img: "assets/img/prod-03.jpg", rating: 5, reviews: 92,
        blurb: "Stonewashed 100% linen with a relaxed, lived-in feel and a hidden zip. Feather-down insert included.",
        details: ["100% stonewashed linen", "50cm × 50cm", "Feather-down insert included", "Removable cover, cold wash"],
        variant: { label: "Colour", options: ["Terracotta", "Sage", "Cream"] }
    },
    {
        id: "arch-framed-art-print", name: "Arch Framed Art Print", category: "wall",
        categoryLabel: "Wall Decor", price: 89, oldPrice: null, tag: null,
        img: "assets/img/prod-04.jpg", rating: 5, reviews: 57,
        blurb: "A serene arch-form abstract in warm earth tones, framed in solid oak with museum-grade glass.",
        details: ["Giclée print on archival paper", "Solid oak frame", "50cm × 70cm", "Ready to hang"],
        variant: { label: "Size", options: ["A3", "A2", "A1"] }
    },
    {
        id: "oak-side-table", name: "Oak Side Table", category: "living",
        categoryLabel: "Living Room", price: 215, oldPrice: null, tag: null,
        img: "assets/img/prod-05.jpg", rating: 5, reviews: 24,
        blurb: "A sculptural solid-oak side table with a rounded top — equally at home beside a sofa or bed.",
        details: ["Solid FSC-certified oak", "H 50cm × Ø 45cm", "Natural oil finish", "Flat-packed, easy assembly"],
        variant: { label: "Wood", options: ["Oak", "Walnut"] }
    },
    {
        id: "ceramic-table-lamp", name: "Ceramic Table Lamp", category: "lighting",
        categoryLabel: "Lighting", price: 98, oldPrice: null, tag: "New",
        img: "assets/img/prod-06.jpg", rating: 4, reviews: 40,
        blurb: "A curvy ceramic base in a soft clay glaze, topped with a natural linen shade for a gentle ambient light.",
        details: ["Glazed ceramic base", "Linen drum shade", "H 46cm", "In-line switch, E27 fitting"],
        variant: { label: "Shade", options: ["Ivory", "Charcoal"] }
    },
    {
        id: "chunky-wool-throw", name: "Chunky Wool Throw", category: "textiles",
        categoryLabel: "Textiles", price: 72, oldPrice: null, tag: null,
        img: "assets/img/prod-07.jpg", rating: 5, reviews: 76,
        blurb: "A chunky hand-knit throw in pure wool — the one everyone reaches for on the sofa.",
        details: ["100% pure wool", "130cm × 170cm", "Hand-knit", "Dry clean only"],
        variant: { label: "Colour", options: ["Oatmeal", "Rust", "Forest"] }
    },
    {
        id: "stoneware-dinner-set", name: "Stoneware Dinner Set", category: "dining",
        categoryLabel: "Dining", price: 140, oldPrice: 180, tag: "Sale",
        img: "assets/img/prod-08.jpg", rating: 5, reviews: 110,
        blurb: "A reactive-glaze stoneware set where no two pieces are exactly alike. Dinner, side and bowl for four.",
        details: ["Reactive-glaze stoneware", "12 pieces (service for 4)", "Dishwasher & microwave safe", "Each piece unique"],
        variant: { label: "Pieces", options: ["12", "16", "24"] }
    },
    {
        id: "round-brass-mirror", name: "Round Brass Mirror", category: "wall",
        categoryLabel: "Wall Decor", price: 115, oldPrice: null, tag: null,
        img: "assets/img/prod-09.jpg", rating: 5, reviews: 63,
        blurb: "A slim brushed-brass frame around a round mirror — brightens hallways and bounces light beautifully.",
        details: ["Brushed brass frame", "Ø 60cm", "Real glass mirror", "Hanging hardware included"],
        variant: { label: "Size", options: ["60cm", "80cm"] }
    },
    {
        id: "olive-wood-board", name: "Olive Wood Board", category: "dining",
        categoryLabel: "Dining", price: 46, oldPrice: null, tag: null,
        img: "assets/img/prod-10.jpg", rating: 4, reviews: 29,
        blurb: "A characterful olive-wood serving board with rich grain — for cheese, bread or simply on display.",
        details: ["Solid olive wood", "40cm × 22cm", "Food-safe oil finish", "Hand wash & re-oil"],
        variant: { label: "Size", options: ["Medium", "Large"] }
    },
    {
        id: "terracotta-planter-trio", name: "Terracotta Planter Trio", category: "outdoor",
        categoryLabel: "Outdoor", price: 58, oldPrice: null, tag: "New",
        img: "assets/img/prod-11.jpg", rating: 5, reviews: 38,
        blurb: "A set of three classic terracotta planters in graduated sizes, with drainage and matching saucers.",
        details: ["Natural terracotta", "Set of 3 (12/16/20cm)", "Drainage hole + saucer", "Frost-resistant"],
        variant: { label: "Finish", options: ["Terracotta", "White"] }
    },
    {
        id: "woven-lounge-chair", name: "Woven Lounge Chair", category: "outdoor",
        categoryLabel: "Outdoor", price: 240, oldPrice: null, tag: null,
        img: "assets/img/prod-12.jpg", rating: 4, reviews: 21,
        blurb: "An all-weather woven lounge chair with a powder-coated frame — relaxed enough for the patio or a reading corner.",
        details: ["All-weather woven cord", "Powder-coated steel frame", "Seat H 40cm", "Cushion sold separately"],
        variant: { label: "Colour", options: ["Natural", "Graphite"] }
    }
];

window.findProduct = function (id) {
    if (!id) return null;
    for (var i = 0; i < window.PRODUCTS.length; i++) {
        if (window.PRODUCTS[i].id === id) return window.PRODUCTS[i];
    }
    return null;
};

window.slugify = function (s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
};

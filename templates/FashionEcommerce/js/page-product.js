// Product detail page.
(function () {
  const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
  const p = getProduct(id);
  const el = document.getElementById("detail");

  if (!p) {
    el.innerHTML = `<div class="text-center py-20">
      <p class="text-xl font-medium mb-4">Product not found.</p>
      <a href="shop.html" class="underline">Back to shop</a></div>`;
    return;
  }

  document.title = p.name + " — LUXE";
  document.getElementById("crumb").textContent = p.name;

  el.innerHTML = `
    <div class="grid md:grid-cols-2 gap-10">
      <div class="aspect-[3/4] t-rounded-lg overflow-hidden t-surface">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-medium t-muted uppercase tracking-wide">${p.category}</span>
        <h1 class="t-display text-3xl font-bold mt-2">${p.name}</h1>
        <div class="flex items-center gap-2 mt-3 text-amber-500">${stars(p.rating)}
          <span class="t-muted text-sm">${p.rating} rating</span></div>
        <p class="text-3xl font-semibold mt-5">${money(p.price)}</p>
        <p class="t-muted leading-relaxed mt-5">${p.desc}</p>

        <div class="mt-6">
          <label class="block text-sm font-medium mb-2">Size</label>
          <div class="flex gap-2">
            ${["XS","S","M","L","XL"].map((s,i) => `
              <button onclick="pickSize(this)" class="size-btn h-11 w-11 t-rounded text-sm font-medium ${i===2?"t-btn":"t-btn-outline"}">${s}</button>`).join("")}
          </div>
        </div>

        <div class="mt-6 flex items-center gap-4">
          <div class="flex items-center border t-line t-rounded">
            <button onclick="bump(-1)" class="px-4 py-2.5 text-lg hover:opacity-60">−</button>
            <span id="qty" class="px-5 py-2.5 font-medium select-none">1</span>
            <button onclick="bump(1)" class="px-4 py-2.5 text-lg hover:opacity-60">+</button>
          </div>
          <button onclick="addToCart(${p.id}, qtyVal)" class="t-btn flex-1 py-3.5 font-medium">Add to Cart</button>
          <button onclick="toggleWishlist(${p.id})" data-wish="${p.id}" aria-label="Save to wishlist"
            class="t-btn-outline h-[52px] w-[52px] flex items-center justify-center">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
            </svg>
          </button>
        </div>

        <div class="mt-8 border-t t-line pt-6 space-y-3 text-sm t-muted">
          <p>✓ Free shipping on orders over $100</p>
          <p>✓ 30-day easy returns</p>
          <p>✓ Secure checkout</p>
        </div>
      </div>
    </div>`;

  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const pool = related.length ? related : PRODUCTS.filter(x => x.id !== p.id).slice(0, 4);
  document.getElementById("related").innerHTML = pool.map(productCardHTML).join("");
  refreshHearts();

  let qtyVal = 1;
  window.bump = function (d) {
    qtyVal = Math.max(1, qtyVal + d);
    document.getElementById("qty").textContent = qtyVal;
  };
  window.pickSize = function (btn) {
    document.querySelectorAll(".size-btn").forEach(b =>
      b.className = "size-btn h-11 w-11 t-rounded text-sm font-medium t-btn-outline");
    btn.className = "size-btn h-11 w-11 t-rounded text-sm font-medium t-btn";
  };
})();

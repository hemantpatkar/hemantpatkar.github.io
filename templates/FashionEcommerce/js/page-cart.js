// Cart page.
(function () {
  const SHIPPING_THRESHOLD = 100;
  const SHIPPING_FEE = 9.99;

  window.renderCart = function () {
    const cart = getCart();
    const wrap = document.getElementById("cart-wrap");

    if (cart.length === 0) {
      wrap.className = "";
      wrap.innerHTML = `
        <div class="text-center py-20">
          <p class="text-xl font-medium mb-2">Your cart is empty</p>
          <p class="t-muted mb-6">Looks like you haven't added anything yet.</p>
          <a href="shop.html" class="t-btn inline-block px-7 py-3 font-medium">Start Shopping</a>
        </div>`;
      return;
    }

    wrap.className = "grid lg:grid-cols-3 gap-8";
    const subtotal = cartTotal();
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const rows = cart.map(line => {
      const p = getProduct(line.id);
      if (!p) return "";
      return `
        <div class="flex gap-4 py-5 border-b t-line">
          <a href="product.html?id=${p.id}" class="shrink-0">
            <img src="${p.image}" alt="${p.name}" class="h-28 w-24 object-cover t-rounded t-surface">
          </a>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between gap-3">
              <a href="product.html?id=${p.id}" class="font-medium hover:opacity-70">${p.name}</a>
              <button onclick="removeFromCart(${p.id}); renderCart();" class="t-muted hover:text-red-500 text-sm">Remove</button>
            </div>
            <p class="text-sm t-muted mt-1">${p.category}</p>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center border t-line t-rounded">
                <button onclick="setQty(${p.id}, ${line.qty - 1}); renderCart();" class="px-3 py-1.5 hover:opacity-60">−</button>
                <span class="px-4 py-1.5 text-sm font-medium">${line.qty}</span>
                <button onclick="setQty(${p.id}, ${line.qty + 1}); renderCart();" class="px-3 py-1.5 hover:opacity-60">+</button>
              </div>
              <span class="font-semibold">${money(p.price * line.qty)}</span>
            </div>
          </div>
        </div>`;
    }).join("");

    wrap.innerHTML = `
      <div class="lg:col-span-2 t-card px-5">${rows}</div>
      <div class="t-card p-6 h-fit">
        <h2 class="text-lg font-semibold mb-5">Order Summary</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="t-muted">Subtotal</span><span>${money(subtotal)}</span></div>
          <div class="flex justify-between"><span class="t-muted">Shipping</span><span>${shipping === 0 ? "Free" : money(shipping)}</span></div>
          ${subtotal < SHIPPING_THRESHOLD ? `<p class="text-xs t-muted">Add ${money(SHIPPING_THRESHOLD - subtotal)} more for free shipping.</p>` : ""}
        </div>
        <div class="flex justify-between font-semibold text-lg border-t t-line mt-5 pt-5">
          <span>Total</span><span>${money(total)}</span>
        </div>
        <a href="checkout.html" class="t-btn block text-center w-full py-3.5 font-medium mt-6">Checkout</a>
        <a href="shop.html" class="block text-center text-sm t-muted hover:opacity-70 mt-4">Continue shopping</a>
      </div>`;
  };

  renderCart();
})();

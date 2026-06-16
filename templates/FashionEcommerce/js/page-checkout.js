// Checkout page — summary, shipping/payment, validation, confirmation.
(function () {
  const SHIP_RATES = { standard: 9.99, express: 19.99 };
  const FREE_SHIP_THRESHOLD = 100;
  const TAX_RATE = 0.08;

  const form = document.getElementById("checkout-form");

  function shippingCost() {
    const method = form.elements.ship.value;
    if (method === "standard" && cartTotal() >= FREE_SHIP_THRESHOLD) return 0;
    return SHIP_RATES[method];
  }

  window.recalc = function () {
    const subtotal = cartTotal();
    const shipping = shippingCost();
    const tax = subtotal * TAX_RATE;
    document.getElementById("sum-subtotal").textContent = money(subtotal);
    document.getElementById("sum-shipping").textContent = shipping === 0 ? "Free" : money(shipping);
    document.getElementById("sum-tax").textContent = money(tax);
    document.getElementById("sum-total").textContent = money(subtotal + shipping + tax);
    document.getElementById("ship-std-label").textContent =
      cartTotal() >= FREE_SHIP_THRESHOLD ? "Free" : money(SHIP_RATES.standard);
  };

  function renderSummary() {
    document.getElementById("summary-items").innerHTML = getCart().map(line => {
      const p = getProduct(line.id);
      if (!p) return "";
      return `
        <div class="flex gap-3 items-center">
          <div class="relative shrink-0">
            <img src="${p.image}" class="h-14 w-12 object-cover t-rounded t-surface">
            <span class="absolute -top-1.5 -right-1.5 t-badge text-[10px] h-5 w-5 flex items-center justify-center rounded-full">${line.qty}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">${p.name}</p>
            <p class="text-xs t-muted">${p.category}</p>
          </div>
          <span class="text-sm font-medium">${money(p.price * line.qty)}</span>
        </div>`;
    }).join("");
  }

  /* input formatting */
  const cardNumber = form.elements.cardNumber;
  cardNumber.addEventListener("input", () => {
    const v = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = v.replace(/(.{4})/g, "$1 ").trim();
  });
  const expiry = form.elements.expiry;
  expiry.addEventListener("input", () => {
    const v = expiry.value.replace(/\D/g, "").slice(0, 4);
    expiry.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
  });
  form.elements.cvc.addEventListener("input", e => e.target.value = e.target.value.replace(/\D/g, ""));

  /* validation */
  function setError(field, msg) {
    const errEl = field.parentElement.querySelector(".t-err");
    if (errEl) errEl.textContent = msg || "";
    field.classList.toggle("invalid", !!msg);
  }
  const validators = {
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email.",
    phone: v => v.replace(/\D/g, "").length >= 7 ? "" : "Enter a valid phone number.",
    cardNumber: v => v.replace(/\s/g, "").length === 16 ? "" : "Card number must be 16 digits.",
    cvc: v => /^\d{3,4}$/.test(v) ? "" : "Enter a 3–4 digit CVC.",
    expiry: v => {
      const m = v.match(/^(\d{2})\/(\d{2})$/);
      if (!m) return "Use MM/YY format.";
      const mm = +m[1], yy = +m[2];
      if (mm < 1 || mm > 12) return "Invalid month.";
      const exp = new Date(2000 + yy, mm, 0, 23, 59, 59);
      if (exp < new Date()) return "Card has expired.";
      return "";
    }
  };
  function validateField(field) {
    if (!field.name) return true;
    const val = field.value.trim();
    let msg = "";
    if (field.required && !val) msg = "This field is required.";
    else if (val && validators[field.name]) msg = validators[field.name](val);
    setError(field, msg);
    return !msg;
  }
  form.querySelectorAll("input, select").forEach(f => {
    f.addEventListener("blur", () => validateField(f));
    f.addEventListener("input", () => { if (f.classList.contains("invalid")) validateField(f); });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    let firstInvalid = null, ok = true;
    form.querySelectorAll("input, select").forEach(f => {
      if (!validateField(f)) { ok = false; if (!firstInvalid) firstInvalid = f; }
    });
    if (!ok) {
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Please fix the highlighted fields.");
      return;
    }
    const orderNo = "LX-" + String(getCart().reduce((a, l) => a + l.id * l.qty, 0)).padStart(4, "0") +
      "-" + form.elements.zip.value.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
    localStorage.removeItem("luxe_cart");
    updateCartCount();
    form.classList.add("hidden");
    document.getElementById("order-no").textContent = orderNo;
    document.getElementById("confirmation").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* init */
  if (getCart().length === 0) {
    form.classList.add("hidden");
    document.getElementById("empty-state").classList.remove("hidden");
  } else {
    renderSummary();
    recalc();
  }
})();

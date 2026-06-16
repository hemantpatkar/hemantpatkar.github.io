/* ============================================================
   Maison Decor — site interactions
   Vanilla JS, no dependencies. Works from file:// or any host.
   ============================================================ */
(function () {
    "use strict";

    var root = document.documentElement;

    document.addEventListener("DOMContentLoaded", function () {
        initPromoBar();
        initThemeToggle();
        initThemePicker();
        initNav();
        initToTop();
        initProductPage();
        initReveal();
        initFilters();
        initWishlist();
        initCart();
        initProductEnhance();
        initLightbox();
        initCarousel();
        initForms();
        initNewsletter();
        setYear();
        initPWA();
    });

    /* ---------------------------- Theme toggle ---------------------------- */
    function setThemeIcon(btn) {
        var icon = btn.querySelector("i");
        if (!icon) return;
        var dark = root.classList.contains("dark-mode");
        icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    function initThemeToggle() {
        var btn = document.getElementById("themeToggle");
        if (!btn) return;
        setThemeIcon(btn);
        btn.addEventListener("click", function () {
            var isDark = root.classList.toggle("dark-mode");
            try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
            setThemeIcon(btn);
        });
    }

    /* --------------------- Template theme picker --------------------- */
    function initThemePicker() {
        var THEMES = [
            { id: "", name: "Boutique", dot: "#bf6240" },
            { id: "minimal", name: "Modern Minimal", dot: "#111111" },
            { id: "luxe", name: "Luxe Dark", dot: "#c9a35b" },
            { id: "scandi", name: "Scandi / Natural", dot: "#7d9b76" },
            { id: "editorial", name: "Bold Editorial", dot: "#c0392b" }
        ];

        var current = "";
        try { current = localStorage.getItem("site-theme") || ""; } catch (e) {}

        var wrap = document.createElement("div");
        wrap.className = "theme-picker";
        wrap.innerHTML =
            '<button class="theme-picker-btn" id="themePickerBtn" aria-label="Change template theme" aria-expanded="false" title="Change template theme"><i class="fa-solid fa-swatchbook"></i></button>' +
            '<div class="theme-picker-panel" role="menu"><h4>Template theme</h4></div>';
        var panel = wrap.querySelector(".theme-picker-panel");
        var btn = wrap.querySelector(".theme-picker-btn");

        THEMES.forEach(function (t) {
            var opt = document.createElement("button");
            opt.className = "theme-opt" + (t.id === current ? " active" : "");
            opt.setAttribute("data-id", t.id);
            opt.setAttribute("role", "menuitem");
            opt.innerHTML =
                '<span class="dot" style="background:' + t.dot + '"></span>' +
                '<span class="name">' + t.name + '</span>' +
                '<i class="check fa-solid fa-check"></i>';
            opt.addEventListener("click", function () {
                apply(t.id);
                panel.querySelectorAll(".theme-opt").forEach(function (o) {
                    o.classList.toggle("active", o.getAttribute("data-id") === t.id);
                });
                close();
            });
            panel.appendChild(opt);
        });

        document.body.appendChild(wrap);

        function apply(id) {
            if (id) root.setAttribute("data-theme", id);
            else root.removeAttribute("data-theme");
            try {
                if (id) localStorage.setItem("site-theme", id);
                else localStorage.removeItem("site-theme");
            } catch (e) {}
        }
        function open() { wrap.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
        function close() { wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            wrap.classList.contains("open") ? close() : open();
        });
        document.addEventListener("click", function (e) {
            if (!wrap.contains(e.target)) close();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") close();
        });
    }

    /* ------------------------------ Navigation ------------------------------ */
    function initNav() {
        var toggle = document.getElementById("navToggle");
        var links = document.getElementById("navLinks");
        var header = document.getElementById("siteHeader");

        if (toggle && links) {
            toggle.addEventListener("click", function () {
                var open = links.classList.toggle("open");
                toggle.classList.toggle("open", open);
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
            links.addEventListener("click", function (e) {
                if (e.target.closest("a")) {
                    links.classList.remove("open");
                    toggle.classList.remove("open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        }

        if (header) {
            var onScroll = function () {
                header.classList.toggle("scrolled", window.scrollY > 8);
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
        }
    }

    /* ------------------------------ Back to top ------------------------------ */
    function initToTop() {
        var btn = document.getElementById("toTop");
        if (!btn) return;
        var onScroll = function () {
            btn.classList.toggle("show", window.scrollY > 600);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* --------------------------- Scroll reveal --------------------------- */
    function initReveal() {
        var reveals = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
            for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("in-view");
            return;
        }
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in-view");
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        reveals.forEach(function (el) { io.observe(el); });
    }

    /* --------------------------- Product filters --------------------------- */
    function initFilters() {
        var bar = document.querySelector(".filters");
        if (!bar) return;
        var cards = document.querySelectorAll(".product-card");
        var empty = document.getElementById("emptyNote");

        function apply(cat) {
            bar.querySelectorAll(".filter-btn").forEach(function (b) {
                b.classList.toggle("active", b.getAttribute("data-filter") === cat);
            });
            var shown = 0;
            cards.forEach(function (card) {
                var match = cat === "all" || card.getAttribute("data-category") === cat;
                card.style.display = match ? "" : "none";
                if (match) shown++;
            });
            if (empty) empty.style.display = shown ? "none" : "";
        }

        bar.addEventListener("click", function (e) {
            var btn = e.target.closest(".filter-btn");
            if (btn) apply(btn.getAttribute("data-filter"));
        });

        // Honour ?cat=… deep links from the home page category tiles.
        var qs = new URLSearchParams(location.search).get("cat");
        var valid = qs && bar.querySelector('.filter-btn[data-filter="' + qs + '"]');
        if (valid) apply(qs);
    }

    /* --------------------------- Wishlist --------------------------- */
    function initWishlist() {
        document.addEventListener("click", function (e) {
            var btn = e.target.closest(".wish");
            if (!btn) return;
            var on = btn.classList.toggle("on");
            var icon = btn.querySelector("i");
            if (icon) icon.className = on ? "fa-solid fa-heart" : "fa-regular fa-heart";
            toast(on ? "Added to wishlist" : "Removed from wishlist");
        });
    }

    /* ============================================================
       Cart — localStorage-backed, slide-out drawer, injected nav button
       ============================================================ */
    var CART_KEY = "maison-cart";

    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
    }
    function saveCart(c) {
        try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {}
    }
    function cartCount(c) {
        return (c || getCart()).reduce(function (n, l) { return n + l.qty; }, 0);
    }
    function cartTotal(c) {
        return (c || getCart()).reduce(function (sum, l) {
            var p = window.findProduct && window.findProduct(l.id);
            return sum + (p ? p.price * l.qty : 0);
        }, 0);
    }
    function money(n) { return "$" + Number(n).toFixed(0); }

    function addToCart(id, qty) {
        if (!window.findProduct || !window.findProduct(id)) return false;
        qty = qty || 1;
        var c = getCart(), found = false;
        for (var i = 0; i < c.length; i++) { if (c[i].id === id) { c[i].qty += qty; found = true; break; } }
        if (!found) c.push({ id: id, qty: qty });
        saveCart(c);
        renderCart();
        return true;
    }
    function setQty(id, qty) {
        var c = getCart();
        for (var i = 0; i < c.length; i++) {
            if (c[i].id === id) { c[i].qty = qty; if (c[i].qty < 1) c.splice(i, 1); break; }
        }
        saveCart(c);
        renderCart();
    }

    var cartEls = {};
    function initCart() {
        // Inject a cart button into the nav (every page) before the theme toggle.
        var navLinks = document.getElementById("navLinks");
        if (navLinks) {
            var themeLi = navLinks.querySelector("#themeToggle") ? navLinks.querySelector("#themeToggle").closest("li") : null;
            var li = document.createElement("li");
            li.innerHTML = '<button class="cart-btn" id="cartBtn" aria-label="Open cart">' +
                '<i class="fa-solid fa-bag-shopping"></i><span class="cart-badge" id="cartCount" hidden>0</span></button>';
            navLinks.insertBefore(li, themeLi);
        }

        // Inject the drawer + overlay.
        var d = document.createElement("div");
        d.innerHTML =
            '<div class="cart-overlay" id="cartOverlay"></div>' +
            '<aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart" aria-hidden="true">' +
            '  <div class="cart-head"><h3>Your Cart</h3><button class="cart-close" id="cartClose" aria-label="Close cart">&times;</button></div>' +
            '  <div class="cart-items" id="cartItems"></div>' +
            '  <div class="cart-foot" id="cartFoot">' +
            '    <div class="cart-subtotal"><span>Subtotal</span><strong id="cartTotal">$0</strong></div>' +
            '    <p class="cart-note">Shipping &amp; taxes calculated at checkout.</p>' +
            '    <button class="btn-primary cart-checkout" id="cartCheckout"><i class="fa-solid fa-lock"></i> Checkout</button>' +
            '  </div>' +
            '</aside>';
        document.body.appendChild(d);

        cartEls.overlay = document.getElementById("cartOverlay");
        cartEls.drawer = document.getElementById("cartDrawer");
        cartEls.items = document.getElementById("cartItems");
        cartEls.total = document.getElementById("cartTotal");
        cartEls.badge = document.getElementById("cartCount");

        var btn = document.getElementById("cartBtn");
        if (btn) btn.addEventListener("click", openCart);
        document.getElementById("cartClose").addEventListener("click", closeCart);
        cartEls.overlay.addEventListener("click", closeCart);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

        document.getElementById("cartCheckout").addEventListener("click", function () {
            if (!getCart().length) { toast("Your cart is empty"); return; }
            toast("Checkout is a demo — connect a payment provider to go live.");
        });

        // Add-to-cart from any .btn-cart (resolves product via its data-name slug).
        document.addEventListener("click", function (e) {
            var b = e.target.closest(".btn-cart");
            if (!b) return;
            var id = b.getAttribute("data-id") || (window.slugify ? window.slugify(b.getAttribute("data-name") || "") : "");
            var qtyField = b.getAttribute("data-qty-from");
            var qty = 1;
            if (qtyField) { var qf = document.getElementById(qtyField); if (qf) qty = Math.max(1, parseInt(qf.value, 10) || 1); }
            if (addToCart(id, qty)) {
                toast('"' + (window.findProduct(id).name) + '" added to cart');
                openCart();
            } else {
                toast("Sorry, that item is unavailable");
            }
        });

        // Quantity / remove controls inside the drawer (event-delegated).
        cartEls.items.addEventListener("click", function (e) {
            var line = e.target.closest("[data-line]");
            if (!line) return;
            var id = line.getAttribute("data-line");
            var cur = 0, c = getCart();
            for (var i = 0; i < c.length; i++) if (c[i].id === id) cur = c[i].qty;
            if (e.target.closest(".qty-inc")) setQty(id, cur + 1);
            else if (e.target.closest(".qty-dec")) setQty(id, cur - 1);
            else if (e.target.closest(".cart-remove")) setQty(id, 0);
        });

        renderCart();
    }

    function openCart() { if (cartEls.drawer) { cartEls.drawer.classList.add("open"); cartEls.overlay.classList.add("open"); cartEls.drawer.setAttribute("aria-hidden", "false"); } }
    function closeCart() { if (cartEls.drawer) { cartEls.drawer.classList.remove("open"); cartEls.overlay.classList.remove("open"); cartEls.drawer.setAttribute("aria-hidden", "true"); } }

    function renderCart() {
        if (!cartEls.items) return;
        var c = getCart();
        if (!c.length) {
            cartEls.items.innerHTML = '<p class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><br>Your cart is empty.<br><a href="products.html">Start shopping →</a></p>';
        } else {
            cartEls.items.innerHTML = c.map(function (l) {
                var p = window.findProduct(l.id);
                if (!p) return "";
                return '<div class="cart-line" data-line="' + p.id + '">' +
                    '<a class="cart-thumb" href="product.html?id=' + p.id + '" style="background-image:url(\'' + p.img + '\')"></a>' +
                    '<div class="cart-line-body">' +
                    '<a class="cart-line-name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
                    '<span class="cart-line-price">' + money(p.price) + '</span>' +
                    '<div class="qty"><button class="qty-dec" aria-label="Decrease">−</button><span>' + l.qty + '</span><button class="qty-inc" aria-label="Increase">+</button>' +
                    '<button class="cart-remove" aria-label="Remove"><i class="fa-solid fa-trash-can"></i></button></div>' +
                    '</div></div>';
            }).join("");
        }
        if (cartEls.total) cartEls.total.textContent = money(cartTotal(c));
        var n = cartCount(c);
        if (cartEls.badge) { cartEls.badge.textContent = n; cartEls.badge.hidden = n === 0; }
    }

    /* ---------- Enhance product cards: link to detail + quick view ---------- */
    function initProductEnhance() {
        if (!window.PRODUCTS) return;
        var cards = document.querySelectorAll(".product-card");
        cards.forEach(function (card) {
            var nameEl = card.querySelector("h3");
            var addBtn = card.querySelector(".btn-cart");
            var name = (addBtn && addBtn.getAttribute("data-name")) || (nameEl && nameEl.textContent) || "";
            var id = window.slugify(name);
            if (!window.findProduct(id)) return;
            var href = "product.html?id=" + id;

            var media = card.querySelector(".product-media");
            if (media) {
                media.style.cursor = "pointer";
                media.addEventListener("click", function (e) {
                    if (e.target.closest(".wish") || e.target.closest(".quick-btn")) return;
                    location.href = href;
                });
                // Quick-view button overlay
                var q = document.createElement("button");
                q.className = "quick-btn";
                q.type = "button";
                q.innerHTML = '<i class="fa-regular fa-eye"></i> Quick view';
                q.addEventListener("click", function (e) { e.stopPropagation(); openQuickView(id); });
                media.appendChild(q);
            }
            if (nameEl) {
                var a = document.createElement("a");
                a.href = href;
                a.className = "product-name-link";
                a.textContent = nameEl.textContent;
                nameEl.textContent = "";
                nameEl.appendChild(a);
            }
        });
    }

    /* ---------- Quick-view modal ---------- */
    var qvEl;
    function openQuickView(id) {
        var p = window.findProduct(id);
        if (!p) return;
        if (!qvEl) {
            qvEl = document.createElement("div");
            qvEl.className = "qv-overlay";
            document.body.appendChild(qvEl);
            qvEl.addEventListener("click", function (e) {
                if (e.target === qvEl || e.target.closest(".qv-close")) closeQuickView();
            });
            document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQuickView(); });
        }
        qvEl.innerHTML =
            '<div class="qv-card" role="dialog" aria-label="' + p.name + '">' +
            '<button class="qv-close" aria-label="Close">&times;</button>' +
            '<div class="qv-media" style="background-image:url(\'' + p.img + '\')"></div>' +
            '<div class="qv-body">' +
            '<span class="product-cat">' + p.categoryLabel + '</span>' +
            '<h3>' + p.name + '</h3>' +
            '<div class="product-rating">' + stars(p.rating) + ' <span>(' + p.reviews + ')</span></div>' +
            '<p class="qv-blurb">' + p.blurb + '</p>' +
            '<div class="qv-foot"><span class="price">' + money(p.price) + (p.oldPrice ? ' <del>' + money(p.oldPrice) + '</del>' : '') + '</span>' +
            '<button class="btn-cart" data-id="' + p.id + '" data-name="' + p.name + '"><i class="fa-solid fa-plus"></i> Add to cart</button></div>' +
            '<a class="link-arrow" href="product.html?id=' + p.id + '">View full details <i class="fa-solid fa-arrow-right"></i></a>' +
            '</div></div>';
        qvEl.classList.add("open");
    }
    function closeQuickView() { if (qvEl) qvEl.classList.remove("open"); }

    function stars(n) {
        var s = "";
        for (var i = 0; i < 5; i++) s += i < n ? "★" : "☆";
        return s;
    }

    /* ============================================================
       Product detail page (product.html?id=…)
       ============================================================ */
    function initProductPage() {
        var mount = document.getElementById("pdp");
        if (!mount || !window.PRODUCTS) return;
        var id = new URLSearchParams(location.search).get("id");
        var p = window.findProduct(id);

        if (!p) {
            mount.innerHTML = '<div class="container" style="padding:4rem 0;text-align:center">' +
                '<h1 class="page-title">Product not found</h1>' +
                '<p class="page-sub">That item may have sold out or moved. <br><a href="products.html">Browse the collection →</a></p></div>';
            return;
        }

        document.title = p.name + " — Maison Decor";
        var variantHtml = p.variant ? (
            '<div class="pdp-variant"><label class="form-label">' + p.variant.label + '</label><div class="variant-opts">' +
            p.variant.options.map(function (o, i) { return '<button type="button" class="variant-opt' + (i === 0 ? ' active' : '') + '">' + o + '</button>'; }).join("") +
            '</div></div>'
        ) : "";

        mount.innerHTML =
            '<section class="page-head"><div class="container">' +
            '<p class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Shop</a> / <a href="products.html?cat=' + p.category + '">' + p.categoryLabel + '</a> / ' + p.name + '</p>' +
            '</div></section>' +
            '<section class="section"><div class="container pdp-grid">' +
            '<div class="pdp-media reveal"><div class="pdp-main" style="background-image:url(\'' + p.img + '\')">' + (p.tag ? '<span class="product-tag' + (p.tag === "Sale" ? " sale" : "") + '">' + p.tag + '</span>' : '') + '</div></div>' +
            '<div class="pdp-info reveal d1">' +
            '<span class="product-cat">' + p.categoryLabel + '</span>' +
            '<h1 class="pdp-title">' + p.name + '</h1>' +
            '<div class="product-rating">' + stars(p.rating) + ' <span>(' + p.reviews + ' reviews)</span></div>' +
            '<p class="pdp-price"><span class="price">' + money(p.price) + (p.oldPrice ? ' <del>' + money(p.oldPrice) + '</del>' : '') + '</span></p>' +
            '<p class="pdp-blurb">' + p.blurb + '</p>' +
            variantHtml +
            '<div class="pdp-actions">' +
            '<div class="qty pdp-qty"><button class="qty-dec" type="button" aria-label="Decrease">−</button><span id="pdpQty">1</span><button class="qty-inc" type="button" aria-label="Increase">+</button></div>' +
            '<button class="btn-primary btn-cart" data-id="' + p.id + '" data-name="' + p.name + '" data-qty-from="pdpQty"><i class="fa-solid fa-bag-shopping"></i> Add to cart</button>' +
            '</div>' +
            '<ul class="pdp-details">' + p.details.map(function (d) { return '<li><i class="fa-solid fa-check"></i> ' + d + '</li>'; }).join("") + '</ul>' +
            '<div class="pdp-trust"><span><i class="fa-solid fa-truck"></i> Free shipping over $250</span><span><i class="fa-solid fa-rotate-left"></i> 30-day returns</span></div>' +
            '</div></div></section>';

        // Variant selection
        mount.querySelectorAll(".variant-opt").forEach(function (b) {
            b.addEventListener("click", function () {
                mount.querySelectorAll(".variant-opt").forEach(function (x) { x.classList.remove("active"); });
                b.classList.add("active");
            });
        });
        // PDP quantity stepper
        var qEl = document.getElementById("pdpQty");
        mount.querySelector(".pdp-qty .qty-inc").addEventListener("click", function () { qEl.textContent = (parseInt(qEl.textContent, 10) + 1); });
        mount.querySelector(".pdp-qty .qty-dec").addEventListener("click", function () { qEl.textContent = Math.max(1, parseInt(qEl.textContent, 10) - 1); });

        // Related products (same category)
        var related = window.PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
        if (related.length) {
            var rel = document.createElement("section");
            rel.className = "section section-alt";
            rel.innerHTML = '<div class="container"><div class="section-head reveal"><span class="eyebrow">You may also like</span><h2 class="section-title">More from ' + p.categoryLabel + '</h2></div><div class="product-grid">' +
                related.map(renderCardHTML).join("") + '</div></div>';
            mount.appendChild(rel);
            initProductEnhance(); // wire the freshly added cards
        }

        // Inject Product structured data (SEO)
        injectJSONLD({
            "@context": "https://schema.org", "@type": "Product",
            "name": p.name, "image": [p.img], "description": p.blurb,
            "category": p.categoryLabel,
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": p.rating, "reviewCount": p.reviews },
            "offers": { "@type": "Offer", "price": p.price, "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
        });
    }

    function renderCardHTML(p) {
        return '<article class="product-card" data-category="' + p.category + '">' +
            '<div class="product-media" style="background-image:url(\'' + p.img + '\')">' +
            (p.tag ? '<span class="product-tag' + (p.tag === "Sale" ? " sale" : "") + '">' + p.tag + '</span>' : '') +
            '<button class="wish" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button></div>' +
            '<div class="product-body"><span class="product-cat">' + p.categoryLabel + '</span><h3>' + p.name + '</h3>' +
            '<div class="product-rating">' + stars(p.rating) + ' <span>(' + p.reviews + ')</span></div>' +
            '<div class="product-foot"><span class="price">' + money(p.price) + (p.oldPrice ? ' <del>' + money(p.oldPrice) + '</del>' : '') + '</span>' +
            '<button class="btn-cart" data-id="' + p.id + '" data-name="' + p.name + '"><i class="fa-solid fa-plus"></i> Add</button></div></div></article>';
    }

    function injectJSONLD(obj) {
        var s = document.createElement("script");
        s.type = "application/ld+json";
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
    }

    /* --------------------------- Gallery lightbox --------------------------- */
    function initLightbox() {
        var items = document.querySelectorAll(".gallery-item[data-full]");
        if (!items.length) return;

        var box = document.createElement("div");
        box.className = "lightbox";
        box.innerHTML = '<button aria-label="Close">&times;</button><img alt="">';
        document.body.appendChild(box);
        var img = box.querySelector("img");

        function open(src, alt) { img.src = src; img.alt = alt || ""; box.classList.add("open"); }
        function close() { box.classList.remove("open"); img.src = ""; }

        items.forEach(function (it) {
            it.addEventListener("click", function () {
                open(it.getAttribute("data-full"), it.getAttribute("data-alt"));
            });
        });
        box.addEventListener("click", function (e) {
            if (e.target === box || e.target.tagName === "BUTTON") close();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") close();
        });
    }

    /* ----------------------- Web3Forms forms (contact + booking) ----------------------- */
    function initForms() {
        document.querySelectorAll("form[data-web3form]").forEach(function (form) {
            var status = form.querySelector(".form-status");
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                var keyField = form.querySelector('input[name="access_key"]');
                var key = keyField ? keyField.value : "";
                if (!key || key.indexOf("YOUR_") === 0) {
                    setStatus(status, "Form isn’t configured yet — add your Web3Forms access key.", "err");
                    return;
                }
                var btn = form.querySelector('button[type="submit"]');
                var label = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = "Sending…";
                setStatus(status, "", "");

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Accept": "application/json" },
                    body: new FormData(form)
                })
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (data.success) {
                            form.reset();
                            setStatus(status, form.getAttribute("data-success") || "Thank you! Your message has been sent — we’ll be in touch soon.", "ok");
                        } else {
                            setStatus(status, data.message || "Something went wrong. Please try again.", "err");
                        }
                    })
                    .catch(function () { setStatus(status, "Network error. Please try again.", "err"); })
                    .then(function () { btn.disabled = false; btn.innerHTML = label; });
            });
        });
    }

    function initNewsletter() {
        var form = document.getElementById("newsletter-form");
        if (!form) return;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            form.reset();
            toast("You’re subscribed — welcome to Maison Decor!");
        });
    }

    function setStatus(el, msg, kind) {
        if (!el) return;
        el.textContent = msg;
        el.className = "form-status" + (kind ? " " + kind : "");
    }

    /* ------------------------------- Toast ------------------------------- */
    var toastEl, toastTimer;
    function toast(msg) {
        if (!toastEl) {
            toastEl = document.createElement("div");
            toastEl.className = "toast";
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        // force reflow so re-trigger animates
        void toastEl.offsetWidth;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
    }

    function setYear() {
        var el = document.getElementById("year");
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ------------------------------ Promo bar ------------------------------ */
    function initPromoBar() {
        var KEY = "promo-dismissed-v1";
        try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}
        var bar = document.createElement("div");
        bar.className = "promo-bar";
        bar.innerHTML =
            '<span><i class="fa-solid fa-truck-fast"></i> Free shipping on orders over $250 — plus a free styling consult. ' +
            '<a href="products.html">Shop now</a></span>' +
            '<button class="promo-close" aria-label="Dismiss">&times;</button>';
        document.body.insertBefore(bar, document.body.firstChild);
        bar.querySelector(".promo-close").addEventListener("click", function () {
            bar.remove();
            try { localStorage.setItem(KEY, "1"); } catch (e) {}
        });
    }

    /* ------------------------------ Carousel ------------------------------ */
    function initCarousel() {
        document.querySelectorAll("[data-carousel]").forEach(function (track) {
            if (track.children.length < 2) return;
            var wrap = document.createElement("div");
            wrap.className = "carousel";
            track.parentNode.insertBefore(wrap, track);
            wrap.appendChild(track);

            var prev = document.createElement("button");
            prev.className = "carousel-btn prev";
            prev.setAttribute("aria-label", "Previous");
            prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            var next = document.createElement("button");
            next.className = "carousel-btn next";
            next.setAttribute("aria-label", "Next");
            next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
            wrap.appendChild(prev);
            wrap.appendChild(next);

            function step() {
                var first = track.firstElementChild;
                if (!first) return 300;
                var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
                return first.getBoundingClientRect().width + gap;
            }
            prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
            next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });

            function update() {
                var max = track.scrollWidth - track.clientWidth - 2;
                prev.classList.toggle("hidden", track.scrollLeft <= 2);
                next.classList.toggle("hidden", track.scrollLeft >= max);
            }
            track.addEventListener("scroll", update, { passive: true });
            window.addEventListener("resize", update);
            update();
        });
    }

    /* ------------------------------ PWA ------------------------------ */
    function initPWA() {
        if (!("serviceWorker" in navigator)) return;
        // Service workers require http(s); skip silently on file://
        if (location.protocol !== "http:" && location.protocol !== "https:") return;
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("sw.js").catch(function () {});
        });
    }
})();

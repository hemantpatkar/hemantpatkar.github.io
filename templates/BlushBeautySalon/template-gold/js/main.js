/* ============================================================
   Blush Beauty Salon — GOLD LUXE template interactions
   ============================================================ */
(function () {
    "use strict";

    /* ---- Mobile nav toggle ---- */
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (toggle && links) {
        toggle.addEventListener("click", function () {
            var open = links.classList.toggle("open");
            toggle.classList.toggle("open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        // Close the menu after tapping a link (mobile)
        links.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                links.classList.remove("open");
                toggle.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ---- Overlay header → solid on scroll ---- */
    var header = document.getElementById("siteHeader");
    var toTop = document.getElementById("toTop");
    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        if (header) header.classList.toggle("scrolled", y > 8);
        if (toTop) toTop.classList.toggle("show", y > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- Back to top ---- */
    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ---- Theme toggle (persisted, DEFAULT = DARK) ---- */
    var themeBtn = document.getElementById("themeToggle");
    function setIcon() {
        if (!themeBtn) return;
        var light = document.documentElement.classList.contains("light-mode");
        // Show sun while in dark mode (tap to brighten), moon while in light mode.
        themeBtn.innerHTML = light
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
    }
    setIcon();
    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            var light = document.documentElement.classList.toggle("light-mode");
            try { localStorage.setItem("theme-gold", light ? "light" : "dark"); } catch (e) {}
            setIcon();
        });
    }

    /* ---- Scroll reveal ---- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---- FAQ accordion ---- */
    document.querySelectorAll(".acc-q").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var item = btn.closest(".acc-item");
            var panel = item.querySelector(".acc-a");
            var open = item.classList.toggle("open");
            panel.style.maxHeight = open ? panel.scrollHeight + "px" : null;
        });
    });

    /* ---- Contact form (front-end demo) ---- */
    var form = document.getElementById("bookingForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var ok = document.getElementById("formSuccess");
            if (ok) {
                ok.classList.add("show");
                ok.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            form.reset();
        });
    }

    /* ---- Footer year ---- */
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();
})();

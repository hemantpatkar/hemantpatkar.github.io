(function () {
    "use strict";

    var root = document.documentElement;

    document.addEventListener("DOMContentLoaded", function () {
        initThemeToggle();
        initNav();
        initToTop();
        initReveal();
        loadProjects();
        initContactForm();
        initResume();
    });

    /* ------------------------------ Resume / PDF ------------------------------ */
    function initResume() {
        var btn = document.getElementById("downloadPdf");
        if (btn) btn.addEventListener("click", function () { window.print(); });

        // Auto-open the print dialog when arriving via ?print=1 (from the
        // "Download Profile" buttons), once fonts are ready for crisp output.
        if (/print/.test(location.search + location.hash) && document.getElementById("resume")) {
            var go = function () { setTimeout(function () { window.print(); }, 300); };
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
            else window.addEventListener("load", go);
        }
    }

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
            try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) { }
            setThemeIcon(btn);
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
            // Close the mobile menu after tapping a link.
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

    /* --------------------- Scroll reveal + skill bars --------------------- */
    function fillBars(scope) {
        var bars = scope.querySelectorAll(".progress-bar[data-level]");
        for (var i = 0; i < bars.length; i++) {
            bars[i].style.width = bars[i].getAttribute("data-level") + "%";
        }
    }

    function initReveal() {
        var reveals = document.querySelectorAll(".reveal");

        if (!("IntersectionObserver" in window)) {
            for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("in-view");
            fillBars(document);
            return;
        }

        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in-view");
                fillBars(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        reveals.forEach(function (el) { io.observe(el); });
    }

    /* ------------------------- Live GitHub repos ------------------------- */
    function loadProjects() {
        var container = document.getElementById("gh-projects");
        if (!container) return;
        var user = container.getAttribute("data-user");

        fetch("https://api.github.com/users/" + user + "/repos?sort=updated&per_page=100")
            .then(function (r) {
                if (!r.ok) throw new Error("GitHub API " + r.status);
                return r.json();
            })
            .then(function (repos) {
                var list = repos
                    .filter(function (r) { return !r.fork && !r.archived; })
                    .sort(function (a, b) {
                        return (b.stargazers_count - a.stargazers_count) ||
                            (new Date(b.pushed_at) - new Date(a.pushed_at));
                    })
                    .slice(0, 6);

                if (!list.length) {
                    container.innerHTML = '<p class="text-secondary mb-0">No public repositories to show yet.</p>';
                    return;
                }
                container.innerHTML = list.map(renderRepo).join("");
            })
            .catch(function () {
                container.innerHTML =
                    '<p class="text-secondary mb-0">Couldn’t load projects right now. ' +
                    '<a href="https://github.com/' + user + '" target="_blank" rel="noopener">View them on GitHub →</a></p>';
            });
    }

    function renderRepo(repo) {
        var desc = repo.description ? escapeHtml(repo.description) : "No description provided.";
        var lang = repo.language
            ? '<span class="repo-meta"><i class="fa-solid fa-circle"></i>' + escapeHtml(repo.language) + "</span>"
            : "";
        var stars = repo.stargazers_count
            ? '<span class="repo-meta"><i class="fa-regular fa-star"></i>' + repo.stargazers_count + "</span>"
            : "";
        return '<a class="repo-card" href="' + repo.html_url + '" target="_blank" rel="noopener">' +
            '<div class="repo-name"><i class="fa-solid fa-code-branch"></i>' + escapeHtml(repo.name) + "</div>" +
            '<p class="repo-desc">' + desc + "</p>" +
            '<div class="repo-foot">' + lang + stars + "</div>" +
            "</a>";
    }

    /* ------------------------- Contact form (Web3Forms) ------------------------- */
    function initContactForm() {
        var form = document.getElementById("contact-form");
        if (!form) return;
        var status = document.getElementById("form-status");

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
                        setStatus(status, "Thanks! Your message has been sent.", "ok");
                    } else {
                        setStatus(status, data.message || "Something went wrong. Please try again.", "err");
                    }
                })
                .catch(function () {
                    setStatus(status, "Network error. Please try again.", "err");
                })
                .then(function () {
                    btn.disabled = false;
                    btn.innerHTML = label;
                });
        });
    }

    function setStatus(el, msg, kind) {
        if (!el) return;
        el.textContent = msg;
        el.className = "form-status" + (kind ? " " + kind : "");
    }

    /* ------------------------------- Helpers ------------------------------- */
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    /* ----------------------------- PWA service worker ----------------------------- */
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("/sw.js").catch(function () { });
        });
    }
})();

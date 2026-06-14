(function () {
    "use strict";

    var root = document.documentElement;

    document.addEventListener("DOMContentLoaded", function () {
        initThemeSwitch();
        initReveal();
        loadProjects();
        initContactForm();
    });

    /* ---------------------------- Theme toggle ---------------------------- */
    function initThemeSwitch() {
        var sw = document.getElementById("darkSwitch");
        if (!sw) return;
        sw.checked = root.classList.contains("dark-mode");
        sw.addEventListener("change", function () {
            var isDark = root.classList.toggle("dark-mode");
            try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) { }
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

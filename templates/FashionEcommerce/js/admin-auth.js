// ---------------------------------------------------------------------------
// Client-side gate for admin.html.
//
// IMPORTANT: this is OBFUSCATION, not real security. The page, its scripts, and
// the catalog data are all downloadable by anyone, and a determined visitor can
// bypass this gate. It only keeps casual users out. For real protection, serve
// admin.html behind server-side auth (HTTP Basic Auth, Netlify Identity,
// Cloudflare Access, etc.).
//
// The password is stored below as a SHA-256 hash (never in plaintext).
// Default password: "luxe-admin"  — CHANGE IT.
//
// To set your own password: open admin.html, open the browser console, run
//     await luxeHash('your-new-password')
// and paste the printed hash into ADMIN_PASS_HASH below.
// ---------------------------------------------------------------------------

const ADMIN_PASS_HASH = "1ac2202e904817f84430930eaedcb1b8c28b9993fb8034430016acb4347c0604";
const SESSION_KEY = "luxe_admin_session";

async function sha256Hex(text) {
  if (!(window.crypto && window.crypto.subtle)) {
    throw new Error("Secure context required — open this page via http://localhost or https, not file://.");
  }
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// Console helper for generating a hash of a new password.
window.luxeHash = async function (pwd) {
  const h = await sha256Hex(pwd);
  console.log("ADMIN_PASS_HASH =", h);
  return h;
};

function unlock() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("admin-app").classList.remove("hidden");
  if (typeof initAdmin === "function" && !window.__adminReady) {
    window.__adminReady = true;
    initAdmin();
  }
}

async function submitLogin(e) {
  e.preventDefault();
  const input = document.getElementById("login-pass");
  const err = document.getElementById("login-error");
  err.textContent = "";
  try {
    const hash = await sha256Hex(input.value);
    if (hash === ADMIN_PASS_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      unlock();
    } else {
      err.textContent = "Incorrect password.";
      input.select();
    }
  } catch (ex) {
    err.textContent = ex.message;
  }
}

function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// On load: skip the gate if already unlocked this session.
if (sessionStorage.getItem(SESSION_KEY) === "1") {
  unlock();
} else {
  document.getElementById("login-pass").focus();
}

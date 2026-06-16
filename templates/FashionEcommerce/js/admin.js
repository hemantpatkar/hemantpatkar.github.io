// Admin tool for managing the LUXE catalog. Fully client-side:
// edits are kept in a localStorage working copy (key = ADMIN_KEY, defined in
// products.js) that the storefront reads for live preview. "Export products.js"
// produces a drop-in replacement for js/products.js to publish for real.

let WORKING = [];
let editingId = null;

const $ = id => document.getElementById(id);
const money = n => "$" + Number(n).toFixed(2);
const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clone = obj => JSON.parse(JSON.stringify(obj));

/* ---------- state ---------- */
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_KEY));
    WORKING = saved && Array.isArray(saved.products) ? saved.products : clone(SEED_PRODUCTS);
  } catch { WORKING = clone(SEED_PRODUCTS); }
}
function persist() {
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ products: WORKING, savedAt: new Date().toISOString() }));
  renderStatus();
}
function isModified() {
  return JSON.stringify(WORKING) !== JSON.stringify(SEED_PRODUCTS);
}
function nextId() {
  return WORKING.reduce((m, p) => Math.max(m, p.id), 0) + 1;
}
function categoryOptions() {
  return [...new Set([...PREFERRED_CATEGORIES, ...WORKING.map(p => p.category)])];
}

/* ---------- render ---------- */
function renderStatus() {
  const modified = isModified();
  const el = $("status");
  el.innerHTML = modified
    ? `<span class="inline-flex items-center gap-1.5 text-amber-700"><span class="h-2 w-2 rounded-full bg-amber-500"></span>Unpublished changes in this browser — <button onclick="exportProductsJs()" class="underline font-medium">export products.js</button> to publish.</span>`
    : `<span class="inline-flex items-center gap-1.5 text-green-700"><span class="h-2 w-2 rounded-full bg-green-500"></span>In sync with the published catalog.</span>`;
  $("count").textContent = `${WORKING.length} product${WORKING.length !== 1 ? "s" : ""}`;
}

function renderTable() {
  const rows = WORKING.map(p => `
    <tr class="border-b border-gray-100 hover:bg-gray-50">
      <td class="p-2">
        <img src="${escapeHtml(p.image)}" alt="" class="h-14 w-12 object-cover rounded bg-gray-100"
             onerror="this.style.opacity=.25;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E'">
      </td>
      <td class="p-2">
        <div class="font-medium">${escapeHtml(p.name)}</div>
        <div class="text-xs text-gray-400">#${p.id}</div>
      </td>
      <td class="p-2"><span class="text-xs bg-gray-100 rounded-full px-2.5 py-1">${escapeHtml(p.category)}</span></td>
      <td class="p-2">
        <div class="flex items-center gap-1">
          <span class="text-gray-400">$</span>
          <input type="number" min="0" step="0.01" value="${p.price}"
                 onchange="changePrice(${p.id}, this.value)"
                 class="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-gray-900">
        </div>
      </td>
      <td class="p-2 text-sm text-gray-600">${p.rating}★</td>
      <td class="p-2 text-right whitespace-nowrap">
        <button onclick="openForm(${p.id})" class="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100">Edit</button>
        <button onclick="deleteProduct(${p.id})" class="text-sm px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50">Delete</button>
      </td>
    </tr>`).join("");

  $("table-body").innerHTML = rows || `<tr><td colspan="6" class="p-10 text-center text-gray-400">No products. Click “Add product”.</td></tr>`;
  renderStatus();
}

/* ---------- inline edit ---------- */
function changePrice(id, value) {
  const p = WORKING.find(x => x.id === id);
  if (!p) return;
  const n = parseFloat(value);
  if (!isNaN(n) && n >= 0) { p.price = n; persist(); }
}

function deleteProduct(id) {
  const p = WORKING.find(x => x.id === id);
  if (!p || !confirm(`Delete “${p.name}”? This only changes your working copy.`)) return;
  WORKING = WORKING.filter(x => x.id !== id);
  persist();
  renderTable();
}

/* ---------- add / edit form ---------- */
function openForm(id = null) {
  editingId = id;
  const p = id != null ? WORKING.find(x => x.id === id) : null;
  $("form-title").textContent = p ? `Edit “${p.name}”` : "Add product";
  $("f-name").value = p ? p.name : "";
  $("f-category").value = p ? p.category : "";
  $("f-price").value = p ? p.price : "";
  $("f-rating").value = p ? p.rating : 4.5;
  $("f-image").value = p ? p.image : "";
  $("f-desc").value = p ? p.desc : "";
  updatePreview();
  $("modal").classList.remove("hidden");
  $("f-name").focus();
}
function closeForm() { $("modal").classList.add("hidden"); editingId = null; }

function updatePreview() {
  const src = $("f-image").value.trim();
  const img = $("f-preview");
  if (src) { img.src = src; img.classList.remove("hidden"); $("f-preview-empty").classList.add("hidden"); }
  else { img.classList.add("hidden"); $("f-preview-empty").classList.remove("hidden"); }
}

function handleImageFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { $("f-image").value = e.target.result; updatePreview(); };
  reader.readAsDataURL(file);
}

function submitForm(e) {
  e.preventDefault();
  const name = $("f-name").value.trim();
  const category = $("f-category").value.trim();
  const price = parseFloat($("f-price").value);
  const rating = parseFloat($("f-rating").value);
  const image = $("f-image").value.trim();
  const desc = $("f-desc").value.trim();

  if (!name) return alert("Name is required.");
  if (!category) return alert("Category is required.");
  if (isNaN(price) || price < 0) return alert("Enter a valid price.");
  const safeRating = isNaN(rating) ? 4.5 : Math.min(5, Math.max(0, rating));

  if (editingId != null) {
    const p = WORKING.find(x => x.id === editingId);
    Object.assign(p, { name, category, price, rating: safeRating, image, desc });
  } else {
    WORKING.push({ id: nextId(), name, category, price, rating: safeRating, image: image || "", desc });
  }
  persist();
  renderTable();
  closeForm();
}

/* ---------- import / export / reset ---------- */
function download(filename, text, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function productsJsText() {
  const lines = WORKING.map(p => "  " + JSON.stringify(p)).join(",\n");
  return `// Product catalog for the LUXE fashion storefront.
// Generated by admin.html. Edit by hand or via the admin tool.

const SEED_PRODUCTS = [
${lines}
];

const ADMIN_KEY = "luxe_admin_catalog";

// Use the admin working copy from localStorage if present (live preview of edits).
let PRODUCTS = SEED_PRODUCTS;
try {
  const saved = JSON.parse(localStorage.getItem(ADMIN_KEY));
  if (saved && Array.isArray(saved.products) && saved.products.length) PRODUCTS = saved.products;
} catch (e) { /* ignore malformed working copy */ }

// Categories derive from the catalog so new ones appear in the shop filter.
const PREFERRED_CATEGORIES = ["Women", "Men", "Shoes", "Accessories"];
const presentCats = [...new Set(PRODUCTS.map(p => p.category))];
const CATEGORIES = ["All",
  ...PREFERRED_CATEGORIES.filter(c => presentCats.includes(c)),
  ...presentCats.filter(c => !PREFERRED_CATEGORIES.includes(c)).sort()
];
`;
}

function exportProductsJs() {
  download("products.js", productsJsText(), "text/javascript");
  alert("Downloaded products.js.\n\nReplace js/products.js with this file to publish your changes for all visitors.");
}
function exportJson() {
  download("catalog.json", JSON.stringify(WORKING, null, 2), "application/json");
}

function importJson(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const arr = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(arr)) throw new Error("Expected an array of products or { products: [...] }.");
      let maxId = 0;
      WORKING = arr.map(p => {
        if (!p.name || p.price == null) throw new Error("Each product needs at least a name and price.");
        const id = Number.isInteger(p.id) ? p.id : ++maxId;
        maxId = Math.max(maxId, id);
        return { id, name: String(p.name), category: String(p.category || "Uncategorized"),
                 price: Number(p.price), image: String(p.image || ""),
                 rating: p.rating != null ? Number(p.rating) : 4.5, desc: String(p.desc || "") };
      });
      persist(); renderTable();
      alert(`Imported ${WORKING.length} products into your working copy.`);
    } catch (err) { alert("Import failed: " + err.message); }
    input.value = "";
  };
  reader.readAsText(file);
}

function resetWorking() {
  if (!confirm("Discard your working copy and reset to the published catalog?")) return;
  localStorage.removeItem(ADMIN_KEY);
  WORKING = clone(SEED_PRODUCTS);
  renderTable();
}

/* ---------- init (called by the auth gate after unlock) ---------- */
function initAdmin() {
  load();
  renderTable();
  $("f-image").addEventListener("input", updatePreview);
  $("cat-list").innerHTML = categoryOptions().map(c => `<option value="${c}">`).join("");
}

// asset data lives here - persists in localStorage so it survives page refresh
let assets = JSON.parse(localStorage.getItem("it_assets") || "[]");
let editingId = null;

// seed some demo data if first time
if (assets.length === 0) {
  assets = [
    { id: "AST-001", name: "Dell Latitude 5420", type: "Laptop",  serial: "SN-2024-001", user: "Alice Johnson",  location: "Office 2A", status: "Active",    notes: "Assigned after onboarding" },
    { id: "AST-002", name: "HP EliteDesk 800",   type: "Desktop", serial: "SN-2024-002", user: "Bob Mensah",    location: "Office 1B", status: "Active",    notes: "" },
    { id: "AST-003", name: "Dell PowerEdge R740", type: "Server",  serial: "SN-2023-010", user: "IT Dept",       location: "Server Room", status: "Active",  notes: "Primary file server" },
    { id: "AST-004", name: "HP LaserJet Pro",     type: "Printer", serial: "SN-2022-033", user: "Shared",        location: "Floor 2",   status: "In Repair", notes: "Paper jam issue, sent to vendor" },
    { id: "AST-005", name: "Cisco SG350 Switch",  type: "Switch",  serial: "SN-2021-007", user: "IT Dept",       location: "Server Room", status: "Active",  notes: "24-port managed switch" },
    { id: "AST-006", name: "Lenovo ThinkPad X1",  type: "Laptop",  serial: "SN-2020-044", user: "Carol Davies",  location: "Remote",    status: "Retired",   notes: "Replaced - battery failure" },
  ];
  saveAssets();
}

function saveAssets() {
  localStorage.setItem("it_assets", JSON.stringify(assets));
}

function generateId() {
  const nums = assets.map(a => parseInt(a.id.replace("AST-", "")) || 0);
  const next  = nums.length ? Math.max(...nums) + 1 : 1;
  return "AST-" + String(next).padStart(3, "0");
}

function statusBadge(status) {
  const map = {
    "Active":    "badge-active",
    "In Repair": "badge-repair",
    "Retired":   "badge-retired",
  };
  return `<span class="badge ${map[status] || ''}">${status}</span>`;
}


// --- views ---

function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelector(`[data-view="${name}"]`).classList.add("active");
  document.getElementById("page-title").textContent =
    name === "dashboard" ? "Dashboard" : name === "assets" ? "All Assets" : "Add Asset";

  if (name === "dashboard") renderDashboard();
  if (name === "assets")    renderAssets();
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showView(link.dataset.view);
  });
});


// --- dashboard ---

function renderDashboard() {
  document.getElementById("stat-total").textContent   = assets.length;
  document.getElementById("stat-active").textContent  = assets.filter(a => a.status === "Active").length;
  document.getElementById("stat-repair").textContent  = assets.filter(a => a.status === "In Repair").length;
  document.getElementById("stat-retired").textContent = assets.filter(a => a.status === "Retired").length;

  const recent = [...assets].slice(-5).reverse();
  const tbody  = document.getElementById("recent-body");

  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">No assets yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.name}</td>
      <td>${a.type}</td>
      <td>${a.user || "-"}</td>
      <td>${statusBadge(a.status)}</td>
    </tr>
  `).join("");
}


// --- all assets ---

function renderAssets(list = null) {
  const typeFilter   = document.getElementById("filter-type").value;
  const statusFilter = document.getElementById("filter-status").value;
  const search       = document.getElementById("search-input").value.toLowerCase();

  let filtered = list || assets;

  if (typeFilter)   filtered = filtered.filter(a => a.type === typeFilter);
  if (statusFilter) filtered = filtered.filter(a => a.status === statusFilter);
  if (search)       filtered = filtered.filter(a =>
    a.name.toLowerCase().includes(search) ||
    a.user.toLowerCase().includes(search) ||
    a.id.toLowerCase().includes(search)   ||
    a.location.toLowerCase().includes(search)
  );

  const tbody = document.getElementById("assets-body");

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty">No assets match the current filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.name}</td>
      <td>${a.type}</td>
      <td>${a.user || "-"}</td>
      <td>${a.location || "-"}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        <button class="btn-edit"   onclick="openEdit('${a.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteAsset('${a.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

document.getElementById("filter-type").addEventListener("change",   () => renderAssets());
document.getElementById("filter-status").addEventListener("change", () => renderAssets());
document.getElementById("clear-filters").addEventListener("click",  () => {
  document.getElementById("filter-type").value   = "";
  document.getElementById("filter-status").value = "";
  renderAssets();
});
document.getElementById("search-input").addEventListener("input", () => {
  const view = document.querySelector(".view.active").id;
  if (view === "view-assets") renderAssets();
});


// --- add asset ---

document.getElementById("add-btn").addEventListener("click", () => {
  const name     = document.getElementById("f-name").value.trim();
  const type     = document.getElementById("f-type").value;
  const serial   = document.getElementById("f-serial").value.trim();
  const user     = document.getElementById("f-user").value.trim();
  const location = document.getElementById("f-location").value.trim();
  const status   = document.getElementById("f-status").value;
  const notes    = document.getElementById("f-notes").value.trim();
  const msg      = document.getElementById("form-msg");

  if (!name || !type) {
    msg.style.color = "#ef4444";
    msg.textContent = "Name and type are required.";
    return;
  }

  assets.push({ id: generateId(), name, type, serial, user, location, status, notes });
  saveAssets();

  // clear form
  ["f-name","f-serial","f-user","f-location","f-notes"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("f-type").value   = "";
  document.getElementById("f-status").value = "Active";

  msg.style.color = "#22c55e";
  msg.textContent = "Asset added successfully.";
  setTimeout(() => msg.textContent = "", 3000);
});

document.getElementById("clear-btn").addEventListener("click", () => {
  ["f-name","f-serial","f-user","f-location","f-notes"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("f-type").value   = "";
  document.getElementById("f-status").value = "Active";
  document.getElementById("form-msg").textContent = "";
});


// --- edit ---

function openEdit(id) {
  const asset = assets.find(a => a.id === id);
  if (!asset) return;

  editingId = id;
  document.getElementById("e-name").value     = asset.name;
  document.getElementById("e-type").value     = asset.type;
  document.getElementById("e-user").value     = asset.user;
  document.getElementById("e-location").value = asset.location;
  document.getElementById("e-status").value   = asset.status;
  document.getElementById("e-notes").value    = asset.notes;
  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("save-edit-btn").addEventListener("click", () => {
  const idx = assets.findIndex(a => a.id === editingId);
  if (idx === -1) return;

  assets[idx].name     = document.getElementById("e-name").value.trim();
  assets[idx].type     = document.getElementById("e-type").value;
  assets[idx].user     = document.getElementById("e-user").value.trim();
  assets[idx].location = document.getElementById("e-location").value.trim();
  assets[idx].status   = document.getElementById("e-status").value;
  assets[idx].notes    = document.getElementById("e-notes").value.trim();

  saveAssets();
  closeModal();
  renderAssets();
});

document.getElementById("cancel-edit-btn").addEventListener("click", closeModal);

document.getElementById("modal").addEventListener("click", e => {
  if (e.target === document.getElementById("modal")) closeModal();
});

function closeModal() {
  editingId = null;
  document.getElementById("modal").classList.add("hidden");
}


// --- delete ---

function deleteAsset(id) {
  if (!confirm("Delete this asset? This cannot be undone.")) return;
  assets = assets.filter(a => a.id !== id);
  saveAssets();
  renderDashboard();
  renderAssets();
}


// init
renderDashboard();

// =========================
// GLOBAL ALERT
// =========================
function showGA(message, type = "err") {
  const el = document.getElementById("gAlert");
  const msg = document.getElementById("gMsg");

  el.className = "alert alert-" + type + " show";
  msg.textContent = message;
}

// =========================
// ERROR HANDLING
// =========================
function fErr(id, message) {
  const wrapper = document.getElementById("ferr-" + id);
  const input = document.getElementById(id + "File");

  if (!wrapper) return;

  wrapper.classList.add("show");
  wrapper.querySelector("span").textContent = message;

  if (input) input.classList.add("err");
}

function fClr(id) {
  const wrapper = document.getElementById("ferr-" + id);
  const input = document.getElementById(id + "File");

  if (wrapper) wrapper.classList.remove("show");
  if (input) input.classList.remove("err");
}

// =========================
// CHECK FILE EXISTENCE
// =========================
function hasFile(id) {
  const el = document.getElementById(id);
  return el && el.files && el.files.length > 0;
}

// =========================
// STEP 2 SUBMIT
// =========================
function submitStep2() {
  let valid = true;

  ["coe", "id"].forEach(fClr);

  if (!hasFile("coeFile")) {
    fErr("coe", "COE is required.");
    valid = false;
  }

  if (!hasFile("idFile")) {
    fErr("id", "School ID is required.");
    valid = false;
  }

  if (!valid) {
    showGA("Please upload all required documents.");
    return;
  }
  const email = sessionStorage.getItem("userEmail");

  if (!email) {
    showGA("Session expired. Please go back to Step 1.");
    return;
  }
  // Go to next step
  window.location.href = "signup-step3.html";
}

// =========================
// FILE UPLOAD SETTINGS
// =========================
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const DEFAULT_ICONS = {
  coe: "fa-cloud-arrow-up",
  id: "fa-id-card",
};

// =========================
// HANDLE FILE INPUT
// =========================
function hf(input, zone, preview, icon, text, key) {
  const file = input.files[0];
  if (!file) return;

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    showGA("Invalid file type. Use PDF, JPG, or PNG.");
    input.value = "";
    return;
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    showGA("File size must not exceed 5MB.");
    input.value = "";
    return;
  }

  // Update UI
  const zoneEl = document.getElementById(zone);
  const iconEl = document.getElementById(icon);
  const textEl = document.getElementById(text);
  const prevEl = document.getElementById(preview);

  zoneEl.classList.add("done");

  iconEl.className = "fa-solid fa-circle-check";
  textEl.textContent = "File ready ✓";

  const ext = file.name.split(".").pop().toLowerCase();
  const isPDF = file.type === "application/pdf";

  prevEl.innerHTML = `
      <i class="fa-solid ${isPDF ? "fa-file-pdf" : "fa-file-image"}"></i>
      <span class="fn">${file.name}</span>
      <span style="color:var(--gray-400);font-size:10px;flex-shrink:0">
        ${(file.size / 1024).toFixed(0)}KB
      </span>
      <button class="rm-btn" onclick="rmf('${input.id}','${zone}','${preview}','${icon}','${text}','${key}')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

  prevEl.classList.add("show");
}

// =========================
// REMOVE FILE
// =========================
function rmf(inputId, zone, preview, icon, text, key) {
  const input = document.getElementById(inputId);
  const zoneEl = document.getElementById(zone);
  const iconEl = document.getElementById(icon);
  const textEl = document.getElementById(text);
  const prevEl = document.getElementById(preview);

  input.value = "";

  zoneEl.classList.remove("done");

  iconEl.className = "fa-solid " + (DEFAULT_ICONS[key] || "fa-cloud-arrow-up");
  textEl.textContent = "Click or drag & drop";

  prevEl.classList.remove("show");
  prevEl.innerHTML = "";
}

// =========================
// DRAG & DROP EVENTS
// =========================
function dv(e, zone) {
  e.preventDefault();
  document.getElementById(zone).classList.add("dv");
}

function dl(e, zone) {
  document.getElementById(zone).classList.remove("dv");
}

function dd(e, inputId, zone, preview, icon, text, key) {
  e.preventDefault();
  document.getElementById(zone).classList.remove("dv");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const dt = new DataTransfer();
  dt.items.add(file);

  const input = document.getElementById(inputId);
  input.files = dt.files;

  hf(input, zone, preview, icon, text, key);
}

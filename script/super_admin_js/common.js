/**
 * Shared functions for Super Admin portal
 */

/**
 * Shows a toast notification
 * @param {string} title 
 * @param {string} message 
 * @param {string} type - 'success', 'warning', 'error'
 */
function showToast(title, message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) {
    const fallback = document.getElementById("toast-container");
    if (fallback) {
      createLegacyToast(fallback, title, message, type);
      return;
    }
    console.warn("Toast container not found");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  let icon = "fa-check";
  if (type === "warning") icon = "fa-triangle-exclamation";
  if (type === "error") icon = "fa-circle-xmark";
  
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="toast-content">
      <span class="toast-title">${title}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function createLegacyToast(container, title, message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  let icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-times-circle';
  if (type === 'info') icon = 'fa-info-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/**
 * Common modal operations
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    const toggle = document.getElementById(id + "Toggle");
    if (toggle) toggle.checked = false;
  }
}

/**
 * Shared Confirmation Modal Logic
 */
let confirmCallback = null;

function showConfirmModal(options) {
  const modal = document.getElementById("confirmModal");
  const icon = document.getElementById("confirmIcon");
  const title = document.getElementById("confirmTitle");
  const msg = document.getElementById("confirmMessage");
  const inputCont = document.getElementById("confirmInputContainer");
  const inputLabel = document.getElementById("confirmInputLabel");
  const inputEl = document.getElementById("confirmInput");
  const submitBtn = document.getElementById("submitConfirmBtn");

  if (!modal) return;

  if (title) title.innerText = options.title || "Confirm Action";
  if (msg) msg.innerText = options.message || "Are you sure?";

  if (icon) {
    if (options.type === "approve") {
      icon.style.color = "#10b981";
      icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    } else {
      icon.style.color = "#ef4444";
      icon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }
  }

  if (submitBtn) {
    if (options.type === "approve") {
      submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      submitBtn.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.2)";
    } else {
      submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
      submitBtn.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.2)";
    }
  }

  if (inputCont) {
    if (options.requireInput) {
      inputCont.style.display = "block";
      if (inputLabel) inputLabel.innerText = options.inputLabel || "Reason";
      if (inputEl) {
        inputEl.value = "";
        inputEl.placeholder = options.inputPlaceholder || "Enter reason...";
      }
    } else {
      inputCont.style.display = "none";
    }
  }

  confirmCallback = options.onConfirm;
  openModal("confirmModal");
}

document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancelConfirmBtn");
  const submitBtn = document.getElementById("submitConfirmBtn");
  const inputEl = document.getElementById("confirmInput");

  if (cancelBtn) cancelBtn.addEventListener("click", () => { closeModal("confirmModal"); confirmCallback = null; });
  if (submitBtn) submitBtn.addEventListener("click", () => {
    const inputCont = document.getElementById("confirmInputContainer");
    let inputValue = null;
    if (inputCont && inputCont.style.display === "block") {
      inputValue = inputEl.value.trim();
      if (!inputValue) { alert("Please enter a reason."); return; }
    }
    if (confirmCallback) confirmCallback(inputValue);
    closeModal("confirmModal");
    confirmCallback = null;
  });
});

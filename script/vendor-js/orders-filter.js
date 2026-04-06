/**
 * ============================================================
 *  orders-filter.js  –  State-based Orders Dashboard Filter
 *                       + All Action Buttons → Confirmation Modal
 * ============================================================
 *
 *  Every action button (Accept, Decline, Mark Ready, Complete)
 *  shows a single shared confirmation modal before acting.
 *
 *  The modal is fully dynamic — title, icon, color, subtitle,
 *  and confirm-button text/style are driven by MODAL_CONFIG.
 * ============================================================
 */

(function () {
  "use strict";

  /* ── 1. DOM REFERENCES ─────────────────────────────────── */

  const filterTabs  = document.getElementById("filterTabs");
  const ordersList  = document.querySelector(".orders-list");
  const noOrdersMsg = document.getElementById("noOrdersMsg");

  // Shared confirmation modal
  const confirmModal      = document.getElementById("confirmModal");
  const confirmOverlay    = document.getElementById("confirmOverlay");
  const closeConfirmModal = document.getElementById("closeConfirmModal");
  const cancelConfirmModal= document.getElementById("cancelConfirmModal");
  const confirmActionBtn  = document.getElementById("confirmActionBtn");

  // Dynamic modal content nodes
  const modalHeaderIcon   = document.getElementById("modalHeaderIcon");
  const modalHeaderTitle  = document.getElementById("modalHeaderTitle");
  const modalSubtitle     = document.getElementById("modalSubtitle");
  const modalDetail       = document.getElementById("modalDetail");
  const confirmBtnIcon    = document.getElementById("confirmBtnIcon");
  const confirmBtnText    = document.getElementById("confirmBtnText");

  /* ── 2. APPLICATION STATE ──────────────────────────────── */

  let activeFilter = "Pending";   // active tab filter
  let pendingCard       = null;    // card waiting for confirmation
  let pendingAction     = null;    // action waiting for confirmation

  /* ── 3. MODAL CONFIGURATION PER ACTION ─────────────────── */

  /**
   * Each key matches a data-action attribute value.
   * - title        : modal header text
   * - iconClass    : Font Awesome classes for the header icon
   * - iconColor    : color of the header icon
   * - subtitle     : explanation text (HTML allowed)
   * - btnClass     : CSS class applied to the confirm button
   * - btnIconClass : Font Awesome classes for the confirm button icon
   * - btnLabel     : text shown inside the confirm button
   */
  const MODAL_CONFIG = {

    accept: {
      title:       "Confirm Order",
      iconClass:   "fa-solid fa-circle-check",
      iconColor:   "#16a34a",
      subtitle:    "Are you sure you want to <strong>accept</strong> this order? It will move to <strong>Preparing</strong> status.",
      btnClass:    "btn-confirm-accept",
      btnIconClass:"fas fa-check",
      btnLabel:    "Yes, Accept Order",
    },

    decline: {
      title:       "Decline Order",
      iconClass:   "fa-solid fa-circle-xmark",
      iconColor:   "#dc2626",
      subtitle:    "Are you sure you want to <strong>decline</strong> this order? It will be marked as <strong>Cancelled</strong>. This cannot be undone.",
      btnClass:    "btn-confirm-decline",
      btnIconClass:"fas fa-times",
      btnLabel:    "Yes, Decline Order",
    },

    markReady: {
      title:       "Mark as Ready",
      iconClass:   "fa-solid fa-bell",
      iconColor:   "#2563eb",
      subtitle:    "Mark this order as <strong>Ready for Pickup</strong>? The customer will be notified to collect their order.",
      btnClass:    "btn-confirm-ready",
      btnIconClass:"fas fa-bell",
      btnLabel:    "Yes, Mark Ready",
    },

    complete: {
      title:       "Complete Order",
      iconClass:   "fa-solid fa-bag-shopping",
      iconColor:   "#7c3aed",
      subtitle:    "Mark this order as <strong>Completed</strong>? This confirms the customer has received their order.",
      btnClass:    "btn-confirm-complete",
      btnIconClass:"fas fa-bag-shopping",
      btnLabel:    "Yes, Complete Order",
    },
  };

  /* ── 4. STATUS TRANSITION MAP ──────────────────────────── */

  const STATUS_TRANSITIONS = {

    accept: {
      newStatus:   "Preparing",
      badgeClass:  "preparing",
      badgeText:   "Preparing",
      accentClass: "accent-preparing",
      iconClass:   "fa-solid fa-fire-burner",
      iconBgClass: "ic-preparing",
      nextButtons: `<button class="btn-action btn-ready" data-action="markReady">
                     <i class="fas fa-bell"></i> Mark Ready
                   </button>`,
    },

    decline: {
      newStatus:   "Cancelled",
      badgeClass:  "cancelled",
      badgeText:   "Cancelled",
      accentClass: "accent-cancelled",
      iconClass:   "fa-solid fa-ban",
      iconBgClass: "ic-cancelled",
      nextButtons: "",
    },

    markReady: {
      newStatus:   "Ready",
      badgeClass:  "ready",
      badgeText:   "Ready",
      accentClass: "accent-ready",
      iconClass:   "fa-solid fa-check-circle",
      iconBgClass: "ic-ready",
      nextButtons: `<button class="btn-action btn-complete" data-action="complete">
                     <i class="fas fa-bag-shopping"></i> Complete
                   </button>`,
    },

    complete: {
      newStatus:   "Completed",
      badgeClass:  "completed",
      badgeText:   "Completed",
      accentClass: "accent-completed",
      iconClass:   "fa-solid fa-check-double",
      iconBgClass: "ic-completed",
      nextButtons: "",
    },
  };

  /* ── 5. HELPERS ────────────────────────────────────────── */

  function countByStatus(status) {
    const cards = ordersList.querySelectorAll(".order-card");
    if (status === "All") return cards.length;
    let n = 0;
    cards.forEach((c) => { if (c.dataset.status === status) n++; });
    return n;
  }

  function refreshCounts() {
    ["All","Pending","Preparing","Ready","Completed","Cancelled"].forEach((s) => {
      const badge = document.getElementById("count-" + s);
      if (badge) badge.textContent = countByStatus(s);
    });
  }

  function applyFilter() {
    const cards = ordersList.querySelectorAll(".order-card");
    let visible = 0;
    cards.forEach((card) => {
      const match = activeFilter === "All" || card.dataset.status === activeFilter;
      card.classList.toggle("card-hidden", !match);
      if (match) visible++;
    });
    noOrdersMsg.classList.toggle("visible", visible === 0);
  }

  function syncTabHighlight() {
    filterTabs.querySelectorAll(".filter-btn").forEach((btn) => {
      const isActive = btn.dataset.tab === activeFilter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  /* ── 6. CONFIRMATION MODAL ─────────────────────────────── */

  /**
   * Extracts order details from a card and returns a clean
   * summary object for the modal detail block.
   */
  function getCardDetails(card) {
    const name = card.querySelector(".order-card-title")?.textContent?.trim() || "—";

    const metaSpans = card.querySelectorAll(".order-meta span");
    const orderId = metaSpans[0]
      ? [...metaSpans[0].childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join("")
          .replace(/^#?\s*/, "#")
      : "—";

    const items = [...card.querySelectorAll(".order-item-row")]
      .map((r) => r.textContent.trim().replace(/\s{2,}/g, " "))
      .join(" · ") || "—";

    const totalSpan = card.querySelector(".order-total-row > span");
    const total     = totalSpan?.textContent?.trim() || "—";

    const imgEl = card.querySelector(".order-image");
    const image = imgEl ? imgEl.src : "";

    return { name, orderId, items, total, image };
  }

  /**
   * Opens the shared modal, configuring it for the given action.
   * Stores pendingCard and pendingAction for the confirm handler.
   */
  function openConfirmModal(card, action) {
    pendingCard   = card;
    pendingAction = action;

    const cfg = MODAL_CONFIG[action];
    const det = getCardDetails(card);

    // ── Populate modal header ──────────────────────────────
    modalHeaderIcon.className    = cfg.iconClass;
    modalHeaderIcon.style.color  = cfg.iconColor;
    modalHeaderTitle.textContent = cfg.title;

    // ── Populate subtitle ──────────────────────────────────
    modalSubtitle.innerHTML = cfg.subtitle;

    // ── Populate order detail card ─────────────────────────
    // Styled consistently with the student order modal design
    modalDetail.innerHTML = `
        <div class="pickup-code-card" style="background: ${cfg.iconColor}">
          <div class="pickup-code-label">Order ID</div>
          <div class="pickup-code-value" style="font-size:32px">${det.orderId}</div>
          <div class="pickup-code-order">Customer: ${det.name}</div>
        </div>
        ${det.image ? '<img src="' + det.image + '" class="modal-order-image" alt="Order image" />' : ""}
        <div class="modal-order-items">
          <div style="display:flex; justify-content:space-between; font-size:14px; padding:4px 0; color:#374151;">
            <span>${det.items}</span>
          </div>
        </div>
        <div class="modal-total-price" style="margin-bottom: 0;">
          ${det.total}
        </div>
    `;

    // ── Style & label the confirm button ───────────────────
    confirmActionBtn.className    = cfg.btnClass;
    confirmBtnIcon.className      = cfg.btnIconClass;
    confirmBtnText.textContent    = cfg.btnLabel;

    // ── Show the modal ─────────────────────────────────────
    confirmModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  /** Closes the modal and resets pending state. */
  function closeModal() {
    confirmModal.classList.remove("active");
    document.body.style.overflow = "";
    pendingCard   = null;
    pendingAction = null;
  }

  // Wire up all close triggers
  [confirmOverlay, closeConfirmModal, cancelConfirmModal].forEach((el) => {
    if (el) el.addEventListener("click", closeModal);
  });

  // Confirm button → actually perform the action
  if (confirmActionBtn) {
    confirmActionBtn.addEventListener("click", () => {
      if (pendingCard && pendingAction) {
        handleAction(pendingCard, pendingAction);
      }
      closeModal();
    });
  }

  /* ── 7. ACTION HANDLER ─────────────────────────────────── */

  /** Mutates the card DOM to reflect its new status. */
  function handleAction(card, action) {
    const t = STATUS_TRANSITIONS[action];
    if (!t) return;

    card.dataset.status = t.newStatus;

    // Accent bar
    const accent = card.querySelector(".order-card-accent");
    if (accent) accent.className = "order-card-accent " + t.accentClass;

    // Status badge
    const badge = card.querySelector(".status-badge");
    if (badge) { badge.className = "status-badge " + t.badgeClass; badge.textContent = t.badgeText; }

    // Store icon
    const iconWrap = card.querySelector(".order-store-icon");
    if (iconWrap) {
      iconWrap.className = "order-store-icon " + t.iconBgClass;
      const iEl = iconWrap.querySelector("i");
      if (iEl) iEl.className = t.iconClass;
    }

    // Action buttons
    const actionsDiv = card.querySelector(".order-actions");
    if (actionsDiv) {
      if (t.nextButtons) { actionsDiv.innerHTML = t.nextButtons; }
      else               { actionsDiv.remove(); }
    }

    applyFilter();
    refreshCounts();
  }

  /* ── 8. EVENT DELEGATION ───────────────────────────────── */

  function initFilterTabs() {
    filterTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const newFilter = btn.dataset.tab;
      if (newFilter === activeFilter) return;
      activeFilter = newFilter;
      syncTabHighlight();
      applyFilter();
    });
  }

  /**
   * All action buttons route through the confirmation modal.
   * The modal config determines the wording/color per action.
   */
  function initActionButtons() {
    ordersList.addEventListener("click", (e) => {
      const btn  = e.target.closest("[data-action]");
      if (!btn) return;
      const card   = btn.closest(".order-card");
      const action = btn.dataset.action;
      if (!card || !action || !MODAL_CONFIG[action]) return;

      // All actions → show confirmation modal first
      openConfirmModal(card, action);
    });
  }

  /* ── 9. BOOTSTRAP ──────────────────────────────────────── */

  function init() {
    refreshCounts();
    initFilterTabs();
    initActionButtons();
    syncTabHighlight();
    applyFilter();
  }

  init();
})();


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

  let activeFilter = "Queue";   // active tab filter
  let QueueCard       = null;    // card waiting for confirmation
  let QueueAction     = null;    // action waiting for confirmation

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
      btnLabel:    "Confirm",
    },

    decline: {
      title:       "Decline Order",
      iconClass:   "fa-solid fa-circle-xmark",
      iconColor:   "#dc2626",
      subtitle:    "Are you sure you want to <strong>decline</strong> this order? It will be marked as <strong>Cancelled</strong>. This cannot be undone.",
      btnClass:    "btn-confirm-decline",
      btnIconClass:"fas fa-times",
      btnLabel:    "Confirm",
    },

    markReady: {
      title:       "Mark as Ready",
      iconClass:   "fa-solid fa-bell",
      iconColor:   "#2563eb",
      subtitle:    "Mark this order as <strong>Ready for Pickup</strong>? The customer will be notified to collect their order.",
      btnClass:    "btn-confirm-ready",
      btnIconClass:"fas fa-bell",
      btnLabel:    "Confirm",
    },

    complete: {
      title:       "Complete Order",
      iconClass:   "fa-solid fa-bag-shopping",
      iconColor:   "#7c3aed",
      subtitle:    "Mark this order as <strong>Completed</strong>? This confirms the customer has received their order.",
      btnClass:    "btn-confirm-complete",
      btnIconClass:"fas fa-bag-shopping",
      btnLabel:    "Confirm",
    },

    deleteHistory: {
      title:       "Delete Order",
      iconClass:   "fa-solid fa-trash",
      iconColor:   "#ef4444",
      subtitle:    "Are you sure you want to <strong>delete</strong> this order? This action cannot be undone.",
      btnClass:    "btn-confirm-delete",
      btnIconClass:"fas fa-trash",
      btnLabel:    "Remove",
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
      nextButtons: null,
    },

    markReady: {
      newStatus:   "Ready",
      badgeClass:  "ready",
      badgeText:   "Ready",
      accentClass: "accent-ready",
      iconClass:   "fa-solid fa-check-circle",
      iconBgClass: "ic-ready",
      nextButtons: `<button class="pickup-btn" data-action="complete">
                     <i class="fas fa-bag-shopping"></i> Mark as Picked Up
                   </button>
                   <button class="view-code-btn open-code-btn" data-code="A7C3">
                     <i class="fa-solid fa-qrcode"></i> View Pickup Code
                   </button>`,
    },

    complete: {
      newStatus:   "Completed",
      badgeClass:  "completed",
      badgeText:   "Completed",
      accentClass: "accent-completed",
      iconClass:   "fa-solid fa-check-double",
      iconBgClass: "ic-completed",
      nextButtons: null,
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
    ["Queue","Preparing","Ready","Completed","Cancelled"].forEach((s) => {
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

    const idSpan = card.querySelector(".order-id-val");
    const orderId = idSpan ? idSpan.textContent.trim() : "—";

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
   * Stores QueueCard and QueueAction for the confirm handler.
   */
  function openConfirmModal(card, action) {
    QueueCard   = card;
    QueueAction = action;

    const cfg = MODAL_CONFIG[action];
    const det = getCardDetails(card);

    // ── Populate modal header ──────────────────────────────
    modalHeaderIcon.className    = cfg.iconClass;
    modalHeaderIcon.style.color  = cfg.iconColor;
    modalHeaderTitle.textContent = cfg.title;

    // ── Populate subtitle ──────────────────────────────────
    modalSubtitle.innerHTML = cfg.subtitle;

    // ── Populate order detail card ─────────────────────────
    modalDetail.innerHTML = `
        <div class="pickup-code-card" style="background: ${cfg.iconColor}; padding: 20px;">
          <div class="pickup-code-label" style="opacity: 0.9; font-size: 13px;">CONFIRM ORDER ID</div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 12px 0;">
            <div class="pickup-code-value" style="font-size: 36px; margin: 0; letter-spacing: 2px; font-family: monospace;">${det.orderId}</div>
            <button id="modalCopyIdBtn" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s;" title="Copy ID">
              <i class="fa-regular fa-copy"></i>
            </button>
          </div>
          <div class="pickup-code-order" style="opacity: 0.9; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; margin-top: 4px;">
            <i class="fa-solid fa-user" style="margin-right: 6px; font-size: 12px;"></i> ${det.name}
          </div>
        </div>
        <div style="padding: 16px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          ${det.image ? '<img src="' + det.image + '" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" alt="Order image" />' : ""}
          <div style="font-size: 14px; color: #475569; margin-bottom: 8px; font-weight: 500;">Order Items:</div>
          <div style="font-size: 14px; color: #1e293b; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #f1f5f9; line-height: 1.5;">
            ${det.items}
          </div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #64748b; font-size: 13px;">Total Amount:</span>
            <span style="font-weight: 800; color: #1e293b; font-size: 18px;">${det.total}</span>
          </div>
        </div>
    `;

    // Add copy listener for the modal button
    const copyBtn = document.getElementById("modalCopyIdBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(det.orderId).then(() => {
          const icon = copyBtn.querySelector("i");
          icon.className = "fa-solid fa-check";
          copyBtn.style.background = "#16a34a";
          setTimeout(() => {
            icon.className = "fa-regular fa-copy";
            copyBtn.style.background = "rgba(255,255,255,0.2)";
          }, 2000);
        });
      });
    }

    // ── Style & label the confirm button ───────────────────
    confirmActionBtn.className    = cfg.btnClass;
    confirmBtnIcon.className      = cfg.btnIconClass;
    confirmBtnText.textContent    = cfg.btnLabel;

    // ── Show the modal ─────────────────────────────────────
    confirmModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    confirmModal.classList.remove("active");
    document.body.style.overflow = "";
    QueueCard   = null;
    QueueAction = null;
    
    // Reset modal button states
    confirmActionBtn.style.display = "";
    cancelConfirmModal.textContent = "Cancel";
  }

  // Wire up all close triggers
  [confirmOverlay, closeConfirmModal, cancelConfirmModal].forEach((el) => {
    if (el) el.addEventListener("click", closeModal);
  });

  // Confirm button → actually perform the action
  if (confirmActionBtn) {
    confirmActionBtn.addEventListener("click", () => {
      if (QueueCard && QueueAction) {
        handleAction(QueueCard, QueueAction);
      }
      closeModal();
    });
  }

  /* ── 7. ACTION HANDLER ─────────────────────────────────── */

  /** Mutates the card DOM to reflect its new status. */
  function handleAction(card, action) {
    // If cart.js data driver is available, use it!
    const orderId = card.dataset.orderFullId || card.dataset.orderId || card.querySelector(".order-id-val")?.innerText;

    if (action === "deleteHistory") {
      if (window.removeOrder) window.removeOrder(orderId, "vendor");
      else {
        card.remove();
        applyFilter();
        refreshCounts();
      }
    } else {
      let nextStatus = "";
      let isCancel = false;
      if (action === "accept") nextStatus = "preparing";
      else if (action === "decline") { nextStatus = "cancelled"; isCancel = true; }
      else if (action === "markReady") nextStatus = "ready";
      else if (action === "complete") nextStatus = "completed";

      if (window.updateOrderStatus && nextStatus) {
        window.updateOrderStatus(orderId, nextStatus, isCancel ? { cancelledByVendor: true } : {});
      } else {
        // Fallback static mutation
        const t = STATUS_TRANSITIONS[action];
        if (t) {
          card.dataset.status = t.newStatus;
          const accent = card.querySelector(".order-card-accent");
          if (accent) accent.className = "order-card-accent " + t.accentClass;
          const badge = card.querySelector(".status-badge");
          if (badge) { badge.className = "status-badge " + t.badgeClass; badge.textContent = t.badgeText; }
          const iconWrap = card.querySelector(".order-store-icon");
          if (iconWrap) {
            iconWrap.className = "order-store-icon " + t.iconBgClass;
            const iEl = iconWrap.querySelector("i");
            if (iEl) iEl.className = t.iconClass;
          }
          const actionsDiv = card.querySelector(".order-actions");
          if (actionsDiv) {
            if (t.nextButtons) { actionsDiv.innerHTML = t.nextButtons; }
            else               { actionsDiv.remove(); }
          }
        }
      }
    }

    // Trigger full dynamic repaint if driver exists
    if (window.renderVendorOrders) {
      window.renderVendorOrders();
      // Toast notifications
      const msgs = {
        accept: "Order accepted — now preparing.",
        decline: "Order declined.",
        markReady: "Order marked as ready for pickup!",
        complete: "Order completed!",
        deleteHistory: "Order removed from history."
      };
      if(window.showVendorToast) {
        window.showVendorToast(
          (action==='decline' || action==='deleteHistory') ? 'info' : 'success', 
          (action==='decline' || action==='deleteHistory') ? 'fa-info-circle' : 'fa-check', 
          msgs[action] || "Status updated."
        );
      }
    } else {
      applyFilter();
      refreshCounts();
    }
  }

  /* ── 8. EVENT DELEGATION ───────────────────────────────── */

  function initFilterTabs() {
    if (!filterTabs) return;
    filterTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const newFilter = btn.dataset.tab;
      if (newFilter === activeFilter) return;
      activeFilter = newFilter;
      syncTabHighlight();
      
      // If our dynamic LS driver exists, trigger a re-render.
      // This ensures cards are built for the new category.
      if (window.renderVendorOrders) {
        window.renderVendorOrders();
      } else {
        applyFilter();
      }
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

      if (action === "accept" || action === "markReady" || action === "complete") {
        const currentStatus = card.dataset.status;
        const allOfStatus = [...ordersList.querySelectorAll(".order-card")].filter(c => c.dataset.status === currentStatus);
        
        if (allOfStatus[0] !== card) {
          modalHeaderIcon.className = "fa-solid fa-triangle-exclamation";
          modalHeaderIcon.style.color = "#dc2626";
          modalHeaderTitle.textContent = "Action Not Allowed";
          
          modalSubtitle.innerHTML = "<strong>The first order should be processed first.</strong> Please process orders in sequence.";
          modalDetail.innerHTML = ""; 
          
          confirmActionBtn.style.display = "none";
          cancelConfirmModal.textContent = "OK";
          
          confirmModal.classList.add("active");
          document.body.style.overflow = "hidden";
          return;
        }
      }

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


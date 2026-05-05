/**
 * notifications.js — Shared Notification System for WM EAT SU
 * ============================================================
 * Manages a localStorage-backed notification store for:
 *   - Students  (role: "student")
 *   - Outsiders (role: "outsider")
 *   - Vendors   (role: "vendor")
 *
 * Notification object shape:
 * {
 *   id:        string,   // unique ID
 *   role:      string,   // "student" | "outsider" | "vendor"
 *   type:      string,   // "order_placed" | "order_preparing" | "order_ready" | "new_order" | "wallet" | "general"
 *   title:     string,
 *   desc:      string,
 *   icon:      string,   // Font Awesome icon class (e.g. "fa-check")
 *   color:     string,   // "green" | "orange" | "blue" | "red"
 *   link:      string,   // href for the notification item
 *   read:      boolean,
 *   createdAt: string,   // ISO timestamp
 *   orderId:   string|null  // associated order short-ID (optional)
 * }
 */

const NOTIF_KEY = "wm_eat_su_notifications";

/* ═══════════════════════════════════════
   CRUD
   ═══════════════════════════════════════ */

function getAllNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
  catch { return []; }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

function addNotification(notifOrRole, title, desc, link, color, icon) {
  const list = getAllNotifications();
  let entry;

  if (typeof notifOrRole === "object" && notifOrRole !== null) {
    // New Object Format
    const n = notifOrRole;
    entry = {
      id: "NOTIF-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      role: n.role || "student",
      type: n.type || "general",
      title: n.title || "Notification",
      desc: n.desc || "",
      icon: n.icon || "fa-bell",
      color: n.color || "blue",
      link: n.link || "#",
      read: false,
      createdAt: new Date().toISOString(),
      orderId: n.orderId || null,
    };
  } else {
    // Legacy Positional Format: (role, title, desc, link, color, icon)
    entry = {
      id: "NOTIF-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      role: notifOrRole || "student",
      type: "general",
      title: title || "Notification",
      desc: desc || "",
      icon: icon || "fa-bell",
      color: color || "blue",
      link: link || "#",
      read: false,
      createdAt: new Date().toISOString(),
      orderId: null,
    };
  }

  list.unshift(entry); // newest first
  saveNotifications(list);
  return entry;
}

function getNotificationsForRole(role) {
  return getAllNotifications().filter(n => n.role === role);
}

function getUnreadCount(role) {
  return getNotificationsForRole(role).filter(n => !n.read).length;
}

function markAllRead(role) {
  const list = getAllNotifications().map(n => {
    if (n.role === role) n.read = true;
    return n;
  });
  saveNotifications(list);
}

function markOneRead(notifId) {
  const list = getAllNotifications().map(n => {
    if (n.id === notifId) n.read = true;
    return n;
  });
  saveNotifications(list);
}

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)         return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60)         return m + " min" + (m !== 1 ? "s" : "") + " ago";
  const h = Math.floor(m / 60);
  if (h < 24)         return h + " hour" + (h !== 1 ? "s" : "") + " ago";
  const d = Math.floor(h / 24);
  return d + " day" + (d !== 1 ? "s" : "") + " ago";
}

/* ═══════════════════════════════════════
   HIGH-LEVEL CREATORS
   (called from cart, order, vendor pages)
   ═══════════════════════════════════════ */

/** Student/outsider: order successfully placed */
function notifyOrderPlaced(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_placed",
    title:   "Order Placed Successfully",
    desc:    `Your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} has been placed and is awaiting confirmation.`,
    icon:    "fa-receipt",
    color:   "blue",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Student/outsider: vendor accepted (now preparing) */
function notifyOrderPreparing(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_preparing",
    title:   "Order Is Being Prepared",
    desc:    `Your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} is now being prepared by the vendor. 🍳`,
    icon:    "fa-fire-burner",
    color:   "orange",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Student/outsider: order ready for pickup */
function notifyOrderReady(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_ready",
    title:   "Order Ready for Pickup! 🎉",
    desc:    `Your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} is ready! Please proceed to collect your order.`,
    icon:    "fa-check-circle",
    color:   "green",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Vendor: new incoming order from student/outsider */
function notifyVendorNewOrder(order) {
  addNotification({
    role:    "vendor",
    type:    "new_order",
    title:   "New Order Received! 🛎️",
    desc:    `Order #${order.id.slice(-6).toUpperCase()} from ${order.customerRole === "outsider" ? "an outsider" : "a student"} — ₱${order.total.toFixed(2)}. Tap to review.`,
    icon:    "fa-bell",
    color:   "red",
    link:    "vendor-orders.html",
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Student/outsider: vendor declined order */
function notifyOrderDeclined(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_declined",
    title:   "Order Declined by Vendor ❌",
    desc:    `Your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} has been declined. If you paid online, funds will be returned to your wallet.`,
    icon:    "fa-circle-xmark",
    color:   "red",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Student/outsider: user cancelled order */
function notifyOrderCancelledByUser(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_cancelled_user",
    title:   "Order Cancelled ❌",
    desc:    `You have successfully cancelled your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor}. Funds have been returned to your wallet.`,
    icon:    "fa-circle-xmark",
    color:   "red",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Legacy/Generic: order cancelled */
function notifyOrderCancelled(order) {
  if (order.cancelledByVendor) {
    notifyOrderDeclined(order);
  } else {
    notifyOrderCancelledByUser(order);
  }
}

/** Student/outsider: order picked up */
function notifyOrderCompleted(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_completed",
    title:   "Enjoy Your Meal! 🍽️",
    desc:    `Order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} is completed. Thank you for using WM EAT SU!`,
    icon:    "fa-bag-shopping",
    color:   "green",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/** Student/outsider: vendor marked as picked up, waiting for student */
function notifyOrderVendorConfirmedPickup(order) {
  const role = order.customerRole || "student";
  const orderLink = "teacher-and-staff-order.html";
  addNotification({
    role: "student", // Using student role as placeholder or appropriate role
    type:    "vendor_picked_up",
    title:   "Vendor Confirmed Pickup 🛍️",
    desc:    `The vendor has marked order #${order.id.slice(-6).toUpperCase()} as collected. Please confirm if you have received it.`,
    icon:    "fa-hand-holding-heart",
    color:   "blue",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
}

/* ═══════════════════════════════════════
   NAVBAR DROPDOWN RENDERER
   (injects live items into .notification-list)
   ═══════════════════════════════════════ */

function renderNavbarNotifications(role, opts) {
  opts = opts || {};
  const maxItems    = opts.maxItems   || 5;
  const listEl      = opts.listEl     || document.querySelector(".notification-list");
  const badgeEl     = opts.badgeEl    || document.querySelector(".notification-badge");
  const markReadBtn = opts.markReadEl || document.querySelector(".mark-read-btn");
  const allLink     = role === "vendor"
    ? "vendor-notifications.html"
    : role === "outsider"
      ? "outsider-notifications.html"
      : "student-notifications.html";

  if (!listEl) return;

  // Ensure header has a close button for mobile
  const dropdownMenu = listEl.closest(".notification-menu");
  const dropdownParent = listEl.closest(".notification-dropdown");
  if (dropdownMenu) {
    const headerEl = dropdownMenu.querySelector(".notification-header");
    if (headerEl) {
      // Create actions wrapper if missing
      let actionsEl = headerEl.querySelector(".notif-header-actions");
      if (!actionsEl) {
        actionsEl = document.createElement("div");
        actionsEl.className = "notif-header-actions";
        actionsEl.style.display = "flex";
        actionsEl.style.alignItems = "center";
        actionsEl.style.gap = "8px";
        
        // Move mark-read-btn into actions if it exists
        const oldMarkBtn = headerEl.querySelector(".mark-read-btn");
        if (oldMarkBtn) actionsEl.appendChild(oldMarkBtn);
        
        headerEl.appendChild(actionsEl);
      }

      // Add close button if missing
      if (!actionsEl.querySelector(".close-notif-btn")) {
        actionsEl.insertAdjacentHTML("beforeend", `
          <button class="close-notif-btn" title="Close Notifications">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `);
      }

      // Wire up the close button
      const closeBtn = actionsEl.querySelector(".close-notif-btn");
      if (closeBtn && dropdownParent) {
        closeBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdownParent.classList.remove("is-open");
        };
      }
    }
  }

  const notifs  = getNotificationsForRole(role).slice(0, maxItems);
  const unread  = getUnreadCount(role);

  // Update badge
  if (badgeEl) {
    badgeEl.textContent = unread > 0 ? (unread > 99 ? "99+" : unread) : "";
    badgeEl.style.display = unread > 0 ? "" : "none";
  }

  // Render items
  if (notifs.length === 0) {
    listEl.innerHTML = `
      <div style="padding:24px;text-align:center;color:#94a3b8;font-size:14px;">
        <i class="fa-regular fa-bell-slash" style="font-size:28px;margin-bottom:8px;display:block;opacity:.4;"></i>
        No notifications yet
      </div>`;
  } else {
    listEl.innerHTML = notifs.map(n => `
      <a href="${n.link}" class="notification-item${n.read ? "" : " unread"}" data-notif-id="${n.id}">
        <div class="notif-icon ${n.color}"><i class="fa-solid ${n.icon}"></i></div>
        <div class="notif-content">
          <p class="notif-title">${escNotif(n.title)}</p>
          <p class="notif-desc">${escNotif(n.desc)}</p>
          <span class="notif-time">${timeAgo(n.createdAt)}</span>
        </div>
      </a>`).join("");

    // Mark individual as read on click
    listEl.querySelectorAll("[data-notif-id]").forEach(el => {
      el.addEventListener("click", () => markOneRead(el.dataset.notifId));
    });
  }

  // Mark all read button
  if (markReadBtn) {
    markReadBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      markAllRead(role);
      renderNavbarNotifications(role, opts);
    };
  }
}

/* ═══════════════════════════════════════
   FULL NOTIFICATIONS PAGE RENDERER
   (for *-notifications.html pages)
   ═══════════════════════════════════════ */

function clearAllNotifications(role) {
  const list = getAllNotifications().filter(n => n.role !== role);
  saveNotifications(list);
}

/* ═══════════════════════════════════════
   FULL NOTIFICATIONS PAGE RENDERER
   (for *-notifications.html pages)
   ═══════════════════════════════════════ */

function renderNotificationsPage(role, containerEl) {
  if (!containerEl) return;

  const listEl = containerEl.querySelector(".notifications-list");
  if (!listEl) return;

  const notifs = getNotificationsForRole(role);

  if (notifs.length === 0) {
    listEl.innerHTML = `
      <div style="padding:60px 24px;text-align:center;color:#94a3b8;">
        <i class="fa-regular fa-bell-slash" style="font-size:48px;margin-bottom:16px;display:block;opacity:.35;"></i>
        <p style="font-size:16px;font-weight:600;color:#64748b;margin:0 0 8px;">No notifications yet</p>
        <p style="font-size:13px;margin:0;">Activity related to your orders will appear here.</p>
      </div>`;
    // Hide clear btn when empty
    const clearBtn = containerEl.querySelector(".clear-all-notif-btn");
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  listEl.innerHTML = notifs.map(n => `
    <a href="${n.link}" class="notification-page-item${n.read ? "" : " unread"}" data-notif-id="${n.id}">
      <div class="notif-page-icon ${n.color}"><i class="fa-solid ${n.icon}"></i></div>
      <div class="notif-page-content">
        <div class="notif-page-header">
          <span class="notif-page-title">${escNotif(n.title)}</span>
          <span class="notif-page-time">${timeAgo(n.createdAt)}</span>
        </div>
        <p class="notif-page-desc">${escNotif(n.desc)}</p>
        ${n.orderId ? `
        <div class="notif-page-actions">
          <span class="notif-action-btn"><i class="fa-solid fa-arrow-right" style="margin-right:4px;"></i>View Order</span>
        </div>` : ""}
      </div>
    </a>`).join("");

  // Show clear btn when there are notifications
  const clearBtn = containerEl.querySelector(".clear-all-notif-btn");
  if (clearBtn) clearBtn.style.display = "";

  // Mark each as read on click
  listEl.querySelectorAll("[data-notif-id]").forEach(el => {
    el.addEventListener("click", () => {
      markOneRead(el.dataset.notifId);
      el.classList.remove("unread");
    });
  });

  // Wire filter buttons (All / Unread)
  const filterBtns = containerEl.querySelectorAll(".notifications-filters .filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.textContent.trim().toLowerCase();
      listEl.querySelectorAll(".notification-page-item").forEach(item => {
        if (filter === "unread") {
          item.style.display = item.classList.contains("unread") ? "" : "none";
        } else {
          item.style.display = "";
        }
      });
    });
  });

  // Mark all read button
  const markAllBtn = containerEl.querySelector(".mark-all-read-btn");
  if (markAllBtn) {
    markAllBtn.onclick = () => {
      markAllRead(role);
      renderNotificationsPage(role, containerEl);
    };
  }

  // Clear all button
  if (clearBtn) {
    clearBtn.onclick = () => {
      showNotificationConfirm(
        "Clear All Notifications",
        "Are you sure you want to permanently delete all your notifications? This action cannot be undone.",
        () => {
          clearAllNotifications(role);
          renderNotificationsPage(role, containerEl);
        }
      );
    };
  }
}

/* ═══════════════════════════════════════
   CONFIRMATION MODAL HELPERS
   ═══════════════════════════════════════ */

function ensureModalExists() {
  if (document.getElementById("notifConfirmModal")) return;

  const modalHtml = `
    <div class="modal" id="notifConfirmModal">
      <div class="modal-overlay" id="notifConfirmOverlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="notifConfirmTitle">Confirm</h2>
          <button class="modal-close" id="notifConfirmClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p id="notifConfirmMessage">Are you sure?</p>
          <div class="modal-footer">
            <button class="btn-modal btn-modal-cancel" id="notifConfirmCancel">Cancel</button>
            <button class="btn-modal btn-modal-danger" id="notifConfirmBtn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Wire close events
  const modal = document.getElementById("notifConfirmModal");
  const close = () => modal.classList.remove("active");
  
  document.getElementById("notifConfirmClose").onclick = close;
  document.getElementById("notifConfirmOverlay").onclick = close;
  document.getElementById("notifConfirmCancel").onclick = close;
}

function showNotificationConfirm(title, message, onConfirm) {
  ensureModalExists();
  
  document.getElementById("notifConfirmTitle").textContent = title;
  document.getElementById("notifConfirmMessage").textContent = message;
  
  const confirmBtn = document.getElementById("notifConfirmBtn");
  const modal = document.getElementById("notifConfirmModal");
  
  confirmBtn.onclick = () => {
    onConfirm();
    modal.classList.remove("active");
  };
  
  modal.classList.add("active");
}

/* ═══════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════ */

function escNotif(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Detect which role the current page belongs to.
 */
function detectRole() {
  const p = window.location.pathname;
  if (p.includes("/vendor-pages/") || p.includes("/vendor-js/")) return "vendor";
  if (p.includes("/outsider/") || p.includes("/outsider-js/"))  return "outsider";
  return "student";
}

// ── Auto-Initialization ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const role = detectRole();

  // Load Outsider Profile Name
  if (role === "outsider") {
    const navProfileName = document.getElementById('navProfileName') || document.querySelector('.profile-name');
    if (navProfileName) {
      const savedName = sessionStorage.getItem('outsiderName');
      if (savedName) navProfileName.textContent = savedName;
    }
  }

  const opts = {
    listEl:     document.querySelector(".notification-list"),
    badgeEl:    document.querySelector(".notification-badge"),
    markReadEl: document.querySelector(".mark-read-btn"),
  };
  
  if (opts.listEl) {
    renderNavbarNotifications(role, opts);
  }

  // Global storage listener for notifications
  window.addEventListener("storage", (e) => {
    if (e.key === "wm_eat_su_notifications") {
      renderNavbarNotifications(role, opts);
      
      // If we are on a notifications page, also refresh that
      const pageContainer = document.getElementById("notificationsContainer") || 
                           document.getElementById("vendorNotifContainer") || 
                           document.getElementById("outsiderNotifContainer");
      if (pageContainer) {
        renderNotificationsPage(role, pageContainer);
      }
    }
  });

  // ── Mobile: tap-to-toggle notification dropdown ──────────
  // On touch devices (≤768px), hover doesn't work reliably.
  // We toggle .is-open on the parent .notification-dropdown.
  const notifDropdown = document.querySelector(".notification-dropdown");
  const notifBtn      = notifDropdown ? notifDropdown.querySelector(".nav-icon-btn") : null;

  if (notifDropdown && notifBtn) {
    notifBtn.addEventListener("click", (e) => {
      if (window.innerWidth > 768) return; // desktop uses CSS :hover
      e.stopPropagation();
      notifDropdown.classList.toggle("is-open");
    });

    // Close when tapping outside
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 768) return;
      if (!notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove("is-open");
      }
    });

    // Close on notification item click
    notifDropdown.addEventListener("click", (e) => {
      if (e.target.closest(".notification-item, .notification-footer a")) {
        notifDropdown.classList.remove("is-open");
      }
    });
  }
});

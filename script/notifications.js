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
function notifyOrderCancelled(order) {
  const role = order.customerRole || "student";
  const orderLink = role === "outsider"
    ? "../outsider/outsider-order.html"
    : "student-order.html";
  addNotification({
    role,
    type:    "order_cancelled",
    title:   "Order Declined/Cancelled ❌",
    desc:    `Your order #${order.id.slice(-6).toUpperCase()} from ${order.vendor} has been cancelled. If you paid online, funds will be returned to your wallet.`,
    icon:    "fa-circle-xmark",
    color:   "red",
    link:    orderLink,
    orderId: order.id.slice(-6).toUpperCase(),
  });
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
});

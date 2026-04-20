/**
 * cart.js — Shared localStorage data module for WM EAT SU
 * Manages: Cart + Orders
 * Load this BEFORE any page-specific script.
 */

const CART_KEY   = "wm_eat_su_cart";
const ORDERS_KEY = "wm_eat_su_orders";

/* ════════════════════════════════════════
   CART
   ════════════════════════════════════════ */

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);
  updateAllCartBadges();
}

function updateQty(id, qty) {
  const cart = getCart();
  const idx  = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  if (qty <= 0) cart.splice(idx, 1);
  else cart[idx].qty = qty;
  saveCart(cart);
  updateAllCartBadges();
}

function removeFromCart(id) {
  saveCart(getCart().filter(c => c.id !== id));
  updateAllCartBadges();
}

function clearCart() {
  saveCart([]);
  updateAllCartBadges();
}

function getCartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

/* ════════════════════════════════════════
   ORDERS
   ════════════════════════════════════════ */

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch { return []; }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Moves all cart items into a new pending order.
 * Returns the order object, or null if cart is empty.
 */
function placeOrder(instructions, payment) {
  instructions = instructions || "";
  payment      = payment      || "Wallet";
  const cart   = getCart();
  if (cart.length === 0) return null;

  const orders = getOrders();
  const timestamp = Date.now();
  const createdOrders = [];

  cart.forEach((item, index) => {
    const total      = item.price * item.qty;
    const vendor     = item.vendor || "Campus Vendor";
    // Ensure unique IDs even if placed at the same millisecond
    const orderId    = "ORD-" + timestamp + "-" + index;
    const pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = {
      id:           orderId,
      items:        [JSON.parse(JSON.stringify(item))], // single item in items array
      total,
      status:       "pending",
      placedAt:     new Date().toISOString(),
      instructions,
      payment,
      vendor,
      pickupCode,
      img:          item.img || ""
    };

    orders.unshift(order);
    createdOrders.push(order);
  });

  saveOrders(orders);
  clearCart();              // clears cart + fires badge update
  
  // Return the first order or a summary if needed, 
  // but for the current UI redirect, just returning truthy is enough.
  return createdOrders.length > 0 ? createdOrders[0] : null;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order  = orders.find(o => o.id === orderId);
  if (order) { order.status = status; saveOrders(orders); }
  updateAllCartBadges();
}

function cancelOrder(orderId) {
  updateOrderStatus(orderId, "cancelled");
}

function removeOrder(orderId) {
  saveOrders(getOrders().filter(o => o.id !== orderId));
  updateAllCartBadges();
}

function getPendingCount() {
  return getOrders().filter(
    o => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  ).length;
}

/* ════════════════════════════════════════
   BADGE / UI SYNC
   ════════════════════════════════════════ */

function updateAllCartBadges() {
  const cartCount    = getCartCount();
  const pendingCount = getPendingCount();

  /* ── Sidebar cart badge (all pages) ── */
  document.querySelectorAll(".nav-badge").forEach(badge => {
    badge.textContent  = cartCount;
    badge.style.display = cartCount > 0 ? "" : "none";
  });

  /* ── Dashboard: Cart Items stat card ── */
  const cartStat = document.querySelector(".stat-card.blue .stat-value");
  if (cartStat) cartStat.textContent = cartCount;

  /* ── Dashboard: Pending Orders stat card ── */
  const pendingStat = document.querySelector(".stat-card.orange .stat-value");
  if (pendingStat) pendingStat.textContent = pendingCount;

  /* ── Dashboard: "View Cart" quick-action text ── */
  document.querySelectorAll('a[href="student-cart.html"]').forEach(link => {
    const p = link.querySelector("p");
    if (p) {
      p.textContent = cartCount === 0
        ? "Your cart is empty"
        : `You have ${cartCount} item${cartCount !== 1 ? "s" : ""} waiting to be ordered`;
    }
  });
}

/* ════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════ */

/** Build a stable localStorage key from item name + vendor. */
function makeItemId(name, vendor) {
  return (name + "|" + (vendor || "")).toLowerCase().replace(/\s+/g, "_");
}

/** Format an ISO date string as "Mon D, YYYY · HH:MM AM/PM". */
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      + " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

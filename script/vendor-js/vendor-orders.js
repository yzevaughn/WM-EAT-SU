/* ----------------------------------------------------------
   VENDOR ORDERS — localStorage-driven
   Reads student orders from the shared LS key and renders them
   ---------------------------------------------------------- */

/* --- Toast --- */
function showVendorToast(type, icon, msg) {
  const colours = { success: "#10b981", error: "#ef4444", info: "#3b82f6" };
  const el = document.createElement("div");
  el.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:10px;
    font-size:14px;font-weight:600;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.15);
    background:${colours[type] || "#64748b"};pointer-events:none;
    position:fixed;bottom:24px;right:24px;z-index:999999;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform:translateY(20px);opacity:0;`;
  el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  });
  setTimeout(() => {
    el.style.transform = "translateY(20px)";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* --- Map student status -> vendor tab name --- */
window.STATUS_MAP = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

/* --- Status UI config --- */
const STATUS_CFG = {
  Pending: {
    icon: "fa-clock",
    cls: "ic-Pending",
    badge: "Pending",
    label: "Pending",
  },
  Preparing: {
    icon: "fa-fire-burner",
    cls: "ic-preparing",
    badge: "preparing",
    label: "Preparing",
  },
  Ready: {
    icon: "fa-check-circle",
    cls: "ic-ready",
    badge: "ready",
    label: "Ready",
  },
  Completed: {
    icon: "fa-check-double",
    cls: "ic-completed",
    badge: "completed",
    label: "Completed",
  },
  Cancelled: {
    icon: "fa-ban",
    cls: "ic-cancelled",
    badge: "cancelled",
    label: "Cancelled",
  },
};

/* --- Build action buttons for each status --- */
function buildActions(order, tab) {
  if (tab === "Pending")
    return `
    <button class="pickup-btn"  data-action="accept"  data-id="${order.id}"><i class="fas fa-check"></i> Accept</button>
    <button class="cancel-btn"  data-action="decline" data-id="${order.id}"><i class="fas fa-times"></i> Decline</button>`;
  if (tab === "Preparing")
    return `
    <button class="pickup-btn" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);box-shadow:0 3px 10px rgba(37,99,235,.3);"
            data-action="markReady" data-id="${order.id}"><i class="fa-solid fa-bell"></i> Mark Ready</button>`;
  if (tab === "Ready")
    return `
    <button class="pickup-btn" data-action="complete" data-id="${order.id}"><i class="fas fa-bag-shopping"></i> Mark as Picked Up</button>
    <button class="view-code-btn open-code-btn" data-id="${order.id}" data-code="${order.pickupCode || "----"}">
      <i class="fa-solid fa-qrcode"></i> View Pickup Code</button>`;
  if (tab === "Completed" || tab === "Cancelled")
    return `
    <button class="remove-btn" data-action="deleteHistory" data-id="${order.id}">
      <i class="fa-solid fa-trash-can"></i> Delete</button>`;
  return "";
}

/* --- Build one order card HTML --- */
function buildVendorCard(order) {
  const tab = window.STATUS_MAP[order.status] || "Pending";
  const cfg = STATUS_CFG[tab] || STATUS_CFG.Pending;
  const dt = new Date(order.placedAt);
  const dateStr =
    dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " • " +
    dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const shortId = order.id.slice(-6).toUpperCase();

  // Determine payment method label and styling
  const rawPayment = order.payment || "Wallet";
  const isCash = rawPayment === "Cash on Pickup" || rawPayment === "Cash";
  const payLabel = isCash ? "Cash on Pickup" : "Online Payment (Wallet)";
  const payIcon = isCash ? "fa-money-bill-wave" : "fa-credit-card";
  const payBadgeClass = isCash ? "badge-cash" : "badge-online";

  const itemsHtml = (order.items || [])
    .map(
      (it) =>
        `<div class="order-item-row" style="display:flex;justify-content:space-between;color:#334155;font-weight:600;font-size:14px;padding:3px 0;"><span>${it.qty} × ${it.name}</span><span>&#8369;${(it.price * it.qty).toFixed(2)}</span></div>`,
    )
    .join("");
  const noteHtml = order.instructions
    ? `
    <div class="order-instruction" style="font-size:12px;color:#64748b;margin-top:8px;padding:6px 8px;background:#f8fafc;border-radius:4px;border-left:2px solid #cbd5e1;">
      <i class="fa-regular fa-comment-dots" style="margin-right:4px;color:#94a3b8"></i>
      <strong>Note:</strong> ${order.instructions}
    </div>`
    : "";

  return `
    <div class="order-card" data-status="${tab}" data-vendor="${order.vendor}" data-order-id="${shortId}"
         data-order-full-id="${order.id}" data-price="${order.total.toFixed(2)}" data-image="${order.img || ""}">
      <div class="order-card-inner">
        <div class="order-card-header">
          <div class="order-title">
            <div class="order-store-icon ${cfg.cls}"><i class="fa-solid ${cfg.icon}"></i></div>
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span class="order-card-title">Order #${shortId}</span>
              <div class="pay-method-badge ${payBadgeClass}">
                <i class="fa-solid ${payIcon}"></i>
                <span>${payLabel}</span>
              </div>
            </div>
          </div>
          <span class="status-badge ${cfg.badge}">${cfg.label}</span>
        </div>
        <div class="order-body-wrapper">
          <img src="${order.img || "../../images/burger.avif"}" alt="Food image" class="order-image" onerror="this.style.display='none'" />
          <div class="order-body-info">
            <div class="order-meta">
              <span style="display:flex;align-items:center;gap:4px;margin-bottom:4px;">
                <i class="fa-solid fa-hashtag"></i>
                <span class="order-id-val" style="font-weight:700;color:#1e293b;background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;">${shortId}</span>
              </span>
              <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
            </div>
            <div class="order-items">${itemsHtml}</div>
            ${noteHtml}
          </div>
        </div>
        <div class="order-total-row"><span>Total: &#8369;${order.total.toFixed(2)}</span></div>
        <div class="order-actions" style="margin-top:14px;display:flex;gap:8px;">
          ${buildActions(order, tab)}
        </div>
      </div>
    </div>`;
}

/* --- Global Render engine --- */
window.renderVendorOrders = function () {
  const orders = (typeof getOrders === "function" ? getOrders() : []).filter(
    (o) => !o.removedByVendor,
  ); // from cart.js
  const list = document.getElementById("ordersList");
  if (!list) return;

  const emptyDiv = list.querySelector(".no-orders-msg");
  list.querySelectorAll(".order-card").forEach((c) => c.remove());

  if (orders.length === 0) {
    if (emptyDiv) emptyDiv.style.display = "flex";
  } else {
    const htmlCards = orders.map(buildVendorCard).join("");
    if (emptyDiv) emptyDiv.style.display = "none";
    list.insertAdjacentHTML("beforeend", htmlCards);
  }

  // Update the badge counters next to tabs
  const counts = {
    Pending: 0,
    Preparing: 0,
    Ready: 0,
    Completed: 0,
    Cancelled: 0,
  };
  orders.forEach((o) => {
    const tab = window.STATUS_MAP[o.status];
    if (tab) counts[tab]++;
  });
  Object.entries(counts).forEach(([tab, n]) => {
    const el = document.getElementById(`count-${tab}`);
    if (el) el.textContent = n;
  });

  // Show hide cards based on currently active tab
  const activeBtn = document.querySelector(".filter-btn.active");
  const activeTab = activeBtn ? activeBtn.dataset.tab : "Pending";
  let hasVisible = false;
  document.querySelectorAll(".order-card").forEach((c) => {
    if (c.dataset.status === activeTab) {
      c.style.display = "";
      hasVisible = true;
    } else {
      c.style.display = "none";
    }
  });

  if (orders.length > 0) {
    if (emptyDiv) emptyDiv.style.display = hasVisible ? "none" : "flex";
  }

  const clearBtn = document.getElementById("clearAllVendorBtn");
  if (clearBtn) {
    if (
      (activeTab === "Completed" || activeTab === "Cancelled") &&
      hasVisible
    ) {
      clearBtn.style.display = "flex";
    } else {
      clearBtn.style.display = "none";
    }
  }

  wirePickupModal();
};

function wirePickupModal() {
  document.querySelectorAll(".open-code-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".order-card");
      const code = btn.dataset.code;
      document.getElementById("modalCodeVal").textContent = code;
      document.getElementById("modalCodeOrder").textContent =
        "Order #" + card.dataset.orderId;
      document.getElementById("modalTotalPrice").textContent =
        "Total: &#8369;" + card.dataset.price;

      let img = document.getElementById("modalFoodImage");
      if (card.dataset.image) {
        img.src = card.dataset.image;
        img.style.display = "block";
      } else {
        img.style.display = "none";
      }

      let itemsList = document.getElementById("modalOrderItems");
      itemsList.innerHTML = "";
      card
        .querySelectorAll(".order-item-row")
        .forEach((r) => itemsList.appendChild(r.cloneNode(true)));

      document.getElementById("pickupModal").classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
}

const cmClose = () => {
  document.getElementById("pickupModal").classList.remove("active");
  document.body.style.overflow = "";
};
document.getElementById("closePickupModal")?.addEventListener("click", cmClose);
document.getElementById("pickupOverlay")?.addEventListener("click", cmClose);

document.getElementById("clearAllVendorBtn")?.addEventListener("click", () => {
  const activeBtn = document.querySelector(".filter-btn.active");
  const activeTab = activeBtn ? activeBtn.dataset.tab : "Pending";
  if (activeTab !== "Completed" && activeTab !== "Cancelled") return;

  const title = document.getElementById("modalHeaderTitle");
  const sub = document.getElementById("modalSubtitle");
  const icon = document.getElementById("modalHeaderIcon");
  const actionBtn = document.getElementById("confirmActionBtn");
  const btnIcon = document.getElementById("confirmBtnIcon");
  const btnText = document.getElementById("confirmBtnText");

  icon.className = "fa-solid fa-triangle-exclamation";
  icon.style.color = "#ef4444";
  title.textContent = "Clear All";
  sub.innerHTML = `Are you sure you want to clear all <strong>${activeTab.toLowerCase()}</strong> orders?`;
  document.getElementById("modalDetail").innerHTML = "";

  actionBtn.className = "remove-btn";
  btnIcon.className = "fa-solid fa-trash-can";
  btnText.textContent = "Clear All";
  actionBtn.style.margin = "0";

  const customHandler = () => {
    const statusMapInv = { Completed: "completed", Cancelled: "cancelled" };
    const rawStatus = statusMapInv[activeTab];
    if (rawStatus) {
      const allOrders = getOrders();
      allOrders.forEach((o) => {
        if (o.status === rawStatus) removeOrder(o.id, "vendor");
      });
      window.renderVendorOrders();
      showVendorToast(
        "success",
        "fa-check",
        `All ${activeTab.toLowerCase()} orders cleared.`,
      );
    }
    document.getElementById("confirmModal").classList.remove("active");
    actionBtn.removeEventListener("click", customHandler);
  };

  actionBtn.addEventListener("click", customHandler);

  document
    .getElementById("closeConfirmModal")
    ?.addEventListener(
      "click",
      () => actionBtn.removeEventListener("click", customHandler),
      { once: true },
    );
  document
    .getElementById("cancelConfirmModal")
    ?.addEventListener(
      "click",
      () => actionBtn.removeEventListener("click", customHandler),
      { once: true },
    );
  document
    .getElementById("confirmOverlay")
    ?.addEventListener(
      "click",
      () => actionBtn.removeEventListener("click", customHandler),
      { once: true },
    );

  document.getElementById("confirmModal").classList.add("active");
});

// Initial render
window.renderVendorOrders();

// ── Vendor Navbar Notification Rendering ──────────────────────
function refreshVendorNavNotifs() {
  if (typeof renderNavbarNotifications === "function") {
    renderNavbarNotifications("vendor", {
      listEl: document.querySelector(".notification-list"),
      badgeEl: document.querySelector(".notification-badge"),
      markReadEl: document.querySelector(".mark-read-btn"),
    });
  }
}
refreshVendorNavNotifs();

// ── Track order count to detect NEW orders ─────────────────────
let _lastOrderCount = (
  typeof getOrders === "function"
    ? getOrders().filter((o) => !o.removedByVendor)
    : []
).length;

// Auto sync when students place orders
window.addEventListener("storage", (e) => {
  if (e.key === "wm_eat_su_orders") {
    const currentOrders =
      typeof getOrders === "function"
        ? getOrders().filter((o) => !o.removedByVendor)
        : [];
    const newCount = currentOrders.length;

    // Detect truly new orders (count increased)
    if (newCount > _lastOrderCount) {
      const newest = currentOrders.slice(0, newCount - _lastOrderCount);
      newest.forEach((o) => {
        // Show a prominent "new order" alert banner
        showNewOrderBanner(o);
      });
    }
    _lastOrderCount = newCount;
    window.renderVendorOrders();
  }
  if (e.key === "wm_eat_su_notifications") {
    refreshVendorNavNotifs();
  }
});

/* ── New Order Banner (vendor-side popup alert) ─────────────── */
function showNewOrderBanner(order) {
  const existing = document.getElementById("newOrderBanner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "newOrderBanner";
  banner.style.cssText = `
    position: fixed; top: 80px; right: 24px; z-index: 999999;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #fff; border-radius: 14px; padding: 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(239,68,68,0.4);
    max-width: 340px; min-width: 280px;
    display: flex; align-items: flex-start; gap: 14px;
    animation: slideInBanner 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    border-left: 4px solid #ef4444;
    pointer-events: all;
  `;
  banner.innerHTML = `
    <style>
      @keyframes slideInBanner {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
      @keyframes slideOutBanner {
        from { transform: translateX(0);    opacity: 1; }
        to   { transform: translateX(120%); opacity: 0; }
      }
      #newOrderBannerPulse {
        animation: pulse 1.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
        50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
      }
    </style>
    <div id="newOrderBannerPulse" style="width:44px;height:44px;background:rgba(239,68,68,0.15);border:2px solid #ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <i class="fa-solid fa-bell" style="color:#ef4444;font-size:18px;"></i>
    </div>
    <div style="flex:1;">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px;">New Order Received!</div>
      <div style="font-size:12px;color:#94a3b8;line-height:1.5;">
        Order <strong style="color:#fff;font-family:monospace;">#${order.id.slice(-6).toUpperCase()}</strong>
        · ₱${order.total.toFixed(2)}
        <br><span style="color:#64748b;">${order.customerRole === "outsider" ? "🏫 Outsider" : "🎓 Student"}</span>
      </div>
      <button onclick="document.getElementById('tab-Pending').click();document.getElementById('newOrderBanner').remove();"
        style="margin-top:8px;padding:5px 12px;background:#ef4444;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
        View Order
      </button>
    </div>
    <button onclick="this.closest('#newOrderBanner').remove();" style="background:none;border:none;color:#64748b;cursor:pointer;padding:0;font-size:16px;flex-shrink:0;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  document.body.appendChild(banner);
  setTimeout(() => {
    if (banner.parentNode) {
      banner.style.animation = "slideOutBanner 0.3s ease-in both";
      setTimeout(() => banner.remove(), 300);
    }
  }, 6000);
}

/* ----------------------------------------------------------
   WALK-IN ORDER MODAL LOGIC
   ---------------------------------------------------------- */
const walkinItems = [
  {
    id: "m1",
    name: "Chicken Joy Meal",
    price: 85.0,
    category: "Meals",
    img: "../../images/burger.avif",
  },
  {
    id: "m2",
    name: "Pork BBQ with Rice",
    price: 95.0,
    category: "Meals",
    img: "../../images/burger.avif",
  },
  {
    id: "m3",
    name: "Classic Spaghetti",
    price: 50.0,
    category: "Snacks",
    img: "../../images/burger.avif",
  },
  {
    id: "m4",
    name: "House Iced Tea",
    price: 20.0,
    category: "Drinks",
    img: "../../images/burger.avif",
  },
  {
    id: "m5",
    name: "Double Cheeseburger",
    price: 65.0,
    category: "Snacks",
    img: "../../images/burger.avif",
  },
  {
    id: "m6",
    name: "Mineral Water",
    price: 15.0,
    category: "Drinks",
    img: "../../images/burger.avif",
  },
  {
    id: "m7",
    name: "French Fries",
    price: 40.0,
    category: "Snacks",
    img: "../../images/burger.avif",
  },
  {
    id: "m8",
    name: "Tapsilog",
    price: 110.0,
    category: "Meals",
    img: "../../images/burger.avif",
  },
];

let walkinCart = {};
let currentPaymentMethod = "Cash";
let currentWalletType = "WMSU Wallet";

function toggleWalkinView(showCart) {
  const layout = document.querySelector(".walkin-layout");
  if (showCart) {
    layout.classList.add("cart-open");
  } else {
    layout.classList.remove("cart-open");
  }
}

function renderWalkinMenu() {
  const q = document.getElementById("walkinSearch").value.toLowerCase();
  const cat = document.getElementById("walkinCategory").value;
  const grid = document.getElementById("walkinMenuGrid");

  const filtered = walkinItems.filter((item) => {
    const matchQ = item.name.toLowerCase().includes(q);
    const matchC = cat === "All" || item.category === cat;
    return matchQ && matchC;
  });

  grid.innerHTML = filtered
    .map((item) => {
      const qty = walkinCart[item.id] ? walkinCart[item.id].qty : 0;
      const isSelected = qty > 0;
      return `
      <div class="walkin-item-card" onclick="addToWalkin('${item.id}')" style="background:#fff; border:2px solid ${isSelected ? "#ef4444" : "#e2e8f0"}; border-radius:12px; padding:12px; cursor:pointer; position:relative; transition:all 0.2s; box-shadow: ${isSelected ? "0 4px 12px rgba(239,68,68,0.15)" : "none"};">
        ${isSelected ? `<div style="position:absolute; top:-8px; right:-8px; background:#ef4444; color:#fff; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; z-index:2; box-shadow:0 2px 5px rgba(0,0,0,0.2);">${qty}</div>` : ""}
        <div style="height:100px; background:#f1f5f9; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <img src="${item.img}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
        </div>
        <div style="font-size:14px; font-weight:600; color:#1e293b; margin-bottom:4px; line-height:1.2;">${item.name}</div>
        <div style="font-size:15px; font-weight:700; color:#ef4444;">&#8369;${item.price.toFixed(2)}</div>
      </div>
    `;
    })
    .join("");
}

function renderWalkinCart() {
  const list = document.getElementById("walkinOrderList");
  const items = Object.values(walkinCart);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  let total = 0;

  // Update mobile badge
  const badge = document.getElementById("mobileCartBadge");
  if (badge) badge.textContent = totalQty;

  const mobileBtn = document.getElementById("mobileViewOrderBtn");
  if (mobileBtn) {
    if (totalQty > 0) mobileBtn.classList.add("has-items");
    else mobileBtn.classList.remove("has-items");
  }

  if (items.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#94a3b8; font-size:14px; margin-top:40px;"><i class="fa-solid fa-basket-shopping" style="font-size:32px; color:#cbd5e1; margin-bottom:12px; display:block;"></i>No items added yet</div>`;
    // Auto-switch back to menu if cart becomes empty while in cart view on mobile
    if (window.innerWidth <= 992) toggleWalkinView(false);
  } else {
    list.innerHTML = items
      .map((item) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        return `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1;">
            <div style="font-size:14px; font-weight:600; color:#1e293b; line-height:1.2; margin-bottom:2px;">${item.name}</div>
            <div style="font-size:13px; color:#64748b;">&#8369;${item.price.toFixed(2)}</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="display:flex; align-items:center; gap:6px; background:#f1f5f9; padding:4px; border-radius:8px;">
              <button onclick="updateWalkinQty('${item.id}', -1)" style="width:26px; height:26px; border-radius:6px; border:none; background:#fff; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); color:#64748b;"><i class="fa-solid fa-minus" style="font-size:10px;"></i></button>
              <span style="font-size:14px; font-weight:700; width:16px; text-align:center; color:#0f172a;">${item.qty}</span>
              <button onclick="updateWalkinQty('${item.id}', 1)" style="width:26px; height:26px; border-radius:6px; border:none; background:#fff; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); color:#64748b;"><i class="fa-solid fa-plus" style="font-size:10px;"></i></button>
            </div>
            <div style="font-size:15px; font-weight:700; color:#0f172a; width:65px; text-align:right;">&#8369;${subtotal.toFixed(2)}</div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  document.getElementById("walkinTotal").innerHTML =
    `&#8369;${total.toFixed(2)}`;
  updateChargeBtn(total);
  calculateChange(total);
}

function addToWalkin(id) {
  if (!walkinCart[id]) {
    const item = walkinItems.find((i) => i.id === id);
    walkinCart[id] = { ...item, qty: 1 };
  } else {
    walkinCart[id].qty++;
  }
  renderWalkinMenu();
  renderWalkinCart();
}

function updateWalkinQty(id, delta) {
  if (walkinCart[id]) {
    walkinCart[id].qty += delta;
    if (walkinCart[id].qty <= 0) delete walkinCart[id];
  }
  renderWalkinMenu();
  renderWalkinCart();
}

function calculateChange(total) {
  const tendered =
    parseFloat(document.getElementById("walkinTendered").value) || 0;

  if (currentPaymentMethod !== "Cash") {
    document.getElementById("walkinChange").textContent = `Change: \u20B10.00`;
    updateChargeBtn(total, tendered);
    return;
  }
  const change = tendered - total;
  const changeEl = document.getElementById("walkinChange");
  if (tendered > 0 && change >= 0) {
    changeEl.innerHTML = `Change: <span style="color:#22c55e;">&#8369;${change.toFixed(2)}</span>`;
  } else {
    changeEl.innerHTML = `Change: <span style="color:#ef4444;">&#8369;0.00</span>`;
  }
  updateChargeBtn(total, tendered);
}

function updateChargeBtn(
  total,
  tendered = parseFloat(document.getElementById("walkinTendered").value) || 0,
) {
  const btn = document.getElementById("walkinChargeBtn");
  btn.innerHTML = `Charge &#8369;${total.toFixed(2)}`;

  let canCharge = total > 0;
  if (tendered < total) {
    canCharge = false;
  }

  if (canCharge) {
    btn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.disabled = false;
    btn.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
  } else {
    btn.style.background = "#e2e8f0";
    btn.style.color = "#94a3b8";
    btn.style.cursor = "not-allowed";
    btn.disabled = true;
    btn.style.boxShadow = "none";
  }
}

document
  .getElementById("walkinSearch")
  ?.addEventListener("input", renderWalkinMenu);
document
  .getElementById("walkinCategory")
  ?.addEventListener("change", renderWalkinMenu);
document.getElementById("walkinTendered")?.addEventListener("input", () => {
  const total = Object.values(walkinCart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  calculateChange(total);
});

document.querySelectorAll(".pay-method-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".pay-method-btn").forEach((b) => {
      b.style.background = "#fff";
      b.style.borderColor = "#cbd5e1";
      b.style.color = "#64748b";
      b.classList.remove("active");
    });
    const target = e.currentTarget;
    target.style.background = "#fef2f2";
    target.style.borderColor = "#ef4444";
    target.style.color = "#dc2626";
    target.classList.add("active");

    currentPaymentMethod = target.dataset.method;
    const cashSection = document.getElementById("walkinCashInputSection");
    const walletOptions = document.getElementById("walkinWalletOptions");
    const amountLabel = document.getElementById("walkinAmountLabel");
    const changeEl = document.getElementById("walkinChange");

    if (currentPaymentMethod === "Cash") {
      walletOptions.style.display = "none";
      amountLabel.textContent = "Amount Tendered";
      changeEl.style.visibility = "visible";
      document.getElementById("walkinTendered").value = "";
    } else {
      walletOptions.style.display = "flex";
      amountLabel.textContent = "Amount to Charge";
      changeEl.style.visibility = "hidden";
      const total = Object.values(walkinCart).reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );
      document.getElementById("walkinTendered").value =
        total > 0 ? total.toFixed(2) : "";
    }

    const total = Object.values(walkinCart).reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    calculateChange(total);
  });
});

document.querySelectorAll(".wallet-option-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".wallet-option-btn")
      .forEach((b) => b.classList.remove("active"));
    const target = e.currentTarget;
    target.classList.add("active");
    currentWalletType = target.dataset.wallet;
    renderWalkinCart(); // refresh button state
  });
});

function finalizeWalkinOrder() {
  const items = Object.values(walkinCart);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const paymentMethodStr =
    currentPaymentMethod === "Wallet" ? currentWalletType : "Cash";

  const newOrder = {
    id: "W" + Date.now().toString().slice(-6),
    items: items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
    total: total,
    status: "completed",
    placedAt: new Date().toISOString(),
    payment: paymentMethodStr,
    vendor: "Canteen 1",
    customerRole: "Walk-in",
  };

  const allOrders = typeof getOrders === "function" ? getOrders() : [];
  allOrders.push(newOrder);
  if (typeof saveOrders === "function") {
    saveOrders(allOrders);
  }

  showVendorToast("success", "fa-check", "Transaction Successful!");

  walkinCart = {};
  document.getElementById("walkinTendered").value = "";
  renderWalkinMenu();
  renderWalkinCart();

  document.getElementById("walkinModal").classList.remove("active");

  if (window.renderVendorOrders) window.renderVendorOrders();
}

document.getElementById("walkinChargeBtn")?.addEventListener("click", () => {
  // If WMSU Wallet is selected, show the QR Modal
  if (
    currentPaymentMethod === "Wallet" &&
    currentWalletType === "WMSU Wallet"
  ) {
    const total = Object.values(walkinCart).reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    document.getElementById("qrModalAmount").innerHTML =
      `&#8369;${total.toFixed(2)}`;
    document.getElementById("qrModalRef").textContent =
      `POS-${Date.now().toString().slice(-6)}`;
    document.getElementById("walkinQrModal").classList.add("active");
    
    // Reset status display
    const statusEl = document.getElementById("paymentStatus");
    const successEl = document.getElementById("paymentSuccess");
    const demoBtn = document.getElementById("simulateScanBtn");
    if (statusEl) statusEl.style.display = "block";
    if (successEl) successEl.style.display = "none";
    if (demoBtn) demoBtn.style.display = "block";
    
    return;
  }

  finalizeWalkinOrder();
});

// Simulation logic
function simulatePaymentScan() {
  const statusEl = document.getElementById("paymentStatus");
  const successEl = document.getElementById("paymentSuccess");
  const demoBtn = document.getElementById("simulateScanBtn");
  
  if (statusEl) statusEl.style.display = "none";
  if (successEl) successEl.style.display = "block";
  if (demoBtn) demoBtn.style.display = "none";
  
  setTimeout(() => {
    document.getElementById("walkinQrModal").classList.remove("active");
    finalizeWalkinOrder();
  }, 1200);
}

// Click QR or Demo Button to simulate successful scan/payment
document.getElementById("qrCodeContainer")?.addEventListener("click", simulatePaymentScan);
document.getElementById("simulateScanBtn")?.addEventListener("click", simulatePaymentScan);

// Confirm payment from QR Modal
// Manual confirmation removed as per request - now handled via click-to-simulate

// Close QR Modal
const qrClose = () =>
  document.getElementById("walkinQrModal").classList.remove("active");
document
  .getElementById("closeWalkinQrModal")
  ?.addEventListener("click", qrClose);
document.getElementById("walkinQrOverlay")?.addEventListener("click", qrClose);

// OPEN MODAL
document.getElementById("openWalkInBtn")?.addEventListener("click", () => {
  walkinCart = {};
  document.getElementById("walkinTendered").value = "";
  currentPaymentMethod = "Cash";
  document.querySelectorAll(".pay-method-btn")[0].click(); // reset to cash

  // Reset mobile view to menu
  toggleWalkinView(false);

  renderWalkinMenu();
  renderWalkinCart();
  document.getElementById("walkinModal").classList.add("active");
});

document.getElementById("closeWalkinModal")?.addEventListener("click", () => {
  document.getElementById("walkinModal").classList.remove("active");
});
document.getElementById("walkinOverlay")?.addEventListener("click", () => {
  document.getElementById("walkinModal").classList.remove("active");
});

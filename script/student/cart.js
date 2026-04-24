/**
 * cart.js — Shared localStorage data module for WM EAT SU
 * Manages: Cart + Orders + Menu + Shops
 * Load this BEFORE any page-specific script.
 */

const CART_KEY   = "wm_eat_su_cart";
const ORDERS_KEY = "wm_eat_su_orders";
const MENU_KEY   = "wm_eat_su_menu";
const SHOPS_KEY  = "wm_eat_su_shops";

/* ═══════════════════════════════════════
   CART
   ═══════════════════════════════════════ */

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

/* ═══════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════ */

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
    const orderId    = "ORD-" + timestamp + "-" + index;
    const pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = {
      id:           orderId,
      items:        [JSON.parse(JSON.stringify(item))],
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
  clearCart();

  return createdOrders.length > 0 ? createdOrders[0] : null;
}

function updateOrderStatus(orderId, status, extra) {
  const orders = getOrders();
  const order  = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    if (extra) Object.assign(order, extra);
    saveOrders(orders);
  }
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

/* ═══════════════════════════════════════
   MENU  (vendor ↔ student browse sync)
   ═══════════════════════════════════════ */

function getMenu() {
  try { return JSON.parse(localStorage.getItem(MENU_KEY)) || []; }
  catch { return []; }
}

function saveMenu(menu) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}

/** Returns only items the vendor has marked as available. */
function getAvailableMenu() {
  return getMenu().filter(item => item.available !== false);
}

function toggleMenuItemAvailability(itemId) {
  const menu = getMenu();
  const item = menu.find(m => m.id === itemId);
  if (item) {
    item.available = !item.available;
    saveMenu(menu);
  }
}

function addMenuItem(newItem) {
  const menu = getMenu();
  // Prevent duplicates by id
  const idx = menu.findIndex(m => m.id === newItem.id);
  if (idx === -1) { menu.push(newItem); }
  else            { menu[idx] = newItem; }
  saveMenu(menu);
}

function updateMenuItem(updatedItem) {
  const menu = getMenu();
  const idx  = menu.findIndex(m => m.id === updatedItem.id);
  if (idx !== -1) menu[idx] = updatedItem;
  else menu.push(updatedItem);
  saveMenu(menu);
}

function deleteMenuItem(itemId) {
  saveMenu(getMenu().filter(m => m.id !== itemId));
}

/**
 * Seeds default menu items the first time (if LS is empty).
 * Run once on any page that loads cart.js.
 */
function initDefaultMenu() {
  if (getMenu().length > 0) return; // already seeded

  const defaults = [
    /* ── Mang Tino's Canteen (shopId 1) ── */
    {
      id: "burger|mang_tinos_canteen", name: "Burger", price: 30,
      category: "meals", badge: "popular", rating: 4.5,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "8 min", stock: 15, available: true, status: "active",
      img: "../../images/burger.avif",
      desc: "Juicy beef patty with lettuce, tomato, cheese, and our special sauce.",
      ingredients: ["Beef patty","Lettuce","Tomato","Cheese","Special sauce","Bun"],
      reviews: [
        { name:"Ana R.", stars:5, comment:"Best burger on campus! Always fresh." },
        { name:"Mark T.", stars:4, comment:"Great taste, a bit small for the price." }
      ]
    },
    {
      id: "shomai_rice|mang_tinos_canteen", name: "Shomai Rice", price: 20,
      category: "meals", badge: "", rating: 5.0,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "5 min", stock: 50, available: true, status: "active",
      img: "../../images/Shomai-rice.jpg",
      desc: "Steamed dumplings served over warm rice with savory sauce.",
      ingredients: ["Shomai","White rice","Soy sauce","Sesame oil","Green onion"],
      reviews: [
        { name:"Lisa M.", stars:5, comment:"Absolutely love this! Perfect comfort food." },
        { name:"Jake P.", stars:5, comment:"Worth every peso. Filling and delicious." }
      ]
    },
    {
      id: "hotdog_with_bun|mang_tinos_canteen", name: "Hotdog with Bun", price: 20,
      category: "snacks", badge: "", rating: 4.2,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "3 min", stock: 20, available: true, status: "active",
      img: "../../images/hotdog.avif",
      desc: "Classic hotdog in a toasted bun with condiments.",
      ingredients: ["Hotdog","Bun","Ketchup","Mustard"],
      reviews: []
    },
    {
      id: "silog|mang_tinos_canteen", name: "Silog Meal", price: 55,
      category: "meals", badge: "popular", rating: 4.6,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "10 min", stock: 25, available: true, status: "active",
      img: "../../images/silog.avif",
      desc: "Filipino breakfast favorite — sinangag (garlic fried rice) and itlog (egg) with your choice of meat.",
      ingredients: ["Garlic rice","Egg","Longanisa","Vinegar","Tomato"],
      reviews: [
        { name:"Joy C.", stars:5, comment:"Sulit at masarap! Perfect for merienda too." }
      ]
    },
    {
      id: "pancit|mang_tinos_canteen", name: "Pancit", price: 40,
      category: "meals", badge: "", rating: 4.3,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "8 min", stock: 18, available: true, status: "active",
      img: "../../images/pancit.avif",
      desc: "Stir-fried noodles loaded with vegetables, chicken, and savory sauce.",
      ingredients: ["Noodles","Chicken","Carrots","Cabbage","Soy sauce","Calamansi"],
      reviews: [
        { name:"Ben A.", stars:4, comment:"Generous serving, mapait kaunti pero okay." }
      ]
    },

    /* ── Street Bites Corner (shopId 2) ── */
    {
      id: "shomai|street_bites_corner", name: "Shomai", price: 15,
      category: "snacks", badge: "new", rating: 4.7,
      vendor: "Street Bites Corner", shopId: 2,
      prepTime: "6 min", stock: 30, available: true, status: "active",
      img: "../../images/Shomai.jpg",
      desc: "Classic steamed dumplings with pork and prawn filling.",
      ingredients: ["Pork","Shrimp","Wrapper","Ginger","Soy sauce"],
      reviews: [{ name:"Carla S.", stars:5, comment:"Mapapa wow ka sa sarap!" }]
    },
    {
      id: "fries|street_bites_corner", name: "Fries", price: 25,
      category: "snacks", badge: "", rating: 4.6,
      vendor: "Street Bites Corner", shopId: 2,
      prepTime: "7 min", stock: 3, available: true, status: "active",
      img: "../../images/Fries.jpg",
      desc: "Crispy on the outside and fluffy on the inside, perfectly seasoned fries.",
      ingredients: ["Potato","Vegetable oil","Salt","Seasoning"],
      reviews: [{ name:"Ken A.", stars:5, comment:"Always crispy. Never disappoints!" }]
    },
    {
      id: "kwek-kwek|street_bites_corner", name: "Kwek-Kwek", price: 15,
      category: "snacks", badge: "popular", rating: 4.7,
      vendor: "Street Bites Corner", shopId: 2,
      prepTime: "2 min", stock: 40, available: true, status: "active",
      img: "../../images/kwek.jpg",
      desc: "Fried orange-coated quail eggs served with vinegar sauce.",
      ingredients: ["Quail eggs","Flour","Food color","Vinegar"],
      reviews: [{ name:"Pau L.", stars:4, comment:"Masarap lalo na yung sawsawan." }]
    },
    {
      id: "chips|street_bites_corner", name: "Chips", price: 20,
      category: "snacks", badge: "", rating: 4.1,
      vendor: "Street Bites Corner", shopId: 2,
      prepTime: "1 min", stock: 60, available: true, status: "active",
      img: "../../images/chips.avif",
      desc: "Crunchy flavored potato chips, perfect study snack.",
      ingredients: ["Potato","Oil","Salt","Flavoring"],
      reviews: []
    },

    /* ── Sip & Chill Beverages (shopId 3) ── */
    {
      id: "iced_coffee|sip_&_chill_beverages", name: "Iced Coffee", price: 30,
      category: "drinks", badge: "", rating: 4.8,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "3 min", stock: 20, available: true, status: "active",
      img: "../../images/Iced-coffee.png",
      desc: "Cold brewed coffee with milk and a hint of vanilla.",
      ingredients: ["Cold brew","Fresh milk","Vanilla syrup","Ice","Sugar"],
      reviews: [
        { name:"Ryan B.", stars:5, comment:"Perfect pick-me-up between classes!" },
        { name:"Sofia D.", stars:4, comment:"Really smooth and not too sweet." }
      ]
    },
    {
      id: "coke|sip_&_chill_beverages", name: "Coke", price: 25,
      category: "drinks", badge: "popular", rating: 4.9,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "1 min", stock: 50, available: true, status: "active",
      img: "../../images/coke.png",
      desc: "Icy-cold classic that delivers the perfect refreshing kick.",
      ingredients: ["Carbonated water","Sugar","Caramel color","Caffeine"],
      reviews: [{ name:"Mia C.", stars:5, comment:"Ice cold and perfectly chilled!" }]
    },
    {
      id: "mango_shake|sip_&_chill_beverages", name: "Mango Shake", price: 35,
      category: "drinks", badge: "popular", rating: 4.9,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "5 min", stock: 25, available: true, status: "active",
      img: "../../images/mangoshake.jpg",
      desc: "Fresh mango blended with milk and ice.",
      ingredients: ["Mango","Milk","Ice","Sugar"],
      reviews: [{ name:"Gab V.", stars:5, comment:"The best shake on campus!" }]
    },
    {
      id: "milktea|sip_&_chill_beverages", name: "Milk Tea", price: 45,
      category: "drinks", badge: "", rating: 4.5,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "5 min", stock: 18, available: true, status: "active",
      img: "../../images/milktea.avif",
      desc: "Creamy milk tea with chewy tapioca pearls.",
      ingredients: ["Black tea","Milk","Pearls","Sugar"],
      reviews: []
    },
    {
      id: "gulaman|sip_&_chill_beverages", name: "Gulaman Drink", price: 15,
      category: "drinks", badge: "", rating: 4.0,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "2 min", stock: 35, available: true, status: "active",
      img: "../../images/gulaman.avif",
      desc: "Refreshing cold gulaman jelly drink, sweet and thirst-quenching.",
      ingredients: ["Gulaman","Water","Sugar","Food color"],
      reviews: []
    },
    {
      id: "calamansi_juice|sip_&_chill_beverages", name: "Calamansi Juice", price: 20,
      category: "drinks", badge: "", rating: 4.3,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "3 min", stock: 30, available: true, status: "active",
      img: "../../images/calamnsi-juice.avif",
      desc: "Fresh-squeezed calamansi juice — naturally tangy and refreshing.",
      ingredients: ["Calamansi","Water","Sugar","Ice"],
      reviews: []
    },
    {
      id: "juice|sip_&_chill_beverages", name: "Fruit Juice", price: 20,
      category: "drinks", badge: "", rating: 4.2,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "2 min", stock: 40, available: true, status: "active",
      img: "../../images/juice.avif",
      desc: "Chilled fruit juice blend — sweet and vitamin-rich.",
      ingredients: ["Mixed fruits","Water","Sugar"],
      reviews: []
    },
    {
      id: "shake|sip_&_chill_beverages", name: "Fruit Shake", price: 30,
      category: "drinks", badge: "", rating: 4.4,
      vendor: "Sip & Chill Beverages", shopId: 3,
      prepTime: "4 min", stock: 22, available: true, status: "active",
      img: "../../images/shake.avif",
      desc: "Blended fresh fruit shake, creamy and naturally sweet.",
      ingredients: ["Seasonal fruit","Milk","Ice","Sugar"],
      reviews: []
    },

    /* ── Sweet Tooth Desserts (shopId 4) ── */
    {
      id: "halo_halo|sweet_tooth_desserts", name: "Halo-Halo", price: 55,
      category: "desserts", badge: "popular", rating: 4.8,
      vendor: "Sweet Tooth Desserts", shopId: 4,
      prepTime: "5 min", stock: 15, available: true, status: "active",
      img: "../../images/halo.avif",
      desc: "Filipino shaved ice dessert loaded with sweet beans, fruits, leche flan, and ube ice cream.",
      ingredients: ["Shaved ice","Sweet beans","Kaong","Langka","Leche flan","Ube ice cream"],
      reviews: [
        { name:"Nina P.", stars:5, comment:"SOBRANG SARAP. Best halo-halo sa campus!" }
      ]
    },
    {
      id: "leche_flan|sweet_tooth_desserts", name: "Leche Flan", price: 35,
      category: "desserts", badge: "", rating: 4.6,
      vendor: "Sweet Tooth Desserts", shopId: 4,
      prepTime: "2 min", stock: 12, available: true, status: "active",
      img: "../../images/leche.avif",
      desc: "Smooth and creamy caramel custard, a classic Filipino dessert.",
      ingredients: ["Egg yolks","Condensed milk","Evaporated milk","Sugar","Vanilla"],
      reviews: [{ name:"Bea S.", stars:5, comment:"Just like lola's!" }]
    },
    {
      id: "strawberry_dessert|sweet_tooth_desserts", name: "Strawberry Dessert", price: 40,
      category: "desserts", badge: "new", rating: 4.5,
      vendor: "Sweet Tooth Desserts", shopId: 4,
      prepTime: "4 min", stock: 10, available: true, status: "active",
      img: "../../images/strawberry.avif",
      desc: "Fresh strawberries served with cream and sweet syrup.",
      ingredients: ["Strawberries","Whipped cream","Syrup","Sugar"],
      reviews: []
    },

    /* ── Native Delights (shopId 12) ── */
    {
      id: "bibingka|native_delights", name: "Bibingka", price: 40,
      category: "snacks", badge: "new", rating: 4.8,
      vendor: "Native Delights", shopId: 12,
      prepTime: "10 min", stock: 10, available: true, status: "active",
      img: "../../images/bibingka.jpg",
      desc: "Traditional rice cake topped with salted egg and cheese.",
      ingredients: ["Rice flour","Coconut milk","Egg","Cheese","Salted egg"],
      reviews: [{ name:"Lola E.", stars:5, comment:"Lutong bahay na sarap!" }]
    },
    {
      id: "mango_float|native_delights", name: "Mango Float", price: 50,
      category: "desserts", badge: "", rating: 4.7,
      vendor: "Native Delights", shopId: 12,
      prepTime: "3 min", stock: 8, available: true, status: "active",
      img: "../../images/mango.jpg.webp",
      desc: "Layers of graham crackers, cream, and sweet fresh mangoes.",
      ingredients: ["Graham crackers","Cream","Mangoes","Condensed milk"],
      reviews: [{ name:"Tin M.", stars:5, comment:"Always a crowd favorite!" }]
    },

    /* ── The Gourmet Grill (shopId 11) ── */
    {
      id: "spicy_chicken_fillet|the_gourmet_grill", name: "Spicy Chicken Fillet", price: 45,
      category: "meals", badge: "", rating: 4.6,
      vendor: "The Gourmet Grill", shopId: 11,
      prepTime: "12 min", stock: 12, available: true, status: "active",
      img: "../../images/spciy.jpg",
      desc: "Crispy chicken fillet with a bold spicy kick, served with rice.",
      ingredients: ["Chicken","Breadcrumbs","Spices","Rice"],
      reviews: [{ name:"Dan O.", stars:5, comment:"Hot and crispy!" }]
    },

    /* ── Campus Pizza Hub (shopId 6) ── */
    {
      id: "pizza|campus_pizza_hub", name: "Campus Pizza", price: 65,
      category: "meals", badge: "popular", rating: 4.4,
      vendor: "Campus Pizza Hub", shopId: 6,
      prepTime: "15 min", stock: 10, available: true, status: "active",
      img: "../../images/pizza.avif",
      desc: "Thin-crust pizza loaded with cheese, tomato sauce, and campus-favorite toppings.",
      ingredients: ["Dough","Tomato sauce","Mozzarella","Toppings"],
      reviews: [{ name:"Ed C.", stars:4, comment:"Great value for money!" }]
    },
    {
      id: "steak_rice|example", name: "Steak Rice", price: 120,
      category: "meals", badge: "new", rating: 4.0,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "15 min", stock: 10, available: true, status: "pending",
      img: "../../images/burger.avif",
      desc: "Premium beef steak served with garlic rice and gravy.",
      ingredients: ["Beef","Rice","Gravy"],
      reviews: []
    },
    {
      id: "chicken_joy|example", name: "Chicken Joy", price: 85,
      category: "meals", badge: "", rating: 4.8,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "10 min", stock: 20, available: true, status: "accepted",
      img: "../../images/spciy.jpg",
      desc: "Crispy fried chicken with rice and gravy.",
      ingredients: ["Chicken","Rice","Gravy"],
      reviews: []
    },
    {
      id: "fish_fillet|example", name: "Fish Fillet", price: 75,
      category: "meals", badge: "", rating: 3.5,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "12 min", stock: 15, available: true, status: "rejected",
      rejectReason: "Image quality is too low. Please provide a clearer photo of the actual dish.",
      img: "../../images/burger.avif",
      desc: "Breaded fish fillet with tartar sauce.",
      ingredients: ["Fish","Breadcrumbs","Tartar sauce"],
      reviews: []
    }
  ];

  saveMenu(defaults);
}

/* ═══════════════════════════════════════
   SHOPS  (campus map + browse shops sync)
   ═══════════════════════════════════════ */

function getShops() {
  try { return JSON.parse(localStorage.getItem(SHOPS_KEY)) || []; }
  catch { return []; }
}

function saveShops(shops) {
  localStorage.setItem(SHOPS_KEY, JSON.stringify(shops));
}

function initDefaultShops() {
  if (getShops().length > 0) return;

  const defaults = [
    { id:1,  name:"Mang Tino's Canteen",      category:"Meals",    img:"../../images/silog.avif",      rating:4.5, loc:"Canteen 1 Hall",          lat:6.91243320596896,  lng:122.06345799098618, type:"canteen" },
    { id:2,  name:"Street Bites Corner",       category:"Snacks",   img:"../../images/kwek.jpg",        rating:4.7, loc:"Science Hall Entrance",   lat:6.913187183190812, lng:122.06339479576178, type:"canteen" },
    { id:3,  name:"Sip & Chill Beverages",     category:"Drinks",   img:"../../images/milktea.avif",    rating:4.8, loc:"Beside University Pond",  lat:6.913773971170068, lng:122.06165556183369, type:"canteen" },
    { id:4,  name:"Sweet Tooth Desserts",      category:"Desserts", img:"../../images/halo.avif",       rating:4.6, loc:"Engineering Bldg G/F",    lat:6.913552464390463, lng:122.0608910942802,  type:"canteen" },
    { id:5,  name:"Green Bowl — Healthy Eats", category:"Healthy",  img:"../../images/pancit.avif",     rating:4.9, loc:"College of Education Area",lat:6.912850720564993, lng:122.06175222757005, type:"vendor"  },
    { id:6,  name:"Campus Pizza Hub",          category:"Meals",    img:"../../images/pizza.avif",      rating:4.4, loc:"Near Admin Building",      lat:6.912861371406072, lng:122.06177569689841, type:"canteen" },
    { id:7,  name:"The Coffee Dock",           category:"Drinks",   img:"../../images/Iced-coffee.png", rating:4.3, loc:"Library Lobby",            lat:6.912876016312175, lng:122.06179514291333, type:"canteen" },
    { id:8,  name:"Veggie Vibes",              category:"Healthy",  img:"../../images/gulaman.avif",    rating:4.2, loc:"Open Court Area",          lat:6.912892658250371, lng:122.06185012819688, type:"vendor"  },
    { id:9,  name:"Grill Master",              category:"Snacks",   img:"../../images/hotdog.avif",     rating:4.1, loc:"Main Gate Side",           lat:6.912905971800495, lng:122.06186018648046, type:"canteen" },
    { id:10, name:"Pasta Paradise",            category:"Meals",    img:"../../images/pancit.avif",     rating:4.6, loc:"Near Gymnasium",           lat:6.912921282382685, lng:122.06187359752525, type:"canteen" },
    { id:11, name:"The Gourmet Grill",         category:"Meals",    img:"../../images/spciy.jpg",       rating:4.4, loc:"College of Engineering",   lat:6.912933264577098, lng:122.0618937140924,  type:"canteen" },
    { id:12, name:"Native Delights",           category:"Snacks",   img:"../../images/bibingka.jpg",    rating:4.7, loc:"Arts & Science Building",  lat:6.912963020964882, lng:122.061914844922,   type:"vendor"  }
  ];

  saveShops(defaults);
}

/* ═══════════════════════════════════════
   BADGE / UI SYNC
   ═══════════════════════════════════════ */

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

/* ═══════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════ */

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

/* ── Auto-seed on every page that loads this module ── */
initDefaultMenu();
initDefaultShops();

// Force add examples if missing (for demo purposes)
(function seedExamples() {
  const currentMenu = JSON.parse(localStorage.getItem("wm_eat_su_menu")) || [];
  const examples = [
    {
      id: "steak_rice|example", name: "Steak Rice", price: 120,
      category: "meals", badge: "new", rating: 4.0,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "15 min", stock: 10, available: true, status: "pending",
      img: "../../images/burger.avif",
      desc: "Premium beef steak served with garlic rice and gravy.",
      ingredients: ["Beef","Rice","Gravy"],
      reviews: []
    },
    {
      id: "chicken_joy|example", name: "Chicken Joy", price: 85,
      category: "meals", badge: "", rating: 4.8,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "10 min", stock: 20, available: true, status: "accepted",
      img: "../../images/spciy.jpg",
      desc: "Crispy fried chicken with rice and gravy.",
      ingredients: ["Chicken","Rice","Gravy"],
      reviews: []
    },
    {
      id: "fish_fillet|example", name: "Fish Fillet", price: 75,
      category: "meals", badge: "", rating: 3.5,
      vendor: "Mang Tino's Canteen", shopId: 1,
      prepTime: "12 min", stock: 15, available: true, status: "rejected",
      rejectReason: "Application rejected. This item is classified as unhealthy due to excessive oil usage and lack of nutritional balance. The University's food policy restricts deep-fried items without healthier side options. Please submit a revised menu with more nutritious ingredients.",
      img: "../../images/burger.avif",
      desc: "Breaded fish fillet with tartar sauce.",
      ingredients: ["Fish","Breadcrumbs","Tartar sauce"],
      reviews: []
    }
  ];
  let changed = false;
  examples.forEach(ex => {
    const idx = currentMenu.findIndex(m => m.id === ex.id);
    if (idx === -1) {
      currentMenu.push(ex);
      changed = true;
    } else {
      // Force update the status and reason for the demo
      if (currentMenu[idx].status !== ex.status || currentMenu[idx].rejectReason !== ex.rejectReason) {
        currentMenu[idx].status = ex.status;
        currentMenu[idx].rejectReason = ex.rejectReason;
        changed = true;
      }
    }
  });
  if (changed) localStorage.setItem("wm_eat_su_menu", JSON.stringify(currentMenu));
})();

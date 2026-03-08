let activeTab = 'Pending';

// Update tabs and filter orders by status
function updateTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.order-card');
  
  // Mark active tab
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === activeTab));
  
  // Count by status
  let counts = { Pending: 0, Preparing: 0, Ready: 0, Completed: 0, Cancelled: 0 };
  cards.forEach(card => {
    const status = card.dataset.status;
    if (status) counts[status]++;
  });
  
  // Update tab labels
  tabs.forEach(tab => tab.textContent = `${tab.dataset.tab} (${counts[tab.dataset.tab] || 0})`);
  
  // Show/hide cards
  cards.forEach(card => card.style.display = card.dataset.status === activeTab ? 'block' : 'none');
}

// Update order status and UI
function updateOrderStatus(card, newStatus, newBadgeClass, newIcon) {
  card.dataset.status = newStatus;
  card.querySelector('.status-badge').textContent = newStatus;
  card.querySelector('.status-badge').className = `status-badge ${newBadgeClass}`;
  card.querySelector('.status-icon').className = newIcon;
}

// Decline order
function declineOrder(event) {
  const card = event.target.closest('.order-card');
  updateOrderStatus(card, 'Cancelled', 'cancelled', 'fa-solid fa-circle-xmark status-icon cancelled-icon');
  card.querySelector('.order-actions')?.remove();
  activeTab = 'Cancelled';
  updateTabs();
}

// Accept order
function acceptOrder(event) {
  const card = event.target.closest('.order-card');
  updateOrderStatus(card, 'Preparing', 'preparing', 'fa-solid fa-clock status-icon');
  const actions = card.querySelector('.order-actions');
  actions.innerHTML = '<button class="mark-ready-btn"><i class="fas fa-check"></i> Mark Ready</button>';
  actions.querySelector('.mark-ready-btn').addEventListener('click', markReady);
  activeTab = 'Preparing';
  updateTabs();
}

// Mark order ready
function markReady(event) {
  const card = event.target.closest('.order-card');
  updateOrderStatus(card, 'Ready', 'ready', 'fa-solid fa-check-circle status-icon');
  card.querySelector('.mark-ready-btn')?.remove();
  activeTab = 'Ready';
  updateTabs();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(tab => tab.addEventListener('click', () => { activeTab = tab.dataset.tab; updateTabs(); }));
  document.querySelectorAll('.decline-btn').forEach(btn => btn.addEventListener('click', declineOrder));
  document.querySelectorAll('.accept-btn').forEach(btn => btn.addEventListener('click', acceptOrder));
  document.querySelectorAll('.mark-ready-btn').forEach(btn => btn.addEventListener('click', markReady));
  updateTabs();
});


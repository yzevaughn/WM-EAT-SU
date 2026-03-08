// Simple Wallet Prototype
let balance = 50.00;
let selectedMethod = null;
let selectedAmount = null;

// Modal
function openTopUpModal() {
  document.getElementById('topUpModal').classList.add('active');
}

function closeTopUpModal() {
  document.getElementById('topUpModal').classList.remove('active');
  resetForm();
}

function resetForm() {
  selectedMethod = null;
  selectedAmount = null;
  document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('topupAmount').value = '';
  document.getElementById('topupSummary').style.display = 'none';
  document.getElementById('errorMessage').classList.remove('show');
  document.getElementById('confirmTopUpBtn').disabled = true;
}

// Select Payment Method
function selectPaymentMethod(method) {
  selectedMethod = method;
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.method === method);
  });
  checkForm();
}

// Quick Amount
function setQuickAmount(amount) {
  selectedAmount = amount;
  document.getElementById('topupAmount').value = amount.toFixed(2);
  document.querySelectorAll('.quick-btn').forEach((btn, i) => {
    btn.classList.toggle('active', [10, 20, 50, 100][i] === amount);
  });
  updateSummary();
  checkForm();
}

// Custom Amount
function validateAmount() {
  const input = document.getElementById('topupAmount');
  selectedAmount = parseFloat(input.value) || null;
  document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
  updateSummary();
  checkForm();
}

// Update Summary
function updateSummary() {
  const summary = document.getElementById('topupSummary');
  if (selectedMethod && selectedAmount > 0) {
    const methodNames = { gcash: 'GCash', maya: 'Maya', card: 'Bank Card' };
    document.getElementById('selectedMethodDisplay').textContent = methodNames[selectedMethod];
    document.getElementById('selectedAmountDisplay').textContent = `$${selectedAmount.toFixed(2)}`;
    summary.style.display = 'flex';
  } else {
    summary.style.display = 'none';
  }
}

// Check Form
function checkForm() {
  document.getElementById('confirmTopUpBtn').disabled = !(selectedMethod && selectedAmount > 0);
}

// Confirm Top Up
async function confirmTopUp() {
  const btn = document.getElementById('confirmTopUpBtn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  // Simulate 2 second payment
  await new Promise(r => setTimeout(r, 2000));

  // Success
  balance += selectedAmount;
  document.getElementById('walletBalance').textContent = balance.toFixed(2);
  
  // Add transaction
  const methodNames = { gcash: 'GCash', maya: 'Maya', card: 'Bank Card' };
  const now = new Date();
  const html = `
    <div class="transaction-item">
      <div class="transaction-icon topup"><i class="fa-solid fa-plus-circle"></i></div>
      <div class="transaction-details">
        <p class="transaction-type">Wallet Top-up via ${methodNames[selectedMethod]}</p>
        <p class="transaction-date">${now.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} - ${now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}</p>
      </div>
      <div class="transaction-amount positive">+$${selectedAmount.toFixed(2)}</div>
    </div>
  `;
  document.getElementById('transactionList').insertAdjacentHTML('afterbegin', html);

  // Success message
  const msgEl = document.getElementById('successMessage');
  document.getElementById('successText').textContent = `Top up successful via ${methodNames[selectedMethod]}!`;
  msgEl.classList.add('show');
  setTimeout(() => msgEl.classList.remove('show'), 4000);

  closeTopUpModal();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });

  // Profile dropdown
  document.getElementById('profileBtn')?.addEventListener('click', () => {
    document.getElementById('profileDropdown').classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileBtn');
    if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Top up button
  document.getElementById('topupBtn')?.addEventListener('click', openTopUpModal);

  // Modal close buttons
  document.getElementById('modalClose')?.addEventListener('click', closeTopUpModal);
  document.getElementById('cancelBtn')?.addEventListener('click', closeTopUpModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeTopUpModal);

  // Payment method buttons
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.addEventListener('click', () => selectPaymentMethod(btn.dataset.method));
  });

  // Quick amount buttons
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => setQuickAmount(parseInt(btn.dataset.amount)));
  });

  // Amount input
  document.getElementById('topupAmount')?.addEventListener('input', validateAmount);

  // Confirm button
  document.getElementById('confirmTopUpBtn')?.addEventListener('click', confirmTopUp);
});

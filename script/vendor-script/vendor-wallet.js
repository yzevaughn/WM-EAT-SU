// ============================================
// VENDOR WALLET PAGE - BALANCE & TRANSACTIONS
// ============================================

// Track selected withdrawal method
let selectedMethod = null;
// Track selected withdrawal amount
let selectedAmount = null;

// ============================================
// MODAL MANAGEMENT FUNCTIONS
// ============================================

/**
 * Opens the top-up/withdrawal modal dialog
 * Resets form state and payment method selection
 */
function openTopUpModal() {
  document.getElementById('topUpModal').classList.add('active');
  selectedMethod = null;
  selectedAmount = null;
  document.getElementById('topupAmount').value = '';
  document.getElementById('topupSummary').style.display = 'none';
  document.getElementById('confirmTopUpBtn').disabled = true;
}

/**
 * Closes the top-up/withdrawal modal dialog
 */
function closeTopUpModal() {
  document.getElementById('topUpModal').classList.remove('active');
}

// ============================================
// PAYMENT METHOD SELECTION
// ============================================

/**
 * Handles payment method selection
 * Updates UI to show selected method
 */
function selectPaymentMethod(method) {
  selectedMethod = method;
  
  // Update button styling
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.closest('.payment-method-btn').classList.add('selected');
  
  // Update summary
  updateSummary();
}

// ============================================
// AMOUNT SELECTION
// ============================================

/**
 * Handles quick amount button selection
 * Fills amount field and updates summary
 */
function selectQuickAmount(amount) {
  document.getElementById('topupAmount').value = amount;
  selectedAmount = amount;
  updateSummary();
}

/**
 * Updates the withdrawal summary display
 * Shows selected method and amount
 */
function updateSummary() {
  const amount = document.getElementById('topupAmount').value;
  const summary = document.getElementById('topupSummary');
  const confirmBtn = document.getElementById('confirmTopUpBtn');
  
  // Only show summary if both method and amount selected
  if (selectedMethod && amount) {
    document.getElementById('selectedMethodDisplay').textContent = selectedMethod.toUpperCase();
    document.getElementById('selectedAmountDisplay').textContent = `₱${parseFloat(amount).toFixed(2)}`;
    summary.style.display = 'block';
    confirmBtn.disabled = false;
  } else {
    summary.style.display = 'none';
    confirmBtn.disabled = true;
  }
}

/**
 * Submits withdrawal request
 * Validates form and shows success message
 */
function confirmWithdrawal() {
  const amount = parseFloat(document.getElementById('topupAmount').value);
  const balance = parseFloat(document.getElementById('walletBalance').textContent);
  
  // VALIDATION - Check if amount is valid
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  // VALIDATION - Check if sufficient balance
  if (amount > balance) {
    alert('Insufficient balance for this withdrawal');
    return;
  }
  
  // PROCESS WITHDRAWAL - Update balance
  const newBalance = balance - amount;
  document.getElementById('walletBalance').textContent = newBalance.toFixed(2);
  
  // Show success message
  const successMsg = document.getElementById('successMessage');
  successMsg.style.display = 'flex';
  
  // Hide success message after 3 seconds
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);
  
  // Close modal
  closeTopUpModal();
}

// ============================================
// EVENT LISTENERS INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // TOPUP BUTTON - Open withdrawal modal
  const topupBtn = document.getElementById('topupBtn');
  if (topupBtn) {
    topupBtn.addEventListener('click', openTopUpModal);
  }

  // MODAL CLOSE BUTTONS - Handle modal closing
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const cancelBtn = document.getElementById('cancelBtn');
  
  if (modalClose) modalClose.addEventListener('click', closeTopUpModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeTopUpModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeTopUpModal);

  // CONFIRM BUTTON - Submit withdrawal
  const confirmBtn = document.getElementById('confirmTopUpBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmWithdrawal);
  }

  // QUICK AMOUNT BUTTONS - Select preset amounts
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.dataset.amount;
      selectQuickAmount(amount);
    });
  });

  // PAYMENT METHOD BUTTONS - Select withdrawal method
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      selectPaymentMethod(method);
    });
  });

  // AMOUNT INPUT - Update summary when user types amount
  document.getElementById('topupAmount')?.addEventListener('input', () => {
    selectedAmount = document.getElementById('topupAmount').value;
    updateSummary();
  });

  // SIDEBAR MENU TOGGLE - Toggle mobile sidebar navigation
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // PROFILE DROPDOWN - Toggle profile dropdown menu
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (profileBtn && profileDropdown) {
    // Toggle dropdown on button click
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      profileDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        profileDropdown.classList.remove('active');
      }
    });
  }
});
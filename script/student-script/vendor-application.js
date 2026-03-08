// Vendor Application - Prototype Only
// This is a frontend prototype. Only UI interactions are implemented.
// No data is stored or transferred.

// Initialize page on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  const applyNowBtn = document.getElementById('applyNowBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const form = document.getElementById('applicationForm');
  const modal = document.getElementById('applicationModal');

  // Open modal
  applyNowBtn?.addEventListener('click', () => openModal());

  // Close modal
  cancelBtn?.addEventListener('click', () => closeModal());
  modalClose?.addEventListener('click', () => closeModal());
  modalOverlay?.addEventListener('click', () => closeModal());

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission (prototype - no real backend)
  form?.addEventListener('submit', (e) => handleFormSubmit(e));
}

// Open modal
function openModal() {
  const modal = document.getElementById('applicationModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('applicationModal');
  const form = document.getElementById('applicationForm');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  form.reset();
}

// Handle form submission (interaction only - no data transfer)
function handleFormSubmit(e) {
  e.preventDefault();

  // Get form data for display only
  const businessName = document.getElementById('businessName').value;
  const ownerName = document.getElementById('ownerName').value;
  const productName = document.getElementById('productName').value;
  const ingredients = document.getElementById('ingredients').value;

  // Validate required fields
  if (!businessName.trim() || !ownerName.trim() || !productName.trim() || !ingredients.trim()) {
    alert('Please fill in all required fields');
    return;
  }

  // Interaction only - show confirmation
  alert('Thank you for your application! Your form will be reviewed by admin.');

  // Close modal and reset form
  closeModal();
}

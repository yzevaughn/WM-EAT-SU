// Complaint Modal - Prototype Only

const fileComplaintBtn = document.getElementById('fileComplaintBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('complaintModal');
const form = document.getElementById('complaintForm');

// Open modal
fileComplaintBtn?.addEventListener('click', () => {
  modal.classList.add('active');
});

// Close modal
cancelBtn?.addEventListener('click', () => {
  modal.classList.remove('active');
  form.reset();
});

modalClose?.addEventListener('click', () => {
  modal.classList.remove('active');
  form.reset();
});

modalOverlay?.addEventListener('click', () => {
  modal.classList.remove('active');
  form.reset();
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    form.reset();
  }
});

// Simple form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Complaint submitted successfully!');
  modal.classList.remove('active');
  form.reset();
});

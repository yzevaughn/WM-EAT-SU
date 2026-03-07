// Order History - Review System
// Prototype Only - No data is stored or transferred

let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
  setupReviewModals();
  setupStarRating();
});

// Setup review modal for completed orders
function setupReviewModals() {
  const reviewBtns = document.querySelectorAll('.review-btn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalOverlay = document.getElementById('reviewModalOverlay');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewCancelBtn = document.getElementById('reviewCancelBtn');
  const reviewForm = document.getElementById('reviewForm');

  reviewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const foodName = btn.closest('.order-card').querySelector('.order-details span').textContent;
      document.getElementById('reviewFoodName').textContent = foodName;
      selectedRating = 0;
      updateStarDisplay();
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal handlers
  reviewModalClose?.addEventListener('click', closeReviewModal);
  reviewModalOverlay?.addEventListener('click', closeReviewModal);
  reviewCancelBtn?.addEventListener('click', closeReviewModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewModal.classList.contains('active')) {
      closeReviewModal();
    }
  });

  // Form submission
  reviewForm?.addEventListener('submit', (e) => handleReviewSubmit(e));
}

// Close review modal
function closeReviewModal() {
  const reviewModal = document.getElementById('reviewModal');
  const reviewForm = document.getElementById('reviewForm');
  reviewModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  reviewForm.reset();
  selectedRating = 0;
  updateStarDisplay();
}

// Setup star rating system
function setupStarRating() {
  const starBtns = document.querySelectorAll('.star-btn');

  starBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedRating = parseInt(btn.dataset.rating);
      updateStarDisplay();
    });

    btn.addEventListener('mouseenter', (e) => {
      const hoverRating = parseInt(btn.dataset.rating);
      starBtns.forEach((star, idx) => {
        if (idx < hoverRating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    });
  });

  document.getElementById('starRating').addEventListener('mouseleave', updateStarDisplay);
}

// Update star display based on selection
function updateStarDisplay() {
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingText = document.getElementById('ratingText');

  starBtns.forEach((btn, idx) => {
    if (idx < selectedRating) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (selectedRating > 0) {
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    ratingText.textContent = ratings[selectedRating - 1];
    ratingText.style.color = '#111827';
  } else {
    ratingText.textContent = 'Click to rate';
    ratingText.style.color = '#6b7280';
  }
}

// Handle review form submission (prototype - no data storage)
function handleReviewSubmit(e) {
  e.preventDefault();

  const comment = document.getElementById('reviewComment').value;
  const foodName = document.getElementById('reviewFoodName').textContent;

  // Validate
  if (selectedRating === 0) {
    alert('Please select a rating');
    return;
  }

  if (!comment.trim()) {
    alert('Please write a comment');
    return;
  }

  // Show confirmation (prototype only)
  alert(`Thank you for your review!\n\nFood: ${foodName}\nRating: ${'⭐'.repeat(selectedRating)}\nComment: ${comment.substring(0, 50)}...`);

  // Close modal
  closeReviewModal();
}

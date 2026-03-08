let rating = 0;

document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("reviewModal");
  const form = document.getElementById("reviewForm");
  const stars = document.querySelectorAll(".star-btn");
  const ratingText = document.getElementById("ratingText");

  // Open review modal
  document.querySelectorAll(".review-btn").forEach(btn => {
    btn.onclick = () => {
      const food = btn.closest(".order-card")
        .querySelector(".order-details span").textContent;

      document.getElementById("reviewFoodName").textContent = food;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    form.reset();
    rating = 0;
    updateStars();
  }

  document.getElementById("reviewModalClose").onclick = closeModal;
  document.getElementById("reviewCancelBtn").onclick = closeModal;
  document.getElementById("reviewModalOverlay").onclick = closeModal;

  // Star rating
  stars.forEach((star, i) => {
    star.onclick = () => {
      rating = i + 1;
      updateStars();
    };
  });

  function updateStars() {
    stars.forEach((star, i) => {
      star.classList.toggle("active", i < rating);
    });

    const text = ["Poor","Fair","Good","Very Good","Excellent"];
    ratingText.textContent = rating ? text[rating-1] : "Click to rate";
  }

  // Submit review
  form.onsubmit = e => {
    e.preventDefault();

    const comment = document.getElementById("reviewComment").value.trim();
    const food = document.getElementById("reviewFoodName").textContent;

    if (!rating) return alert("Please select a rating");
    if (!comment) return alert("Please write a comment");

    alert(`Thank you for your review!\n\nFood: ${food}\nRating: ${"⭐".repeat(rating)}\nComment: ${comment}`);

    closeModal();
  };

});
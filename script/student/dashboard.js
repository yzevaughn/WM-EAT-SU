document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     1. FOOD SLIDER
     ============================================================ */
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const dotsContainer = document.getElementById("sliderDots");

  if (track) {
    const cards = track.querySelectorAll(".food-card");

    // Only initialize if there are cards
    if (cards.length > 0) {
      const cardWidth =
        cards[0].offsetWidth +
        parseInt(getComputedStyle(cards[0]).marginRight || 0);
      let currentIndex = 0;
      let autoSlideTimer = null;
      let isDragging = false;
      let startX = 0;

      const getVisibleCount = () =>
        Math.floor(track.parentElement.offsetWidth / cardWidth) || 1;
      const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

      const buildDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        for (let i = 0; i <= getMaxIndex(); i++) {
          const dot = document.createElement("button");
          dot.className = "dot" + (i === currentIndex ? " active" : "");
          dot.setAttribute("aria-label", `Slide ${i + 1}`);
          dot.addEventListener("click", () => goTo(i));
          dotsContainer.appendChild(dot);
        }
      };

      const updateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
          dot.classList.toggle("active", i === currentIndex);
        });
      };

      const DESIGN_GAP = 20;

      const goTo = (index) => {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const containerWidth = track.parentElement.offsetWidth;
        const totalWidth = track.scrollWidth;
        const maxTranslate = totalWidth - containerWidth + DESIGN_GAP;
        const step = maxTranslate / maxIndex || 0;
        let translateX = step * currentIndex;

        translateX = Math.min(translateX, maxTranslate);
        track.style.transform = `translateX(-${translateX}px)`;
        updateDots();
      };

      prevBtn?.addEventListener("click", () => {
        resetAutoSlide();
        goTo(currentIndex - 1);
      });

      nextBtn?.addEventListener("click", () => {
        resetAutoSlide();
        goTo(currentIndex + 1);
      });

      const startAutoSlide = () => {
        autoSlideTimer = setInterval(() => {
          goTo(currentIndex < getMaxIndex() ? currentIndex + 1 : 0);
        }, 4000);
      };

      const resetAutoSlide = () => {
        clearInterval(autoSlideTimer);
        startAutoSlide();
      };

      const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

      track.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = getClientX(e);
        track.style.transition = "none";
      });

      track.addEventListener(
        "touchstart",
        (e) => {
          startX = getClientX(e);
          track.style.transition = "none";
        },
        { passive: true },
      );

      const onDragEnd = (e) => {
        if (!isDragging && e.type === "mouseup") return;
        isDragging = false;
        const diff = startX - getClientX(e);
        track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        if (Math.abs(diff) > 60) {
          resetAutoSlide();
          diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        } else {
          goTo(currentIndex);
        }
      };

      track.addEventListener("mouseup", onDragEnd);
      track.addEventListener("touchend", onDragEnd);
      track.addEventListener("mouseleave", (e) => {
        if (isDragging) onDragEnd(e);
      });
      track.addEventListener("click", (e) => {
        if (Math.abs(startX - getClientX(e)) > 5) e.preventDefault();
      });

      window.addEventListener("resize", () => {
        buildDots();
        goTo(Math.min(currentIndex, getMaxIndex()));
      });

      buildDots();
      startAutoSlide();
    }
  }

  /* ============================================================
     2. RECENT ORDERS SLIDER
     ============================================================ */
  const recentOrdersTrack = document.getElementById("recentOrdersTrack");
  const recentOrdersPrevBtn = document.getElementById("recentOrdersPrev");
  const recentOrdersNextBtn = document.getElementById("recentOrdersNext");
  const recentOrdersDotsContainer = document.getElementById("recentOrdersDots");

  if (recentOrdersTrack) {
    const cards = recentOrdersTrack.querySelectorAll(".food-card");

    // Only initialize if there are cards
    if (cards.length > 0) {
      const cardWidth =
        cards[0].offsetWidth +
        parseInt(getComputedStyle(cards[0]).marginRight || 0);
      let currentIndex = 0;
      let autoSlideTimer = null;
      let isDragging = false;
      let startX = 0;

      const getVisibleCount = () =>
        Math.floor(recentOrdersTrack.parentElement.offsetWidth / cardWidth) ||
        1;
      const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

      const buildDots = () => {
        if (!recentOrdersDotsContainer) return;
        recentOrdersDotsContainer.innerHTML = "";
        for (let i = 0; i <= getMaxIndex(); i++) {
          const dot = document.createElement("button");
          dot.className = "dot" + (i === currentIndex ? " active" : "");
          dot.setAttribute("aria-label", `Slide ${i + 1}`);
          dot.addEventListener("click", () => goTo(i));
          recentOrdersDotsContainer.appendChild(dot);
        }
      };

      const updateDots = () => {
        if (!recentOrdersDotsContainer) return;
        recentOrdersDotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
          dot.classList.toggle("active", i === currentIndex);
        });
      };

      const DESIGN_GAP = 16;

      const goTo = (index) => {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const containerWidth = recentOrdersTrack.parentElement.offsetWidth;
        const totalWidth = recentOrdersTrack.scrollWidth;
        const maxTranslate = totalWidth - containerWidth + DESIGN_GAP;
        const step = maxTranslate / maxIndex || 0;
        let translateX = step * currentIndex;

        translateX = Math.min(translateX, maxTranslate);
        recentOrdersTrack.style.transform = `translateX(-${translateX}px)`;
        updateDots();
      };

      recentOrdersPrevBtn?.addEventListener("click", () => {
        resetAutoSlide();
        goTo(currentIndex - 1);
      });

      recentOrdersNextBtn?.addEventListener("click", () => {
        resetAutoSlide();
        goTo(currentIndex + 1);
      });

      const startAutoSlide = () => {
        autoSlideTimer = setInterval(() => {
          goTo(currentIndex < getMaxIndex() ? currentIndex + 1 : 0);
        }, 4000);
      };

      const resetAutoSlide = () => {
        clearInterval(autoSlideTimer);
        startAutoSlide();
      };

      const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

      recentOrdersTrack.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = getClientX(e);
        recentOrdersTrack.style.transition = "none";
      });

      recentOrdersTrack.addEventListener(
        "touchstart",
        (e) => {
          startX = getClientX(e);
          recentOrdersTrack.style.transition = "none";
        },
        { passive: true },
      );

      const onDragEnd = (e) => {
        if (!isDragging && e.type === "mouseup") return;
        isDragging = false;
        const diff = startX - getClientX(e);
        recentOrdersTrack.style.transition =
          "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        if (Math.abs(diff) > 60) {
          resetAutoSlide();
          diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        } else {
          goTo(currentIndex);
        }
      };

      recentOrdersTrack.addEventListener("mouseup", onDragEnd);
      recentOrdersTrack.addEventListener("touchend", onDragEnd);
      recentOrdersTrack.addEventListener("mouseleave", (e) => {
        if (isDragging) onDragEnd(e);
      });
      recentOrdersTrack.addEventListener("click", (e) => {
        if (Math.abs(startX - getClientX(e)) > 5) e.preventDefault();
      });

      window.addEventListener("resize", () => {
        buildDots();
        goTo(Math.min(currentIndex, getMaxIndex()));
      });

      buildDots();
      startAutoSlide();
    }
  }

  /* ============================================================
     2. PROMO CAROUSEL LOGIC
     ============================================================ */
  const slides = document.querySelectorAll(".promo-slide");
  const dotsEl = document.getElementById("promoDots");

  if (slides.length > 0 && dotsEl) {
    let cur = 0,
      timer;

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "promo-dot" + (i === 0 ? " active" : "");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.onclick = () => go(i);
      dotsEl.appendChild(b);
    });

    function go(n) {
      slides[cur].classList.remove("active");
      dotsEl.children[cur].classList.remove("active");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("active");
      dotsEl.children[cur].classList.add("active");
    }

    const promoPrev = document.getElementById("promoPrev");
    const promoNext = document.getElementById("promoNext");

    if (promoPrev) {
      promoPrev.onclick = () => {
        clearInterval(timer);
        go(cur - 1);
        start();
      };
    }

    if (promoNext) {
      promoNext.onclick = () => {
        clearInterval(timer);
        go(cur + 1);
        start();
      };
    }

    function start() {
      timer = setInterval(() => go(cur + 1), 4500);
    }

    start();
  }

  /* ============================================================
     3. TOAST HELPER
     ============================================================ */
  function showToast(type, icon, msg) {
    const toastContainer = document.getElementById("toast-container");

    // Safety check in case the container isn't in the HTML yet
    if (!toastContainer) {
      console.warn(
        "Toast ignored: <div id='toast-container'></div> is missing from HTML.",
      );
      return;
    }

    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
    toastContainer.appendChild(el);

    setTimeout(() => {
      el.classList.add("fade-out");
      setTimeout(() => el.remove(), 320);
    }, 3000);
  }

  /* ============================================================
     4. ADD TO CART LOGIC
     ============================================================ */
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const itemName = this.getAttribute("data-item");
      const isRecentOrder = this.closest(".recent-orders-section") !== null;

      // Visual button feedback
      const originalIcon = '<i class="fa-solid fa-cart-shopping"></i>';
      const originalText = isRecentOrder ? "Add to Cart Again" : "Add to Cart";
      const originalHTML = `${originalIcon} ${originalText}`;

      this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      this.style.background = "#16a34a";
      this.style.boxShadow = "0 4px 14px rgba(22, 163, 74, 0.35)";

      // Show success toast
      const toastMsg = isRecentOrder
        ? `"${itemName}" added to cart again!`
        : `"${itemName}" added to cart!`;

      showToast("success", "fa-cart-plus", toastMsg);

      // Reset button after delay
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = "";
        this.style.boxShadow = "";
      }, 2000);
    });
  });
  /* ============================================================
     5. VIEW DETAILS LOGIC
     ============================================================ */
  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const orderId = this.getAttribute("data-order");
      // Redirect to order details page
      window.location.href = `student-order.html?order=${orderId}`;
    });
  });

  /* ============================================================
     6. RATE & REVIEW LOGIC
     ============================================================ */
  document.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const itemName = this.getAttribute("data-item");
      // Redirect to feedback page with item
      window.location.href = `student-feedback.html?item=${encodeURIComponent(itemName)}`;
    });
  });

  /* ============================================================
     7. FOOD MODAL LOGIC
     ============================================================ */
  const foodModal = document.getElementById("foodModal");
  const modalImg = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalPrice = document.getElementById("modalPrice");
  const modalVendor = document.getElementById("modalVendor");
  const modalPrep = document.getElementById("modalPrep");
  const modalRating = document.getElementById("modalRating");
  const modalDesc = document.getElementById("modalDesc");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalReviews = document.getElementById("modalReviews");
  const modalAddBtn = document.getElementById("modalAddBtn");
  const modalClose = document.getElementById("modalClose");

  // Make food cards clickable
  document.querySelectorAll(".food-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't open modal if clicking on add-to-cart button
      if (e.target.closest(".add-to-cart-btn")) return;

      // Get card data
      const img = this.querySelector("img").src;
      const name = this.querySelector("h4").textContent;
      const price = this.querySelector(".food-price").textContent;
      const vendor = this.querySelector(".food-vendor").textContent;
      const desc = this.querySelector("p").textContent;
      const badge = this.querySelector(".food-badge")?.textContent || "";
      const rating = this.querySelector(".food-rating")?.textContent || "★ 4.5";

      // Populate modal
      modalImg.src = img;
      modalImg.alt = name;
      modalName.textContent = name;
      modalPrice.textContent = price;
      modalVendor.textContent = vendor;
      modalRating.textContent = rating;
      modalDesc.textContent = desc.replace(" • Ready in", "\n\nReady in");

      // Mock ingredients and reviews
      modalIngredients.innerHTML = `
        <span class="ingredient-tag">Fresh Ingredients</span>
        <span class="ingredient-tag">Quality Assured</span>
        <span class="ingredient-tag">Locally Sourced</span>
      `;

      modalReviews.innerHTML = `
        <div class="review-item">
          <div class="review-avatar">V</div>
          <div>
            <div class="review-name">Vaughn Evangelista</div>
            <div class="review-stars">★★★★★</div>
            <div class="review-comment">Amazing food! Highly recommend this dish.</div>
          </div>
        </div>
        <div class="review-item">
          <div class="review-avatar">J</div>
          <div>
            <div class="review-name">John Doe</div>
            <div class="review-stars">★★★★☆</div>
            <div class="review-comment">Good quality and fast service.</div>
          </div>
        </div>
      `;

      // Set prep time based on description
      if (desc.includes("5-10 min")) {
        modalPrep.textContent = "⏱️ 5-10 min prep";
      } else if (desc.includes("2-3 min")) {
        modalPrep.textContent = "⏱️ 2-3 min prep";
      } else if (desc.includes("8-12 min")) {
        modalPrep.textContent = "⏱️ 8-12 min prep";
      } else {
        modalPrep.textContent = "⏱️ 3-5 min prep";
      }

      // Open modal
      foodModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  modalClose.addEventListener("click", () => {
    foodModal.classList.remove("open");
    document.body.style.overflow = "";
  });

  foodModal.addEventListener("click", (e) => {
    if (e.target === foodModal) {
      foodModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  // Modal add to cart
  modalAddBtn.addEventListener("click", () => {
    showToast(
      "success",
      "fa-cart-plus",
      `"${modalName.textContent}" added to cart!`,
    );
    foodModal.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ==========================================
   WM EAT SU — index.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================
       1. NAVBAR — Scroll Shadow
    ==============================*/
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  /* ============================
       2. MOBILE MENU TOGGLE
    ==============================*/
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const icon = mobileMenuBtn.querySelector("i");
      icon.className = mobileNav.classList.contains("open")
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
      });
    });
  }

  /* ============================
       3. SCROLL ANIMATIONS
    ==============================*/
  const animatedEls = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  animatedEls.forEach((el) => observer.observe(el));

  /* ============================
       4. FOOD SLIDER
    ==============================*/
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const dotsContainer = document.getElementById("sliderDots");

  if (track) {
    const cards = track.querySelectorAll(".food-card");
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

      // prevent overshooting too much
      translateX = Math.min(translateX, maxTranslate);

      track.style.transform = `translateX(-${translateX}px)`;

      updateDots();
    };

    prevBtn &&
      prevBtn.addEventListener("click", () => {
        resetAutoSlide();
        goTo(currentIndex - 1);
      });
    nextBtn &&
      nextBtn.addEventListener("click", () => {
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

  /* ============================
       5. SLIDER — Add to Cart
          Redirect to Sign In
    ==============================*/
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Brief visual feedback, then redirect
      const original = this.innerHTML;
      this.innerHTML = '<i class="fa-solid fa-check"></i> Signing in...';
      this.style.background = "#16a34a";
      this.style.boxShadow = "0 4px 14px rgba(22, 163, 74, 0.35)";
      setTimeout(() => {
        window.location.href = "pages/auth/signin.html";
      }, 600);
    });
  });

  /* ============================
       6. CATEGORY FOOD DATA
    ==============================*/
  const categoryData = {
    meals: [
      {
        img: "images/spciy.jpg",
        name: "Spicy Chicken Rice",
        desc: "Garlic fried rice with tender chicken",
        price: "₱55",
        vendor: "Canteen A",
        rating: "4.9",
      },
      {
        img: "images/silog.avif",
        name: "Tapsilog with Egg",
        desc: "Marinated beef tapa & garlic rice",
        price: "₱70",
        vendor: "Silog Station",
        rating: "4.5",
      },
      {
        img: "images/pancit.avif",
        name: "Pancit Canton Guisado",
        desc: "Stir-fried noodles with pork & veggies",
        price: "₱45",
        vendor: "Canteen B",
        rating: "4.7",
      },
      {
        img: "images/pizza.avif",
        name: "Hawaiian Mini Pizza",
        desc: "Ham, pineapple and mozzarella",
        price: "₱65",
        vendor: "Pizza Hub",
        rating: "4.6",
      },
    ],
    drinks: [
      {
        img: "images/mangoshake.jpg",
        name: "Mango Graham Shake",
        desc: "Creamy blended mango with graham",
        price: "₱35",
        vendor: "Drinks Corner",
        rating: "4.8",
      },
      {
        img: "images/milktea.avif",
        name: "Brown Sugar Milk Tea",
        desc: "Classic milk tea with tapioca pearls",
        price: "₱40",
        vendor: "Sip & Go",
        rating: "4.9",
      },
      {
        img: "images/calamnsi-juice.avif",
        name: "Fresh Calamansi Juice",
        desc: "Freshly squeezed, sweetened to taste",
        price: "₱25",
        vendor: "Drinks Corner",
        rating: "4.7",
      },
      {
        img: "images/strawberry.avif",
        name: "Strawberry Smoothie",
        desc: "Blended strawberries with milk & honey",
        price: "₱45",
        vendor: "Sip & Go",
        rating: "4.6",
      },
    ],
    snacks: [
      {
        img: "images/hotdog.avif",
        name: "Cheesy Hotdog Skewer",
        desc: "Grilled hotdog with cheese dip",
        price: "₱20",
        vendor: "Snack Corner",
        rating: "4.7",
      },
      {
        img: "images/Fries.jpg",
        name: "Loaded Cheese Fries",
        desc: "Crispy fries topped with nacho cheese",
        price: "₱30",
        vendor: "Canteen A",
        rating: "4.8",
      },
      {
        img: "images/kwek.jpg",
        name: "Kwek-Kwek (6pcs)",
        desc: "Deep-fried quail eggs in orange batter",
        price: "₱25",
        vendor: "Street Bites",
        rating: "4.5",
      },
      {
        img: "images/chips.avif",
        name: "Chili Garlic Chips",
        desc: "Thinly sliced potato chips, spicy & garlicky",
        price: "₱18",
        vendor: "Snack Corner",
        rating: "4.4",
      },
    ],
    desserts: [
      {
        img: "images/halo.avif",
        name: "Halo-Halo Special",
        desc: "Mixed sweets with ube ice cream",
        price: "₱55",
        vendor: "Sweet Spot",
        rating: "4.9",
      },
      {
        img: "images/leche.avif",
        name: "Leche Flan",
        desc: "Classic caramel custard dessert",
        price: "₱35",
        vendor: "Sweet Spot",
        rating: "4.8",
      },
      {
        img: "images/gulaman.avif",
        name: "Buko Pandan Salad",
        desc: "Young coconut strips with pandan gelatin",
        price: "₱40",
        vendor: "Canteen B",
        rating: "4.7",
      },
      {
        img: "images/bibingka.jpg",
        name: "Bibingka Slice",
        desc: "Soft rice cake with salted egg & cheese",
        price: "₱30",
        vendor: "Sweet Spot",
        rating: "4.6",
      },
    ],
  };

  /* ============================
       7. CATEGORY GRID RENDERER
    ==============================*/
  const catFoodGrid = document.getElementById("catFoodGrid");
  const categoryCards = document.querySelectorAll(".category-card");
  let activeCategory = "meals";
  let isTransitioning = false;

  /**
   * Build HTML for exactly 4 items (2×2 grid).
   * Always uses the first 4 items from the category array.
   */
  const buildGridHTML = (cat) => {
    const items = (categoryData[cat] || []).slice(0, 4);
    return items
      .map(
        (item) => `
            <div class="cat-card">
                <img
                    class="cat-card-img"
                    src="${item.img}"
                    onerror="this.src='${item.fallback}'"
                    alt="${item.name}"
                    loading="lazy"
                >
                <div class="cat-card-info">
                    <span class="cat-card-vendor">
                        <i class="fa-solid fa-store"></i> ${item.vendor}
                        <span class="cat-card-rating">★ ${item.rating}</span>
                    </span>
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                    <div class="cat-card-footer">
                        <span class="cat-card-price">${item.price}</span>
                    
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  };

  /** Bind add-to-cart on all .cat-add-btn inside the grid */
  const bindCartButtons = () => {
    catFoodGrid.querySelectorAll(".cat-add-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.clicked) return; // prevent double-fire
        btn.dataset.clicked = "1";
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.background = "#16a34a";
        btn.style.boxShadow = "0 4px 12px rgba(22,163,74,0.35)";
        setTimeout(() => {
          window.location.href = "pages/auth/signin.html";
        }, 600);
      });
    });
  };

  /**
   * Switch to a new category:
   *  1. Fade grid out
   *  2. Swap innerHTML
   *  3. Fade grid back in
   *  4. Update active tab
   */
  const switchCategory = (newCat) => {
    if (newCat === activeCategory || isTransitioning) return;
    isTransitioning = true;
    activeCategory = newCat;

    // Update active tab immediately — instant visual feedback
    categoryCards.forEach((c) => c.classList.remove("active"));
    document
      .querySelector(`.category-card[data-cat="${newCat}"]`)
      .classList.add("active");

    // Fade out
    catFoodGrid.classList.add("fading");

    setTimeout(() => {
      // Swap content while invisible
      catFoodGrid.innerHTML = buildGridHTML(newCat);
      bindCartButtons();

      // Fade back in
      catFoodGrid.classList.remove("fading");
      isTransitioning = false;
    }, 250); // matches CSS transition duration
  };

  /* ============================
       8. CATEGORY TAB CLICK
    ==============================*/
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      switchCategory(card.dataset.cat);
    });
  });

  /* ============================
       9. INITIAL RENDER
    ==============================*/
  catFoodGrid.innerHTML = buildGridHTML("meals");
  bindCartButtons();

  /* ============================
       11. SMOOTH SCROLL
    ==============================*/
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    });
  });
});

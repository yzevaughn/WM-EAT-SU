document.addEventListener("DOMContentLoaded", () => {
  // Mock Data
  const approvalItems = [
    {
      id: "APP-M-01",
      type: "menu",
      vendor: "The Sweet Spot",
      title: "Strawberry Cake",
      desc: "A fresh strawberry cake slice served with cream. Light, sweet, and perfect for any occasion.",
      img: "../../images/strawberry.avif",
      price: "₱120.00",
      tags: [
        { text: "Dessert", class: "tag-green" },
        { text: "Bestseller", class: "tag-pink" },
      ],
      submitter: "Maria Santos",
      time: "Apr 27, 2026 • 9:14 AM",
      status: "pending",
      ingredients: ["Fresh Strawberries", "Whipped Cream", "Sponge Cake", "Sugar", "Vanilla"],
      bgColor: "#fca5a5",
    },
    {
      id: "APP-M-02",
      type: "menu",
      vendor: "Burger Joint",
      title: "Double Cheese Burger",
      desc: "Double patty burger with extra cheddar cheese.",
      img: "../../images/burger.avif",
      price: "₱150.00",
      tags: [
        { text: "Main", class: "tag-green" },
        { text: "Beef", class: "tag-pink" },
      ],
      submitter: "Juan Dela Cruz",
      time: "Apr 26, 2026 • 2:30 PM",
      status: "pending",
      ingredients: ["Beef Patty", "Cheddar Cheese", "Burger Bun", "Lettuce", "Tomato", "Special Sauce"],
      bgColor: "#93c5fd",
    },
    {
      id: "APP-P-01",
      type: "poster",
      vendor: "Campus Grill",
      title: "Back to School Promo",
      desc: "10% off all grilled items starting next week.",
      img: "../../images/banner4.avif",
      price: "N/A",
      tags: [{ text: "Promo", class: "tag-green" }],
      submitter: "Campus Grill Admin",
      time: "Apr 26, 2026 • 10:00 AM",
      status: "pending",
      bgColor: "#c4b5fd",
    },
    {
      id: "APP-M-04",
      type: "menu",
      vendor: "Healthy Bites",
      title: "Caesar Salad",
      desc: "Fresh romaine lettuce, croutons, parmesan cheese, and Caesar dressing.",
      img: "../../images/pancit.avif",
      price: "₱85.00",
      tags: [{ text: "Healthy", class: "tag-green" }],
      submitter: "Ana Smith",
      time: "Apr 25, 2026 • 4:15 PM",
      status: "pending",
      ingredients: ["Romaine Lettuce", "Croutons", "Parmesan Cheese", "Caesar Dressing", "Chicken Breast"],
      bgColor: "#a7f3d0",
    },
    {
      id: "APP-P-02",
      type: "poster",
      vendor: "Pizza Corner",
      title: "New Pizza Flavors",
      desc: "Check out our premium pepperoni and supreme flavors.",
      img: "../../images/pizza.avif",
      price: "N/A",
      tags: [{ text: "New", class: "tag-pink" }],
      submitter: "Pizza Corner Mgr",
      time: "Apr 24, 2026 • 8:45 AM",
      status: "pending",
      bgColor: "#fde047",
    },
    // Approved items (All Food tab)
    {
      id: "FOOD-01",
      type: "menu",
      vendor: "The Sweet Spot",
      title: "Chocolate Muffin",
      desc: "Rich chocolate muffin with chocolate chips.",
      img: "../../images/strawberry.avif",
      price: "₱45.00",
      tags: [{ text: "Dessert", class: "tag-green" }],
      submitter: "Maria Santos",
      time: "Apr 20, 2026 • 1:00 PM",
      status: "approved",
      bgColor: "#fca5a5",
    },
    {
      id: "FOOD-02",
      type: "menu",
      vendor: "Burger Joint",
      title: "Classic Cheeseburger",
      desc: "Our signature beef patty with cheddar.",
      img: "../../images/burger.avif",
      price: "₱95.00",
      tags: [{ text: "Main", class: "tag-green" }],
      submitter: "Juan Dela Cruz",
      time: "Apr 20, 2026 • 2:00 PM",
      status: "approved",
      bgColor: "#93c5fd",
    },
    {
      id: "FOOD-03",
      type: "menu",
      vendor: "Campus Grill",
      title: "Grilled Chicken",
      desc: "Served with java rice and gravy.",
      img: "../../images/pizza.avif",
      price: "₱110.00",
      tags: [{ text: "Meal", class: "tag-green" }],
      submitter: "Campus Grill Admin",
      time: "Apr 19, 2026 • 11:30 AM",
      status: "approved",
      bgColor: "#c4b5fd",
    },
    {
      id: "FOOD-04",
      type: "menu",
      vendor: "Healthy Bites",
      title: "Fruit Platter",
      desc: "Assorted seasonal fresh fruits.",
      img: "../../images/pancit.avif",
      price: "₱60.00",
      tags: [{ text: "Healthy", class: "tag-green" }],
      submitter: "Ana Smith",
      time: "Apr 18, 2026 • 9:00 AM",
      status: "approved",
      bgColor: "#a7f3d0",
    },
  ];

  let currentTab = "menus-pending"; // menus-pending, posters-pending, approved

  // Selectors
  const approvalTabs = document.getElementById("approvalTabs");
  const approvalList = document.getElementById("approvalList");
  const emptyState = document.getElementById("emptyState");

  // Header count selectors
  const counts = {
    menus: document.getElementById("count-menus"),
    posters: document.getElementById("count-posters"),
    allFood: document.getElementById("count-all-food"),
  };

  function updateStats() {
    let menusCount = 0,
      postersCount = 0,
      allFoodCount = 0;

    approvalItems.forEach((item) => {
      if (item.status === "pending" && item.type === "menu") menusCount++;
      if (item.status === "pending" && item.type === "poster") postersCount++;
      if (item.status === "approved" && item.type === "menu") allFoodCount++;
    });

    if (counts.menus) counts.menus.textContent = menusCount;
    if (counts.posters) counts.posters.textContent = postersCount;
    if (counts.allFood) counts.allFood.textContent = allFoodCount;
  }

  function renderList() {
    let filtered = [];

    if (currentTab === "menus-pending") {
      filtered = approvalItems.filter(
        (i) => i.status === "pending" && i.type === "menu",
      );
    } else if (currentTab === "posters-pending") {
      filtered = approvalItems.filter(
        (i) => i.status === "pending" && i.type === "poster",
      );
    } else if (currentTab === "all-food") {
      filtered = approvalItems.filter(
        (i) => i.status === "approved" && i.type === "menu",
      );
    }

    approvalList.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = "approval-card";

      const typeLabel = item.type === "menu" ? "Menu item" : "Promo poster";
      const statusLabel =
        item.status === "pending" ? "Pending review" : "Active";
      const tagsHtml = item.tags
        ? item.tags
            .map((t) => `<span class="ac-tag ${t.class}">${t.text}</span>`)
            .join("")
        : "";

      let footerHtml = "";
      if (item.status === "pending") {
        footerHtml = `
                    <div class="ac-footer">
                        <button class="btn-appr btn-green" data-id="${item.id}" data-action="approve"><i class="fa-solid fa-check"></i> Approve</button>
                        <button class="btn-appr btn-pink" data-id="${item.id}" data-action="decline"><i class="fa-solid fa-xmark"></i> Decline</button>
                        <button class="btn-appr btn-dark btn-icon-only" data-id="${item.id}" data-action="details" title="View Details"><i class="fa-solid fa-eye"></i></button>
                    </div>
                `;
      } else if (item.status === "approved") {
        footerHtml = `
                    <div class="ac-footer">
                        <button class="btn-appr btn-pink" style="flex: 1;" data-id="${item.id}" data-action="remove"><i class="fa-solid fa-trash-can"></i> Remove from Menu</button>
                    </div>
                `;
      }

      // Determine background for top section (use image if available, else fallback color)
      const topBg = item.img
        ? `url('${item.img}') center/cover no-repeat`
        : item.bgColor;

      card.innerHTML = `
                <div class="ac-top" style="background: ${topBg};">
                    <div class="ac-top-overlay"></div>
                    <div class="ac-top-header">
                        <div class="ac-vendor-pill"><div class="ac-vendor-icon"><i class="fa-solid fa-store"></i></div> ${item.vendor}</div>
                        <div class="ac-type-pill">${typeLabel}</div>
                    </div>
                    ${!item.img ? `<div class="ac-avatar"><i class="fa-solid fa-image"></i></div>` : ""}
                    <div class="ac-top-footer">
                        <div class="ac-status-pill">${statusLabel}</div>
                    </div>
                </div>
                <div class="ac-bottom">
                    <div class="ac-bottom-header">
                        <h3 class="ac-title">${item.title}</h3>
                        <span class="ac-price">${item.price}</span>
                    </div>
                    <p class="ac-desc">${item.desc}</p>
                    <div class="ac-tags">
                        ${tagsHtml}
                    </div>
                    <hr class="ac-divider" />
                    <div class="ac-meta">
                        <div class="ac-meta-row">
                            <span class="ac-meta-label">Submitted by</span>
                            <span class="ac-meta-value">${item.submitter}</span>
                        </div>
                        <div class="ac-meta-row">
                            <span class="ac-meta-label">Submitted</span>
                            <span class="ac-meta-value">${item.time}</span>
                        </div>
                    </div>
                    ${footerHtml}
                </div>
            `;
      approvalList.appendChild(card);
    });

    // reattach listeners
    document.querySelectorAll(".btn-appr").forEach((btn) => {
      if (btn.disabled) return;

      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const action = this.getAttribute("data-action");
        const targetItem = approvalItems.find((i) => i.id === id);

        if (targetItem) {
          if (action === "approve") {
            showConfirmModal({
              title: "Approve Item",
              message: `Approve this ${targetItem.type}?`,
              icon: "fa-solid fa-circle-check",
              iconColor: "#10b981",
              onConfirm: () => {
                targetItem.status = "approved";
                updateStats();
                renderList();
              },
            });
          } else if (action === "decline") {
            showConfirmModal({
              title: "Decline Item",
              message: `Decline and reject this ${targetItem.type}?`,
              requireInput: true,
              inputLabel: "Reason for Decline",
              onConfirm: () => {
                targetItem.status = "declined";
                updateStats();
                renderList();
              },
            });
          } else if (action === "remove") {
            showConfirmModal({
              title: "Remove Item",
              message: `Are you sure you want to remove ${targetItem.title} from the active menu?`,
              onConfirm: () => {
                targetItem.status = "removed";
                updateStats();
                renderList();
              },
            });
          } else if (action === "details") {
            openDetailsModal(targetItem);
          }
        }
      });
    });
  }

  window.openDetailsModal = function (item) {
    document.getElementById("detDate").textContent = item.time;
    document.getElementById("detVendor").textContent = item.vendor;
    document.getElementById("detTitle").textContent = item.title;
    document.getElementById("detPrice").textContent = item.price;
    document.getElementById("detDesc").textContent = item.desc;
    document.getElementById("detIngredients").textContent = item.ingredients ? item.ingredients.join(", ") : "No ingredients listed.";

    const tagsContainer = document.getElementById("detTags");
    tagsContainer.innerHTML = item.tags
      ? item.tags
          .map((t) => `<span class="ac-tag ${t.class}">${t.text}</span>`)
          .join("")
      : "";

    // Step images are static placeholders as requested

    let statusHtml = "";
    if (item.status === "pending")
      statusHtml = '<span class="status-pill status-pending">Pending</span>';
    else if (item.status === "approved")
      statusHtml = '<span class="status-pill status-active">Active</span>';
    document.getElementById("detStatusHtml").innerHTML = statusHtml;

    const footer = document.getElementById("detailsFooter");
    if (item.status === "pending") {
      footer.innerHTML = `
                <button class="btn-appr btn-dark" style="flex: 0 0 100px;" onclick="closeModal()">Close</button>
                <button class="btn-appr btn-green" style="flex: 0 0 140px;" onclick="quickApprove('${item.id}')"><i class="fa-solid fa-check"></i> Approve Item</button>
            `;
    } else {
      footer.innerHTML = `<button class="btn-appr btn-dark" style="flex: 0 0 100px;" onclick="closeModal()">Close</button>`;
    }

    document.getElementById("detailsModal").classList.add("active");
  };

  window.closeModal = function () {
    document.getElementById("detailsModal").classList.remove("active");
  };

  if (approvalTabs) {
    approvalTabs.addEventListener("click", function (e) {
      const tab = e.target.closest(".tab");
      if (!tab) return;

      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      currentTab = tab.getAttribute("data-tab");
      renderList();
    });
  }

  // Init
  updateStats();
  renderList();

  // Custom Confirmation Modal Logic
  let confirmCallback = null;

  function showConfirmModal(options) {
    const modal = document.getElementById("confirmModal");
    const icon = document.getElementById("confirmIcon");
    const title = document.getElementById("confirmTitle");
    const msg = document.getElementById("confirmMessage");
    const inputContainer = document.getElementById("confirmInputContainer");
    const inputLabel = document.getElementById("confirmInputLabel");
    const inputEl = document.getElementById("confirmInput");
    const submitBtn = document.getElementById("submitConfirmBtn");

    title.innerText = options.title || "Confirm Action";
    msg.innerText = options.message || "Are you sure you want to do this?";
    icon.innerHTML = `<i class="${options.icon || "fa-solid fa-circle-exclamation"}"></i>`;
    icon.style.color = options.iconColor || "#ef4444";

    if (options.requireInput) {
      inputContainer.style.display = "block";
      inputLabel.innerText = options.inputLabel || "Reason";
      inputEl.value = "";
    } else {
      inputContainer.style.display = "none";
    }

    submitBtn.style.background =
      options.confirmColor || "linear-gradient(135deg, #10b981, #059669)";
    submitBtn.innerText = options.confirmText || "Confirm";

    confirmCallback = options.onConfirm;
    modal.classList.add("active");
  }

  document
    .getElementById("cancelConfirmBtn")
    .addEventListener("click", function () {
      document.getElementById("confirmModal").classList.remove("active");
      confirmCallback = null;
    });

  document
    .getElementById("submitConfirmBtn")
    .addEventListener("click", function () {
      const inputEl = document.getElementById("confirmInput");
      const inputValue = inputEl.value;

      if (confirmCallback) confirmCallback(inputValue);
      document.getElementById("confirmModal").classList.remove("active");
      confirmCallback = null;
    });

  window.quickApprove = function (id) {
    const item = approvalItems.find((i) => i.id === id);
    if (item) {
      showConfirmModal({
        title: "Approve Item",
        message: `Are you sure you want to approve ${item.title}?`,
        icon: "fa-solid fa-circle-check",
        iconColor: "#10b981",
        onConfirm: () => {
          item.status = "approved";
          closeModal();
          updateStats();
          renderList();
        },
      });
    }
  };
});

// --- MOCK DATA ---
const leaderboardData = {
  all: {
    all: [
      {
        rank: 1,
        name: "Canteen 1 (Main)",
        sub: "Admin Hub",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 4250,
        revenue: "₱412,500.00",
        img: "../../images/burger.avif",
      },
      {
        rank: 2,
        name: "Juan Dela Cruz",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 1850,
        revenue: "₱210,450.00",
        img: null,
      },
      {
        rank: 3,
        name: "College of Law Canteen",
        sub: "Law Building",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 3142,
        revenue: "₱298,850.00",
        img: "../../images/pancit.avif",
      },
      {
        rank: 4,
        name: "Maria Santos",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 1240,
        revenue: "₱185,200.00",
        img: null,
      },
      {
        rank: 5,
        name: "Gymnasium Canteen",
        sub: "Sports Complex",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 2890,
        revenue: "₱192,200.00",
        img: "../../images/shake.avif",
      },
      {
        rank: 6,
        name: "Science Lab Canteen",
        sub: "Science Wing",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 1240,
        revenue: "₱110,500.00",
        img: "../../images/burger.avif",
      },
      {
        rank: 7,
        name: "Antonio Luna",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 842,
        revenue: "₱89,550.00",
        img: null,
      },
      {
        rank: 8,
        name: "Engineering Canteen",
        sub: "Engr. Dept",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 950,
        revenue: "₱85,400.00",
        img: "../../images/pancit.avif",
      },
    ],
    today: [
      {
        rank: 1,
        name: "Juan Dela Cruz",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 45,
        revenue: "₱4,850.00",
        img: null,
      },
      {
        rank: 2,
        name: "Canteen 1 (Main)",
        sub: "Admin Hub",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 38,
        revenue: "₱3,200.00",
        img: "../../images/burger.avif",
      },
      {
        rank: 3,
        name: "Maria Santos",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 22,
        revenue: "₱2,150.00",
        img: null,
      },
    ],
    week: [
      {
        rank: 1,
        name: "Canteen 1 (Main)",
        sub: "Admin Hub",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 310,
        revenue: "₱28,450.00",
        img: "../../images/burger.avif",
      },
      {
        rank: 2,
        name: "Juan Dela Cruz",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 215,
        revenue: "₱22,100.00",
        img: null,
      },
      {
        rank: 3,
        name: "Maria Santos",
        sub: "",
        type: "Student",
        typeClass: "badge-warning",
        orders: 180,
        revenue: "₱18,550.00",
        img: null,
      },
      {
        rank: 4,
        name: "College of Law Canteen",
        sub: "Law Building",
        type: "Canteen",
        typeClass: "badge-blue",
        orders: 155,
        revenue: "₱14,200.00",
        img: "../../images/pancit.avif",
      },
    ],
  },
  student: {
    all: [
      {
        rank: 1,
        name: "Juan Dela Cruz",
        sub: "Sisig Express",
        orders: 1850,
        revenue: "₱210,450.00",
        img: null,
      },
      {
        rank: 2,
        name: "Maria Santos",
        sub: "Brew Haven",
        orders: 1240,
        revenue: "₱185,200.00",
        img: null,
      },
      {
        rank: 3,
        name: "Antonio Luna",
        sub: "Healthy Bites",
        orders: 842,
        revenue: "₱89,550.00",
        img: null,
      },
      {
        rank: 4,
        name: "Elena Garcia",
        sub: "Sweet Treats",
        orders: 650,
        revenue: "₱62,300.00",
        img: null,
      },
      {
        rank: 5,
        name: "Pedro Penduko",
        sub: "Fruit Splash",
        orders: 420,
        revenue: "₱38,150.00",
        img: null,
      },
      {
        rank: 6,
        name: "Gabriela Silang",
        sub: "Pasta House",
        orders: 380,
        revenue: "₱32,400.00",
        img: null,
      },
      {
        rank: 7,
        name: "Jose Rizal",
        sub: "Book & Coffee",
        orders: 290,
        revenue: "₱24,800.00",
        img: null,
      },
    ],
    today: [
      {
        rank: 1,
        name: "Juan Dela Cruz",
        sub: "Sisig Express",
        orders: 45,
        revenue: "₱4,850.00",
        img: null,
      },
      {
        rank: 2,
        name: "Maria Santos",
        sub: "Brew Haven",
        orders: 22,
        revenue: "₱2,150.00",
        img: null,
      },
      {
        rank: 3,
        name: "Elena Garcia",
        sub: "Sweet Treats",
        orders: 15,
        revenue: "₱1,450.00",
        img: null,
      },
    ],
  },
  canteen: {
    all: [
      {
        rank: 1,
        name: "Canteen 1 (Main)",
        sub: "Admin Hub",
        location: "Main Campus",
        orders: 4250,
        revenue: "₱412,500.00",
        status: "Active",
        img: "../../images/burger.avif",
      },
      {
        rank: 2,
        name: "College of Law Canteen",
        sub: "Law Building",
        location: "East Campus",
        orders: 3142,
        revenue: "₱298,850.00",
        status: "Active",
        img: "../../images/pancit.avif",
      },
      {
        rank: 3,
        name: "Gymnasium Canteen",
        sub: "Sports Complex",
        location: "Main Campus",
        orders: 2890,
        revenue: "₱192,200.00",
        status: "Active",
        img: "../../images/shake.avif",
      },
      {
        rank: 4,
        name: "Science Lab Canteen",
        sub: "Science Wing",
        location: "West Campus",
        orders: 1240,
        revenue: "₱110,500.00",
        status: "Active",
        img: "../../images/burger.avif",
      },
      {
        rank: 5,
        name: "Engineering Canteen",
        sub: "Engr. Dept",
        location: "Main Campus",
        orders: 950,
        revenue: "₱85,400.00",
        status: "Active",
        img: "../../images/pancit.avif",
      },
      {
        rank: 6,
        name: "Agriculture Canteen",
        sub: "Agri Dept",
        location: "North Campus",
        orders: 720,
        revenue: "₱62,100.00",
        status: "Active",
        img: "../../images/shake.avif",
      },
      {
        rank: 7,
        name: "Nursing Canteen",
        sub: "Med Wing",
        location: "East Campus",
        orders: 640,
        revenue: "₱58,900.00",
        status: "Active",
        img: "../../images/pancit.avif",
      },
      {
        rank: 8,
        name: "HRM Canteen",
        sub: "Hotel Lab",
        location: "Main Campus",
        orders: 510,
        revenue: "₱48,500.00",
        status: "Active",
        img: "../../images/burger.avif",
      },
    ],
  },
  food: {
    all: [
      {
        rank: 1,
        name: "Special Beef Burger",
        sub: "Canteen 1",
        cat: "Fast Food",
        orders: 1240,
        sales: "₱86,800.00",
        img: "../../images/burger.avif",
      },
      {
        rank: 2,
        name: "Pancit Guisado",
        sub: "Sisig Express",
        cat: "Main Course",
        orders: 980,
        sales: "₱58,800.00",
        img: "../../images/pancit.avif",
      },
      {
        rank: 3,
        name: "Mango Graham Shake",
        sub: "Brew Haven",
        cat: "Drinks",
        orders: 850,
        sales: "₱42,500.00",
        img: "../../images/shake.avif",
      },
      {
        rank: 4,
        name: "Chicken Inasal",
        sub: "Canteen 1",
        cat: "Main Course",
        orders: 720,
        sales: "₱64,800.00",
        img: "../../images/pancit.avif",
      },
      {
        rank: 5,
        name: "Halo-Halo",
        sub: "Healthy Bites",
        cat: "Dessert",
        orders: 540,
        sales: "₱27,000.00",
        img: "../../images/shake.avif",
      },
      {
        rank: 6,
        name: "Ice Coffee",
        sub: "Brew Haven",
        cat: "Drinks",
        orders: 480,
        sales: "₱19,200.00",
        img: "../../images/shake.avif",
      },
      {
        rank: 7,
        name: "Spaghetti",
        sub: "Pasta House",
        cat: "Main Course",
        orders: 320,
        sales: "₱16,000.00",
        img: "../../images/pancit.avif",
      },
    ],
  },
};

// --- PAGINATION STATE ---
const itemsPerPage = 5;
const currentPages = { all: 1, student: 1, canteen: 1, food: 1 };

// --- RENDER FUNCTIONS ---
function renderPagination(targetId, totalItems, category) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = currentPages[category];
  const container = document.getElementById(targetId);

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  container.innerHTML = `
    <div class="pagination-info">Showing ${startItem} to ${endItem} of ${totalItems} entries</div>
    <div class="pagination-btns">
      <button class="pg-btn prev" ${currentPage === 1 ? "disabled" : ""} onclick="changePage('${category}', ${currentPage - 1})">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      ${Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(
          (page) => `
        <button class="pg-btn ${page === currentPage ? "active" : ""}" onclick="changePage('${category}', ${page})">
          ${page}
        </button>
      `,
        )
        .join("")}
      <button class="pg-btn next" ${currentPage === totalPages ? "disabled" : ""} onclick="changePage('${category}', ${currentPage + 1})">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
}

window.changePage = function (category, page) {
  currentPages[category] = page;
  if (category === "all")
    renderAllTable(document.getElementById("allTimeFilter").value);
  if (category === "student")
    renderStudentTable(
      document.getElementById("studentTimeFilter").value,
    );
  if (category === "canteen")
    renderCanteenTable(
      document.getElementById("canteenTimeFilter").value,
    );
  if (category === "food")
    renderFoodTable(document.getElementById("foodTimeFilter").value);
};

function renderAllTable(period) {
  const data = leaderboardData.all[period] || leaderboardData.all.all;
  const tbody = document.getElementById("allLeaderboardBody");
  const startIndex = (currentPages.all - 1) * itemsPerPage;
  const pagedData = data.slice(startIndex, startIndex + itemsPerPage);

  tbody.innerHTML = pagedData
    .map(
      (item) => `
    <tr>
      <td><strong>#${item.rank}</strong></td>
      <td>
        <div class="entity-cell">
          ${item.img ? `<img src="${item.img}" class="entity-img" alt="Vendor">` : ""}
          <div class="entity-info">
            <span class="entity-name">${item.name}</span>
            ${item.sub ? `<span class="entity-sub">${item.sub}</span>` : ""}
          </div>
        </div>
      </td>
      <td><span class="badge ${item.typeClass}">${item.type}</span></td>
      <td>${item.orders}</td>
      <td><strong>${item.revenue}</strong></td>
    </tr>
  `,
    )
    .join("");

  renderPagination("allPagination", data.length, "all");
}

function renderStudentTable(period) {
  const data =
    leaderboardData.student[period] || leaderboardData.student.all;
  const tbody = document.getElementById("studentLeaderboardBody");
  const startIndex = (currentPages.student - 1) * itemsPerPage;
  const pagedData = data.slice(startIndex, startIndex + itemsPerPage);

  tbody.innerHTML = pagedData
    .map(
      (item) => `
    <tr>
      <td><strong>#${item.rank}</strong></td>
      <td>
        <div class="entity-cell">
          ${item.img ? `<img src="${item.img}" class="entity-img" alt="Vendor">` : ""}
          <div class="entity-info">
            <span class="entity-name">${item.name}</span>
          </div>
        </div>
      </td>
      <td>${item.orders}</td>
      <td><strong>${item.revenue}</strong></td>
    </tr>
  `,
    )
    .join("");

  renderPagination("studentPagination", data.length, "student");
}

function renderCanteenTable(period) {
  const data =
    leaderboardData.canteen[period] || leaderboardData.canteen.all;
  const tbody = document.getElementById("canteenLeaderboardBody");
  const startIndex = (currentPages.canteen - 1) * itemsPerPage;
  const pagedData = data.slice(startIndex, startIndex + itemsPerPage);

  tbody.innerHTML = pagedData
    .map(
      (item) => `
    <tr>
      <td><strong>#${item.rank}</strong></td>
      <td>
        <div class="entity-cell">
          ${item.img ? `<img src="${item.img}" class="entity-img" alt="Canteen">` : ""}
          <div class="entity-info">
            <span class="entity-name">${item.name}</span>
            ${item.sub ? `<span class="entity-sub">${item.sub}</span>` : ""}
          </div>
        </div>
      </td>
      <td>${item.location || "N/A"}</td>
      <td>${item.orders}</td>
      <td><strong>${item.revenue}</strong></td>
      <td><span class="status-pill active">${item.status}</span></td>
    </tr>
  `,
    )
    .join("");

  renderPagination("canteenPagination", data.length, "canteen");
}

function renderFoodTable(period) {
  const data = leaderboardData.food[period] || leaderboardData.food.all;
  const tbody = document.getElementById("foodLeaderboardBody");
  const startIndex = (currentPages.food - 1) * itemsPerPage;
  const pagedData = data.slice(startIndex, startIndex + itemsPerPage);

  tbody.innerHTML = pagedData
    .map(
      (item) => `
    <tr>
      <td><strong>#${item.rank}</strong></td>
      <td>
        <div class="entity-cell">
          ${item.img ? `<img src="${item.img}" class="entity-img" alt="Food">` : ""}
          <div class="entity-info">
            <span class="entity-name">${item.name}</span>
            ${item.sub ? `<span class="entity-sub">${item.sub}</span>` : ""}
          </div>
        </div>
      </td>
      <td>${item.cat}</td>
      <td>${item.orders}</td>
      <td><strong>${item.sales}</strong></td>
    </tr>
  `,
    )
    .join("");

  renderPagination("foodPagination", data.length, "food");
}

// Tab switching logic
const tabs = [
  {
    btn: document.getElementById("allTab"),
    view: document.getElementById("allView"),
  },
  {
    btn: document.getElementById("studentVendorTab"),
    view: document.getElementById("studentVendorView"),
  },
  {
    btn: document.getElementById("canteenTab"),
    view: document.getElementById("canteenView"),
  },
  {
    btn: document.getElementById("foodTab"),
    view: document.getElementById("foodView"),
  },
];

tabs.forEach((tab) => {
  tab.btn.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.btn.classList.remove("active");
      t.view.style.display = "none";
    });
    tab.btn.classList.add("active");
    tab.view.style.display = "block";
  });
});

// Time period filter logic
document.querySelectorAll(".time-period-select").forEach((select) => {
  select.addEventListener("change", function () {
    const id = this.id;
    const period = this.value;
    const picker = this.closest(".header-filters").querySelector(".month-picker");
    
    if (period === "specific") {
      picker.style.display = "block";
    } else {
      picker.style.display = "none";
    }

    if (id === "allTimeFilter") {
      currentPages.all = 1;
      renderAllTable(period);
      updateKPIs("all", period);
    }
    if (id === "studentTimeFilter") {
      currentPages.student = 1;
      renderStudentTable(period);
      updateKPIs("student", period);
    }
    if (id === "canteenTimeFilter") {
      currentPages.canteen = 1;
      renderCanteenTable(period);
      updateKPIs("canteen", period);
    }
    if (id === "foodTimeFilter") {
      currentPages.food = 1;
      renderFoodTable(period);
    }
  });
});

// --- KPI DATA ---
const kpiData = {
  all: {
    all: { revenue: "₱3,330,200", vendors: "42" },
    today: { revenue: "₱12,450", vendors: "38" },
    week: { revenue: "₱85,200", vendors: "40" },
    month: { revenue: "₱412,500", vendors: "42" }
  },
  student: {
    all: { revenue: "₱485,200", active: "30" },
    today: { revenue: "₱4,850", active: "12" },
    week: { revenue: "₱22,100", active: "25" },
    month: { revenue: "₱85,400", active: "30" }
  },
  canteen: {
    all: { revenue: "₱2,845,000", active: "12" },
    today: { revenue: "₱3,200", active: "10" },
    week: { revenue: "₱28,450", active: "12" },
    month: { revenue: "₱192,200", active: "12" }
  }
};

function updateKPIs(category, period) {
  const data = kpiData[category][period] || kpiData[category].all;
  if (category === "all") {
    document.getElementById("allTotalRevenue").textContent = data.revenue;
    document.getElementById("allTotalVendors").textContent = data.vendors;
  } else if (category === "student") {
    document.getElementById("studentTotalRevenue").textContent = data.revenue;
    document.getElementById("studentActiveVendors").textContent = data.active;
  } else if (category === "canteen") {
    document.getElementById("canteenTotalRevenue").textContent = data.revenue;
    document.getElementById("canteenActiveCanteens").textContent = data.active;
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderAllTable("all");
    renderStudentTable("all");
    renderCanteenTable("all");
    renderFoodTable("all");
    updateKPIs("all", "all");
    updateKPIs("student", "all");
    updateKPIs("canteen", "all");
});

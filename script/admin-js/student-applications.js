// Load applications from localStorage or use mock data
let mockApplications = [];

function loadStudentApplications() {
  const stored = localStorage.getItem('student_vendor_applications');
  if (stored) {
    const data = JSON.parse(stored);
    // Check if the new mock data is already present; if not, we reset to show the 15 examples
    if (data.some(app => app.id === "APP-2601")) {
      mockApplications = data;
      return;
    }
  }
  
  // If no data or old data, populate with the 15 examples
  mockApplications = [
    // --- PENDING ---
    {
      id: "APP-2601",
      studentName: "Dela Cruz, Juan",
      studentEmail: "juan.dc@wm.edu.ph",
      category: "Meals",
      status: "Pending",
      dateSubmitted: "May 1, 2026",
      rejectionReason: "",
      products: [{ name: "Pork Sisig", price: "65", category: "Meals", ingredients: "Pork mask, ears, liver, onion, chili" }]
    },
    {
      id: "APP-2602",
      studentName: "Santos, Maria",
      studentEmail: "maria.s@wm.edu.ph",
      category: "Snacks",
      status: "Pending",
      dateSubmitted: "May 2, 2026",
      rejectionReason: "",
      products: [{ name: "Banana Cue", price: "20", category: "Snacks", ingredients: "Banana, brown sugar" }]
    },
    {
      id: "APP-2603",
      studentName: "Reyes, Pedro",
      studentEmail: "pedro.r@wm.edu.ph",
      category: "Drinks",
      status: "Pending",
      dateSubmitted: "May 3, 2026",
      rejectionReason: "",
      products: [{ name: "Gulaman", price: "15", category: "Drinks", ingredients: "Gelatin, sugar, water" }]
    },

    // --- UNDER REVIEW ---
    {
      id: "APP-2604",
      studentName: "Bautista, Ana",
      studentEmail: "ana.b@wm.edu.ph",
      category: "Healthy",
      status: "Under Review",
      dateSubmitted: "Apr 28, 2026",
      rejectionReason: "",
      products: [{ name: "Fruit Salad", price: "40", category: "Healthy", ingredients: "Various fruits, milk" }]
    },
    {
      id: "APP-2605",
      studentName: "Garcia, Jose",
      studentEmail: "jose.g@wm.edu.ph",
      category: "Meals",
      status: "Under Review",
      dateSubmitted: "Apr 29, 2026",
      rejectionReason: "",
      products: [{ name: "Chicken Adobo", price: "70", category: "Meals", ingredients: "Chicken, soy sauce, vinegar" }]
    },
    {
      id: "APP-2606",
      studentName: "Lopez, Elena",
      studentEmail: "elena.l@wm.edu.ph",
      category: "Desserts",
      status: "Under Review",
      dateSubmitted: "Apr 30, 2026",
      rejectionReason: "",
      products: [{ name: "Leche Flan", price: "50", category: "Desserts", ingredients: "Eggs, milk, sugar" }]
    },

    // --- ACTIVE VENDOR ---
    {
      id: "APP-2607",
      studentName: "Mendoza, Ricardo",
      studentEmail: "ricardo.m@wm.edu.ph",
      category: "Meals",
      status: "Active Vendor",
      dateSubmitted: "Apr 15, 2026",
      rejectionReason: "",
      products: [{ name: "Beef Pares", price: "80", category: "Meals", ingredients: "Beef, star anise, garlic" }]
    },
    {
      id: "APP-2608",
      studentName: "Evangelista, Vaughn",
      studentEmail: "vaughn.e@wm.edu.ph",
      category: "Snacks",
      status: "Active Vendor",
      dateSubmitted: "Apr 16, 2026",
      rejectionReason: "",
      products: [{ name: "Toasted Siopao", price: "25", category: "Snacks", ingredients: "Pork filling, dough" }]
    },
    {
      id: "APP-2609",
      studentName: "Aquino, Corazon",
      studentEmail: "cora.a@wm.edu.ph",
      category: "Drinks",
      status: "Active Vendor",
      dateSubmitted: "Apr 17, 2026",
      rejectionReason: "",
      products: [{ name: "Iced Tea", price: "20", category: "Drinks", ingredients: "Tea leaves, lemon, sugar" }]
    },

    // --- REJECTED ---
    {
      id: "APP-2610",
      studentName: "Villanueva, Luis",
      studentEmail: "luis.v@wm.edu.ph",
      category: "Meals",
      status: "Rejected",
      dateSubmitted: "Apr 10, 2026",
      rejectionReason: "Incomplete ingredients list provided.",
      products: [{ name: "Mystery Stew", price: "45", category: "Meals", ingredients: "Secret ingredients" }]
    },
    {
      id: "APP-2611",
      studentName: "Cruz, Sofia",
      studentEmail: "sofia.c@wm.edu.ph",
      category: "Snacks",
      status: "Rejected",
      dateSubmitted: "Apr 11, 2026",
      rejectionReason: "Product photos do not meet quality standards.",
      products: [{ name: "Oily Fries", price: "30", category: "Snacks", ingredients: "Potatoes, oil" }]
    },
    {
      id: "APP-2612",
      studentName: "Pascual, Mark",
      studentEmail: "mark.p@wm.edu.ph",
      category: "Desserts",
      status: "Rejected",
      dateSubmitted: "Apr 12, 2026",
      rejectionReason: "Business category already saturated in this area.",
      products: [{ name: "Extra Sweet Cake", price: "100", category: "Desserts", ingredients: "Sugar, flour" }]
    },

    // --- DEACTIVATED ---
    {
      id: "APP-2613",
      studentName: "Tan, Wilson",
      studentEmail: "wilson.t@wm.edu.ph",
      category: "Meals",
      status: "Deactivated",
      dateSubmitted: "Mar 20, 2026",
      deactivationReason: "Voluntary withdrawal from the program.",
      products: [{ name: "Rice Bowl", price: "55", category: "Meals", ingredients: "Rice, toppings" }]
    },
    {
      id: "APP-2614",
      studentName: "Lim, Sarah",
      studentEmail: "sarah.l@wm.edu.ph",
      category: "Drinks",
      status: "Deactivated",
      dateSubmitted: "Mar 21, 2026",
      deactivationReason: "Frequent health code violations.",
      products: [{ name: "Dirty Water", price: "10", category: "Drinks", ingredients: "Unknown" }]
    },
    {
      id: "APP-2615",
      studentName: "Sy, Henry",
      studentEmail: "henry.s@wm.edu.ph",
      category: "Snacks",
      status: "Deactivated",
      dateSubmitted: "Mar 22, 2026",
      deactivationReason: "Contract expired and not renewed.",
      products: [{ name: "Luxury Chips", price: "150", category: "Snacks", ingredients: "Potatoes, truffle" }]
    }
  ];
  saveStudentApplications();
}

function saveStudentApplications() {
  localStorage.setItem('student_vendor_applications', JSON.stringify(mockApplications));
}

// State variables for Table
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = "Latest";
let currentStatus = "All";
let currentSearch = "";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Event Listeners for Filters & Search
  const statusF = document.getElementById("statusFilter");
  if (statusF) {
    statusF.addEventListener("change", (e) => {
      currentStatus = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  const sortF = document.getElementById("sortFilter");
  if (sortF) {
    sortF.addEventListener("change", (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  const searchI = document.getElementById("searchInput");
  if (searchI) {
    searchI.addEventListener("input", (e) => {
      currentSearch = e.target.value.toLowerCase();
      currentPage = 1;
      renderTable();
    });
  }

  // Event Listeners for Pagination
  const prevP = document.getElementById("prevPage");
  if (prevP) {
    prevP.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  const nextP = document.getElementById("nextPage");
  if (nextP) {
    nextP.addEventListener("click", () => {
      const maxPage = Math.ceil(getFilteredAndSortedData().length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderTable();
      }
    });
  }

  // Confirmation Modal Global Support (Buttons)
  const sub = document.getElementById("submitConfirmBtn");
  if (sub) {
    sub.onclick = () => {
      const inputContainer = document.getElementById("confirmInputContainer");
      let val = null;
      if (inputContainer && inputContainer.style.display === "block") {
        val = document.getElementById("confirmInput").value.trim();
        if (!val) { alert("Please enter a reason."); return; }
      }
      if (confirmCallback) confirmCallback(val);
      closeModal("confirmModal");
      confirmCallback = null;
    };
  }
  const can = document.getElementById("cancelConfirmBtn");
  if (can) {
    can.onclick = () => {
      closeModal("confirmModal");
      confirmCallback = null;
    };
  }

  // Initial render
  loadStudentApplications();
  renderTable();
  initApplicationChart();
});

/* ========================================================
 * APPLICATION CHART LOGIC
 * ======================================================== */
function initApplicationChart() {
  const ctx = document.getElementById("applicationChart");
  if (!ctx) return;

  const chartData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      submitted: [5, 8, 4, 10, 12, 3, 2],
      approved: [3, 5, 2, 7, 8, 2, 1],
      rejected: [1, 2, 1, 2, 3, 1, 0],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      submitted: [45, 52, 48, 60],
      approved: [30, 38, 35, 42],
      rejected: [10, 12, 9, 15],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      submitted: [150, 180, 165, 200, 220, 210, 190, 205, 230, 250, 240, 260],
      approved: [110, 130, 120, 150, 165, 155, 140, 150, 170, 190, 180, 195],
      rejected: [30, 40, 35, 45, 40, 42, 38, 45, 50, 55, 48, 55],
    },
  };

  const appChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.daily.labels,
      datasets: [
        {
          label: "Submitted",
          data: chartData.daily.submitted,
          borderColor: "#a855f7",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#a855f7",
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Approved",
          data: chartData.daily.approved,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#22c55e",
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Rejected",
          data: chartData.daily.rejected,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#ef4444",
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: "circle",
            font: { family: "'Inter', sans-serif", size: 12 },
          },
        },
        tooltip: {
          backgroundColor: "#1e293b",
          padding: 12,
          titleFont: { size: 13, family: "'Inter', sans-serif" },
          bodyFont: { size: 14, family: "'Inter', sans-serif" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#f1f5f9", drawBorder: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: "#64748b" },
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: "#64748b" },
        },
      },
      interaction: { intersect: false, mode: "index" },
    },
  });

  const toggles = document.querySelectorAll(".revenue-controls .filter-tab");
  toggles.forEach((btn) => {
    btn.addEventListener("click", function () {
      toggles.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const range = this.getAttribute("data-range");
      const targetData = chartData[range];
      appChart.data.labels = targetData.labels;
      appChart.data.datasets[0].data = targetData.submitted;
      appChart.data.datasets[1].data = targetData.approved;
      appChart.data.datasets[2].data = targetData.rejected;
      appChart.update();
    });
  });
}

function getFilteredAndSortedData() {
  let filtered = mockApplications.filter((app) => {
    const searchMatch = app.studentName.toLowerCase().includes(currentSearch) ||
                        app.id.toLowerCase().includes(currentSearch);
    
    let statusMatch = true;
    if (currentStatus !== "All") {
      statusMatch = (app.status === currentStatus);
    }
    return searchMatch && statusMatch;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(a.dateSubmitted).getTime();
    const dateB = new Date(b.dateSubmitted).getTime();
    return currentSort === "Latest" ? dateB - dateA : dateA - dateB;
  });
  return filtered;
}

function renderTable() {
  const tableBody = document.getElementById("applicationsTableBody");
  if (!tableBody) return;
  const filteredData = getFilteredAndSortedData();
  const totalEntries = filteredData.length;
  tableBody.innerHTML = "";

  if (totalEntries === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 32px;">No applications found matching the current filters.</td></tr>`;
    updatePaginationUI(0, 0, 0);
    return;
  }

  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  paginatedData.forEach((app) => {
    const tr = document.createElement("tr");
    const statusClass = getStatusClass(app.status);

    let actionButtons = "";
    if (app.status === "Pending") {
      actionButtons = `
        <button class="btn-action btn-review" onclick="reviewApp('${app.id}')">Review</button>
      `;
    } else if (app.status === "Under Review") {
      actionButtons = `
        <button class="btn-action btn-approve" onclick="approveApp('${app.id}')">Approve</button>
        <button class="btn-action btn-reject" onclick="rejectApp('${app.id}')">Reject</button>
        <button class="btn-action btn-details" title="View Details" onclick="openDetails('${app.id}')"><i class="fa-solid fa-eye"></i></button>
      `;
    } else if (app.status === "Active Vendor") {
      actionButtons = `
        <button class="btn-action btn-details" title="View Details" onclick="openDetails('${app.id}')"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-action btn-reason" onclick="removeVendor('${app.id}')">Deactivate</button>
      `;
    } else if (app.status === "Rejected") {
      actionButtons = `
        <button class="btn-action btn-details" title="View Details" onclick="openDetails('${app.id}')"><i class="fa-solid fa-eye"></i></button>
      `;
    } else if (app.status === "Deactivated") {
      actionButtons = `
        <button class="btn-action btn-details" title="View Details" onclick="openDetails('${app.id}')"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-action btn-approve" onclick="reactivateVendor('${app.id}')">Reactivate</button>
      `;
    }

    tr.innerHTML = `
      <td class="app-id">${app.id}</td>
      <td>
        <div class="student-info">
          <span class="student-name">${app.studentName}</span>
          <span class="student-email">${app.studentEmail}</span>
        </div>
      </td>
      <td>${app.category}</td>
      <td>
        <span class="status-pill ${statusClass}">
          ${getStatusEmoji(app.status)} ${app.status}
        </span>
      </td>
      <td>${app.dateSubmitted}</td>
      <td class="actions-col"><div class="action-buttons">${actionButtons}</div></td>
    `;
    tableBody.appendChild(tr);
  });

  updatePaginationUI(startIndex + 1, endIndex, totalEntries);
  updateCounters();
}

function getStatusClass(status) {
  if (status === "Pending") return "status-pending";
  if (status === "Under Review") return "status-review";
  if (status === "Active Vendor") return "status-active";
  if (status === "Rejected") return "status-rejected";
  if (status === "Deactivated") return "status-deactivated";
  return "";
}

function getStatusEmoji(status) {
  if (status === "Pending") return "🟡";
  if (status === "Under Review") return "🔵";
  if (status === "Active Vendor") return "🟢";
  if (status === "Rejected") return "🔴";
  if (status === "Deactivated") return "⚫";
  return "";
}

function updateCounters() {
  const pendingCount = mockApplications.filter(app => app.status === "Pending").length;
  const activeCount = mockApplications.filter(app => app.status === "Active Vendor").length;
  const pendingEl = document.getElementById("countPending");
  const activeEl = document.getElementById("countActive");
  if (pendingEl) pendingEl.innerText = pendingCount;
  if (activeEl) activeEl.innerText = activeCount;
}

function updatePaginationUI(start, end, total) {
  const ps = document.getElementById("pageStart");
  const pe = document.getElementById("pageEnd");
  const te = document.getElementById("totalEntries");
  if (ps) ps.innerText = start;
  if (pe) pe.innerText = end;
  if (te) te.innerText = total;

  const totalPages = Math.ceil(total / itemsPerPage);
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (prevBtn) {
    if (currentPage <= 1) prevBtn.classList.add("disabled");
    else prevBtn.classList.remove("disabled");
  }
  if (nextBtn) {
    if (currentPage >= totalPages || total === 0) nextBtn.classList.add("disabled");
    else nextBtn.classList.remove("disabled");
  }
}

// Global Actions
function deleteApp(id) {
  showConfirmModal({
    title: "Delete Application",
    message: `Are you sure you want to permanently delete application ${id}? This action cannot be undone.`,
    type: "reject",
    requireInput: false,
    onConfirm: () => {
      const index = mockApplications.findIndex((x) => x.id === id);
      if (index !== -1) {
        mockApplications.splice(index, 1);
        saveStudentApplications();
        renderTable();
        if (typeof showToast === "function") {
          showToast("Deleted", `Application ${id} has been removed.`, "success");
        }
      }
    }
  });
}

function reviewApp(id) {
  const app = mockApplications.find((x) => x.id === id);
  if (app) {
    app.status = "Under Review";
    saveStudentApplications();
    renderTable();
  }
}

function approveApp(id) {
  showConfirmModal({
    title: "Approve Application",
    message: "Are you sure you want to approve this vendor application?",
    type: "approve",
    requireInput: false,
    onConfirm: () => {
      const app = mockApplications.find((x) => x.id === id);
      if (app) {
        app.status = "Active Vendor";
        saveStudentApplications();
        renderTable();
      }
    }
  });
}

function rejectApp(id) {
  showConfirmModal({
    title: "Reject Application",
    message: "Are you sure you want to reject this application? Please provide a reason.",
    type: "reject",
    requireInput: true,
    inputLabel: "Rejection Reason",
    onConfirm: (reason) => {
      const app = mockApplications.find((x) => x.id === id);
      if (app) {
        app.status = "Rejected";
        app.rejectionReason = reason;
        saveStudentApplications();
        renderTable();
      }
    }
  });
}

function removeVendor(id) {
  showConfirmModal({
    title: "Deactivate Vendor",
    message: "Are you sure you want to deactivate this vendor? Please provide a reason.",
    type: "reject",
    requireInput: true,
    inputLabel: "Deactivation Reason",
    onConfirm: (reason) => {
      const app = mockApplications.find((x) => x.id === id);
      if (app) {
        app.status = "Deactivated";
        app.deactivationReason = reason;
        saveStudentApplications();
        renderTable();
      }
    }
  });
}

function reactivateVendor(id) {
  showConfirmModal({
    title: "Reactivate Vendor",
    message: "Are you sure you want to reactivate this vendor?",
    type: "approve",
    requireInput: false,
    onConfirm: () => {
      const app = mockApplications.find((x) => x.id === id);
      if (app) {
        app.status = "Active Vendor";
        delete app.deactivationReason;
        saveStudentApplications();
        renderTable();
      }
    }
  });
}

// Modal & Details Logic
function openModal(id) {
  const m = document.getElementById(id);
  if(m) m.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const m = document.getElementById(id);
  if(m) m.classList.remove("active");
  document.body.style.overflow = "auto";
}

function openDetails(id) {
  const app = mockApplications.find((x) => x.id === id);
  if (!app) return;

  const statusClass = getStatusClass(app.status);
  const elAppId = document.getElementById("detAppId");
  const elEmail = document.getElementById("detEmail");
  const elStatus = document.getElementById("detStatusHtml");
  const elDate = document.getElementById("detDate");
  const elOwner = document.getElementById("detOwner");

  if (elAppId) elAppId.innerText = app.id;
  if (elEmail) elEmail.innerText = app.studentEmail;
  if (elStatus) {
    elStatus.className = `status-pill ${statusClass}`;
    elStatus.innerText = app.status;
  }
  if (elDate) elDate.innerText = app.dateSubmitted;
  if (elOwner) elOwner.innerText = app.studentName;

  const detProductsContainer = document.getElementById("detProductsContainer");
  if (detProductsContainer) {
    detProductsContainer.innerHTML = "";
    const prods = (app.products && app.products.length > 0) ? app.products : [
      { name: "Sample Item", price: "0", category: "N/A", ingredients: "N/A" }
    ];
    prods.forEach((prod) => {
      const wrap = document.createElement("div");
      wrap.className = "det-product-block";
      wrap.innerHTML = `
          <div class="det-product-title" style="margin-bottom: 12px; font-weight: 600; color: #1f2937;">
            <i class="fa-solid fa-box"></i> ${prod.name}
            <span style="float: right; font-size: 14px; color: #64748b; font-weight: 500;">₱${prod.price || '0'}</span>
          </div>
          <details class="product-details-dropdown" open style="margin-bottom: 8px;">
            <summary style="font-size: 13px; font-weight: 600; padding: 10px 14px; background: #f9fafb; cursor: pointer;">Ingredients Provided</summary>
            <div class="dropdown-content" style="padding: 12px 14px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; line-height: 1.5; color: #4b5563; font-size: 14px;">${prod.ingredients}</p>
            </div>
          </details>
          <details class="product-details-dropdown">
            <summary style="font-size: 13px; font-weight: 600; padding: 10px 14px; background: #f9fafb; cursor: pointer;">Step-by-Step Preparation Photos</summary>
            <div class="dropdown-content" style="padding: 12px 14px; border-top: 1px solid #e5e7eb;">
              <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; color: #9ca3af;">
                <i class="fa-regular fa-images" style="font-size: 24px;"></i>
                <p style="margin: 8px 0 0 0; font-size: 13px;">Photos securely attached to submission.</p>
              </div>
            </div>
          </details>
      `;
      detProductsContainer.appendChild(wrap);
    });
  }

  const fbSection = document.getElementById("adminFeedbackSection");
  const fbLabel = document.getElementById("adminFeedbackLabel");
  const fbBox = document.getElementById("detFeedbackBox");
  if ((app.status === "Rejected" && app.rejectionReason) || (app.status === "Deactivated" && app.deactivationReason)) {
    fbSection.style.display = "block";
    fbLabel.innerText = app.status === "Rejected" ? "Rejection Reason" : "Deactivation Reason";
    fbBox.innerText = app.rejectionReason || app.deactivationReason;
  } else {
    fbSection.style.display = "none";
  }

  const footer = document.getElementById("detailsFooter");
  footer.innerHTML = `<button class="btn-ghost" onclick="closeModal('detailsModal')">Close</button>`;
  openModal("detailsModal");
}

// Confirmation Modal Global Support
let confirmCallback = null;
function showConfirmModal(options) {
  const modal = document.getElementById("confirmModal");
  if(!modal) return;
  document.getElementById("confirmTitle").innerText = options.title || "Confirm Action";
  document.getElementById("confirmMessage").innerText = options.message || "Are you sure?";
  
  const icon = document.getElementById("confirmIcon");
  const submitBtn = document.getElementById("submitConfirmBtn");
  
  if (options.type === 'approve') {
    icon.style.color = "#10b981";
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
  } else {
    icon.style.color = "#ef4444";
    icon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
  }

  const inputContainer = document.getElementById("confirmInputContainer");
  if (options.requireInput) {
    inputContainer.style.display = "block";
    document.getElementById("confirmInputLabel").innerText = options.inputLabel || "Reason";
    document.getElementById("confirmInput").value = "";
  } else {
    inputContainer.style.display = "none";
  }

  confirmCallback = options.onConfirm;
  openModal("confirmModal");
}

// Expose mock applications array to global scope so inline onclick functions can access it
let mockApplications = [
  {
    id: "APP-1042",
    studentName: "Alice Johnson",
    studentEmail: "alice.j@wm.edu.ph",
    businessName: "Alice Bakes",
    category: "Food & Beverage",
    status: "Pending",
    dateSubmitted: "Oct 24, 2023",
    rejectionReason: ""
  },
  {
    id: "APP-1043",
    studentName: "Bob Smith",
    studentEmail: "bob.s@wm.edu.ph",
    businessName: "Bob Tech Repairs",
    category: "Services",
    status: "Under Review",
    dateSubmitted: "Oct 23, 2023",
    rejectionReason: ""
  },
  {
    id: "APP-1039",
    studentName: "Charlie Brown",
    studentEmail: "charlie.b@wm.edu.ph",
    businessName: "Charlie Merch",
    category: "Retail",
    status: "Active Vendor",
    dateSubmitted: "Oct 18, 2023",
    rejectionReason: ""
  },
  {
    id: "APP-1035",
    studentName: "Diana Prince",
    studentEmail: "diana.p@wm.edu.ph",
    businessName: "Wonder Crafts",
    category: "Arts & Crafts",
    status: "Rejected",
    dateSubmitted: "Oct 15, 2023",
    rejectionReason: "Duplicate application for the same category."
  },
  {
    id: "APP-1044",
    studentName: "Evan Wright",
    studentEmail: "evan.w@wm.edu.ph",
    businessName: "Fresh Squeeze",
    category: "Food & Beverage",
    status: "Pending",
    dateSubmitted: "Oct 25, 2023",
    rejectionReason: ""
  },
  {
    id: "APP-1040",
    studentName: "Fiona Gallagher",
    studentEmail: "fiona.g@wm.edu.ph",
    businessName: "Campus Thrifts",
    category: "Retail",
    status: "Active Vendor",
    dateSubmitted: "Oct 19, 2023",
    rejectionReason: ""
  },
];

// State variables for Table
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = "Latest";
let currentStatus = "All";
let currentSearch = "";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Event Listeners for Filters & Search
  document.getElementById("statusFilter").addEventListener("change", (e) => {
    currentStatus = e.target.value;
    currentPage = 1;
    renderTable();
  });

  document.getElementById("sortFilter").addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    renderTable();
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    currentPage = 1;
    renderTable();
  });

  // Event Listeners for Pagination
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const maxPage = Math.ceil(getFilteredAndSortedData().length / itemsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
    }
  });

  // Initial render
  renderTable();
});

// Helper functions for filtering and sorting
function getFilteredAndSortedData() {
  let filtered = mockApplications.filter((app) => {
    // Search Filter
    const searchMatch = app.studentName.toLowerCase().includes(currentSearch) ||
                        app.id.toLowerCase().includes(currentSearch) ||
                        app.businessName.toLowerCase().includes(currentSearch);
    
    // Status Filter
    let statusMatch = true;
    if (currentStatus !== "All") {
      if (currentStatus === "Active Vendor") {
        statusMatch = (app.status === "Active Vendor");
      } else {
        statusMatch = (app.status === currentStatus);
      }
    }

    return searchMatch && statusMatch;
  });

  // Sort Filter
  filtered.sort((a, b) => {
    const dateA = new Date(a.dateSubmitted).getTime();
    const dateB = new Date(b.dateSubmitted).getTime();
    if (currentSort === "Latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return filtered;
}

function renderTable() {
  const tableBody = document.getElementById("applicationsTableBody");
  const filteredData = getFilteredAndSortedData();
  const totalEntries = filteredData.length;
  
  tableBody.innerHTML = "";

  if (totalEntries === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #64748b; padding: 32px;">
          No applications found matching the current filters.
        </td>
      </tr>
    `;
    updatePaginationUI(0, 0, 0);
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  
  const paginatedData = filteredData.slice(startIndex, endIndex);

  paginatedData.forEach((app) => {
    const tr = document.createElement("tr");

    let statusClass = "";
    if (app.status === "Pending") statusClass = "status-pending";
    else if (app.status === "Under Review") statusClass = "status-review";
    else if (app.status === "Active Vendor") statusClass = "status-active";
    else if (app.status === "Rejected") statusClass = "status-rejected";

    let actionButtons = "";
    if (app.status === "Pending") {
      actionButtons = `<button class="btn-action btn-review" onclick="reviewApp('${app.id}')">Review</button>`;
    } else if (app.status === "Under Review") {
      actionButtons = `
        <button class="btn-action btn-approve" onclick="approveApp('${app.id}')">Approve</button>
        <button class="btn-action btn-reject" onclick="rejectApp('${app.id}')">Reject</button>
        <button class="btn-action btn-details" onclick="openDetails('${app.id}')">View Details</button>
      `;
    } else if (app.status === "Active Vendor") {
      actionButtons = `
        <button class="btn-action btn-details" onclick="openDetails('${app.id}')">View Details</button>
        <button class="btn-action btn-reason" onclick="removeVendor('${app.id}')">Remove Access</button>
      `;
    } else if (app.status === "Rejected") {
      actionButtons = `<button class="btn-action btn-details" onclick="openDetails('${app.id}')">View Details</button>`;
    }

    tr.innerHTML = `
      <td class="app-id">${app.id}</td>
      <td>
        <div class="student-info">
          <span class="student-name">${app.studentName}</span>
          <span class="student-email">${app.studentEmail}</span>
        </div>
      </td>
      <td>${app.businessName}</td>
      <td>${app.category}</td>
      <td>
        <span class="status-pill ${statusClass}">
          ${app.status === "Pending" ? "🟡" : app.status === "Under Review" ? "🔵" : app.status === "Active Vendor" ? "🟢" : "🔴"} 
          ${app.status}
        </span>
      </td>
      <td>${app.dateSubmitted}</td>
      <td class="actions-col">
        <div class="action-buttons">
          ${actionButtons}
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  updatePaginationUI(startIndex + 1, endIndex, totalEntries);
  updateCounters();
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
  document.getElementById("pageStart").innerText = start;
  document.getElementById("pageEnd").innerText = end;
  document.getElementById("totalEntries").innerText = total;

  const totalPages = Math.ceil(total / itemsPerPage);
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (currentPage <= 1) prevBtn.classList.add("disabled");
  else prevBtn.classList.remove("disabled");

  if (currentPage >= totalPages || total === 0) nextBtn.classList.add("disabled");
  else nextBtn.classList.remove("disabled");
}

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
  msg.innerText = options.message || "Are you sure?";

  // Style the icon and button based on action type (approve vs reject)
  if (options.type === 'approve') {
    icon.style.color = "#10b981";
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    submitBtn.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.2)";
  } else {
    icon.style.color = "#ef4444";
    icon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
    submitBtn.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.2)";
  }

  if (options.requireInput) {
    inputContainer.style.display = "block";
    inputLabel.innerText = options.inputLabel || "Reason";
    inputEl.value = "";
    inputEl.placeholder = options.inputPlaceholder || "Enter reason...";
  } else {
    inputContainer.style.display = "none";
  }

  confirmCallback = options.onConfirm;
  openModal("confirmModal");
}

document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancelConfirmBtn");
  const submitBtn = document.getElementById("submitConfirmBtn");
  const inputEl = document.getElementById("confirmInput");

  if(cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closeModal("confirmModal");
      confirmCallback = null;
    });
  }

  if(submitBtn) {
    submitBtn.addEventListener("click", () => {
      const inputContainer = document.getElementById("confirmInputContainer");
      let inputValue = null;
      if (inputContainer.style.display === "block") {
        inputValue = inputEl.value.trim();
        if (!inputValue) {
          alert("Please enter a reason.");
          return;
        }
      }
      
      if (confirmCallback) confirmCallback(inputValue);
      closeModal("confirmModal");
      confirmCallback = null;
    });
  }
});

// Global Actions
function reviewApp(id) {
  const app = mockApplications.find((x) => x.id === id);
  if (app) {
    app.status = "Under Review";
    renderTable(); // This will re-render the table and update the counters immediately
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
        renderTable();
      }
    }
  });
}

function removeVendor(id) {
  showConfirmModal({
    title: "Remove Vendor Access",
    message: "Are you sure you want to remove this vendor's access? Please provide a reason.",
    type: "reject",
    requireInput: true,
    inputLabel: "Removal Reason",
    onConfirm: (reason) => {
      const app = mockApplications.find((x) => x.id === id);
      if (app) {
        app.status = "Rejected";
        app.rejectionReason = reason;
        renderTable();
      }
    }
  });
}

// Modal Logic
function openModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "auto";
}

function openDetails(id) {
  const app = mockApplications.find((x) => x.id === id);
  if (!app) return;

  let statusClass = "";
  if (app.status === "Pending") statusClass = "status-pending";
  else if (app.status === "Under Review") statusClass = "status-review";
  else if (app.status === "Active Vendor") statusClass = "status-active";
  else if (app.status === "Rejected") statusClass = "status-rejected";

  document.getElementById("detStatusHtml").className = `status-pill ${statusClass}`;
  document.getElementById("detStatusHtml").innerText = app.status;
  document.getElementById("detDate").innerText = app.dateSubmitted;
  document.getElementById("detBusiness").innerText = app.businessName;
  document.getElementById("detOwner").innerText = app.studentName;

  // Mock Products rendering
  const detProductsContainer = document.getElementById("detProductsContainer");
  detProductsContainer.innerHTML = "";

  const mockProducts = [
    { name: "Sample Product 1", ingredients: "Ingredient A, Ingredient B, Ingredient C" },
    { name: "Sample Product 2", ingredients: "Ingredient X, Ingredient Y, Ingredient Z" },
  ];

  mockProducts.forEach((prod) => {
    const wrap = document.createElement("div");
    wrap.className = "det-product-block";
    wrap.innerHTML = `
      <div class="det-product-title"><i class="fa-solid fa-box"></i> ${prod.name}</div>
      <details class="product-details-dropdown" open>
        <summary>Ingredients Provided</summary>
        <div class="dropdown-content">
          <p style="margin: 0; line-height: 1.5; color: #4b5563;">${prod.ingredients}</p>
        </div>
      </details>
      <details class="product-details-dropdown">
        <summary>Step-by-Step Preparation Photos</summary>
        <div class="dropdown-content">
          <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; color: #9ca3af;">
            <i class="fa-regular fa-images" style="font-size: 24px;"></i>
            <p style="margin: 8px 0 0 0; font-size: 13px;">Photos securely attached to submission.</p>
          </div>
        </div>
      </details>
    `;
    detProductsContainer.appendChild(wrap);
  });

  // Admin Feedback Section
  const fbSection = document.getElementById("adminFeedbackSection");
  const fbLabel = document.getElementById("adminFeedbackLabel");
  const fbBox = document.getElementById("detFeedbackBox");
  
  if (app.status === "Rejected" && app.rejectionReason) {
    fbSection.style.display = "block";
    fbLabel.innerText = "Rejection Reason";
    fbBox.innerText = app.rejectionReason;
    fbBox.className = "feedback-box rejected";
  } else {
    fbSection.style.display = "none";
  }

  const footer = document.getElementById("detailsFooter");
  footer.innerHTML = `<button class="btn-ghost" onclick="closeModal('detailsModal')">Close</button>`;

  openModal("detailsModal");
}

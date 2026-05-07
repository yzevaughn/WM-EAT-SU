// Mock canteen applications data
let mockApplications = [];

function loadCanteenApplications() {
  const stored = localStorage.getItem('canteen_applications');
  if (stored) {
    mockApplications = JSON.parse(stored);
  } else {
    mockApplications = [
      {
        id: "CAN-1001",
        studentName: "Santos, Maria",
        studentEmail: "maria.s@wmsu.edu.ph",
        businessName: "Maria's Canteen",
        category: "Food & Drinks",
        status: "Pending",
        dateSubmitted: "Oct 24, 2023",
        rejectionReason: ""
      },
      {
        id: "CAN-1002",
        studentName: "Reyes, Jose",
        studentEmail: "jose.r@wmsu.edu.ph",
        businessName: "Reyes Lutong Bahay",
        category: "Food & Drinks",
        status: "Under Review",
        dateSubmitted: "Oct 23, 2023",
        rejectionReason: ""
      },
      {
        id: "CAN-1003",
        studentName: "Cruz, Ana",
        studentEmail: "ana.c@wmsu.edu.ph",
        businessName: "Ana's Snack Bar",
        category: "Snacks & Drinks",
        status: "Active Vendor",
        dateSubmitted: "Oct 18, 2023",
        rejectionReason: ""
      },
      {
        id: "CAN-1004",
        studentName: "Garcia, Pedro",
        studentEmail: "pedro.g@wmsu.edu.ph",
        businessName: "Garcia Meals",
        category: "Food & Drinks",
        status: "Rejected",
        dateSubmitted: "Oct 15, 2023",
        rejectionReason: "Incomplete health clearance documentation."
      },
      {
        id: "CAN-1005",
        studentName: "Lim, Rosa",
        studentEmail: "rosa.l@wmsu.edu.ph",
        businessName: "Lim's Corner Eats",
        category: "Snacks & Drinks",
        status: "Pending",
        dateSubmitted: "Oct 25, 2023",
        rejectionReason: ""
      }
    ];
    saveCanteenApplications();
  }
}

function saveCanteenApplications() {
  localStorage.setItem('canteen_applications', JSON.stringify(mockApplications));
}

function addCanteenApplication(appData) {
  loadCanteenApplications();
  mockApplications.unshift({
    id: "CAN-" + Math.floor(Math.random() * 9000 + 1000),
    studentName: appData.operatorName,
    studentEmail: appData.operatorEmail,
    businessName: appData.businessName,
    category: "Food & Drinks", // Default
    status: "Active Vendor", // Assuming walk-in is pre-approved
    dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    rejectionReason: ""
  });
  saveCanteenApplications();
  renderTable();
}

// State
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = "Latest";
let currentStatus = "All";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", () => {
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
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
  });
  document.getElementById("nextPage").addEventListener("click", () => {
    const maxPage = Math.ceil(getFilteredAndSortedData().length / itemsPerPage);
    if (currentPage < maxPage) { currentPage++; renderTable(); }
  });

  loadCanteenApplications();
  renderTable();
  initApplicationChart();
});

function initApplicationChart() {
  const ctx = document.getElementById("applicationChart");
  if (!ctx) return;

  const chartData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      submitted: [12, 15, 10, 18, 20, 8, 6],
      approved:  [10, 13, 8,  15, 18, 6, 4],
      rejected:  [1, 2, 1,  2,  2, 1, 1],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      submitted: [80, 95, 85, 110],
      approved:  [65, 78, 70, 90],
      rejected:  [10, 10,  8, 10],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      submitted: [250, 280, 265, 300, 320, 310, 290, 305, 330, 350, 340, 360],
      approved:  [200, 230, 220, 260, 280, 270, 250, 265, 290, 310, 300, 320],
      rejected:  [30,  30,  25,  30,  30,  30,  30,  30,  30,  30,  30,  30],
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

  // Handle Range Toggles
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
                        app.id.toLowerCase().includes(currentSearch) ||
                        app.businessName.toLowerCase().includes(currentSearch);
    let statusMatch = true;
    if (currentStatus !== "All") statusMatch = (app.status === currentStatus);
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
  const filteredData = getFilteredAndSortedData();
  const totalEntries = filteredData.length;
  tableBody.innerHTML = "";

  if (totalEntries === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#64748b;padding:32px;">No applications found matching the current filters.</td></tr>`;
    updatePaginationUI(0, 0, 0);
    return;
  }

  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  paginatedData.forEach((app) => {
    const tr = document.createElement("tr");
    let statusClass = "";
    let statusLabel = "";
    let statusEmoji = "";

    if (app.status === "Pending") { statusClass = "status-pending"; statusLabel = "Pending"; statusEmoji = "🟡"; }
    else if (app.status === "Under Review") { statusClass = "status-review"; statusLabel = "Under Review"; statusEmoji = "🔵"; }
    else if (app.status === "Active Vendor") { statusClass = "status-active"; statusLabel = "Active Canteen"; statusEmoji = "🟢"; }
    else if (app.status === "Rejected") { statusClass = "status-rejected"; statusLabel = "Rejected"; statusEmoji = "🔴"; }
    else if (app.status === "Deactivated") { statusClass = "status-deactivated"; statusLabel = "Deactivated"; statusEmoji = "⚫"; }

    let actionButtons = "";
    if (app.status === "Pending") {
      actionButtons = `<button class="btn-action btn-review" onclick="reviewApp('${app.id}')">Review</button>`;
    } else if (app.status === "Under Review") {
      actionButtons = `
        <button class="btn-action btn-approve" onclick="approveApp('${app.id}')">Approve</button>
        <button class="btn-action btn-reject" onclick="rejectApp('${app.id}')">Reject</button>
        <button class="btn-action btn-details" onclick="openDetails('${app.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
      `;
    } else if (app.status === "Active Vendor") {
      actionButtons = `
        <button class="btn-action btn-details" onclick="openDetails('${app.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-action btn-reason" onclick="removeVendor('${app.id}')">Deactivate</button>
      `;
    } else if (app.status === "Rejected") {
      actionButtons = `<button class="btn-action btn-details" onclick="openDetails('${app.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>`;
    } else if (app.status === "Deactivated") {
      actionButtons = `
        <button class="btn-action btn-details" onclick="openDetails('${app.id}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-action btn-approve" onclick="reactivateApp('${app.id}')">Reactivate</button>
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
      <td>${app.businessName}</td>
      <td>${app.category}</td>
      <td><span class="status-pill ${statusClass}">${statusEmoji} ${statusLabel}</span></td>
      <td>${app.dateSubmitted}</td>
      <td class="actions-col"><div class="action-buttons">${actionButtons}</div></td>
    `;
    tableBody.appendChild(tr);
  });

  updatePaginationUI(startIndex + 1, endIndex, totalEntries);
  updateCounters();
}

function updateCounters() {
  const pendingCount = mockApplications.filter(a => a.status === "Pending").length;
  const activeCount  = mockApplications.filter(a => a.status === "Active Vendor").length;
  const pendingEl = document.getElementById("countPending");
  const activeEl  = document.getElementById("countActive");
  if (pendingEl) pendingEl.innerText = pendingCount;
  if (activeEl)  activeEl.innerText  = activeCount;
}

function updatePaginationUI(start, end, total) {
  document.getElementById("pageStart").innerText  = start;
  document.getElementById("pageEnd").innerText    = end;
  document.getElementById("totalEntries").innerText = total;
  const totalPages = Math.ceil(total / itemsPerPage);
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (currentPage <= 1) prevBtn.classList.add("disabled"); else prevBtn.classList.remove("disabled");
  if (currentPage >= totalPages || total === 0) nextBtn.classList.add("disabled"); else nextBtn.classList.remove("disabled");
}

// Confirmation Modal
let confirmCallback = null;

function showConfirmModal(options) {
  const modal      = document.getElementById("confirmModal");
  const icon       = document.getElementById("confirmIcon");
  const title      = document.getElementById("confirmTitle");
  const msg        = document.getElementById("confirmMessage");
  const inputCont  = document.getElementById("confirmInputContainer");
  const inputLabel = document.getElementById("confirmInputLabel");
  const inputEl    = document.getElementById("confirmInput");
  const submitBtn  = document.getElementById("submitConfirmBtn");

  title.innerText = options.title   || "Confirm Action";
  msg.innerText   = options.message || "Are you sure?";

  if (options.type === "approve") {
    icon.style.color  = "#10b981";
    icon.innerHTML    = '<i class="fa-solid fa-circle-check"></i>';
    submitBtn.style.background  = "linear-gradient(135deg,#10b981,#059669)";
    submitBtn.style.boxShadow   = "0 2px 8px rgba(16,185,129,0.2)";
  } else {
    icon.style.color  = "#ef4444";
    icon.innerHTML    = '<i class="fa-solid fa-circle-exclamation"></i>';
    submitBtn.style.background  = "linear-gradient(135deg,#ef4444,#dc2626)";
    submitBtn.style.boxShadow   = "0 2px 8px rgba(239,68,68,0.2)";
  }

  if (options.requireInput) {
    inputCont.style.display = "block";
    inputLabel.innerText    = options.inputLabel || "Reason";
    inputEl.value           = "";
    inputEl.placeholder     = options.inputPlaceholder || "Enter reason...";
  } else {
    inputCont.style.display = "none";
  }

  confirmCallback = options.onConfirm;
  openModal("confirmModal");
}

document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancelConfirmBtn");
  const submitBtn = document.getElementById("submitConfirmBtn");
  const inputEl   = document.getElementById("confirmInput");

  if (cancelBtn) cancelBtn.addEventListener("click", () => { closeModal("confirmModal"); confirmCallback = null; });
  if (submitBtn) submitBtn.addEventListener("click", () => {
    const inputCont = document.getElementById("confirmInputContainer");
    let inputValue  = null;
    if (inputCont.style.display === "block") {
      inputValue = inputEl.value.trim();
      if (!inputValue) { alert("Please enter a reason."); return; }
    }
    if (confirmCallback) confirmCallback(inputValue);
    closeModal("confirmModal");
    confirmCallback = null;
  });
});

function reviewApp(id) {
  const app = mockApplications.find(x => x.id === id);
  if (app) { 
    app.status = "Under Review"; 
    saveCanteenApplications();
    renderTable(); 
  }
}

function approveApp(id) {
  showConfirmModal({
    title: "Approve Application",
    message: "Are you sure you want to approve this canteen application?",
    type: "approve", requireInput: false,
    onConfirm: () => {
      const app = mockApplications.find(x => x.id === id);
      if (app) { 
        app.status = "Active Vendor"; 
        saveCanteenApplications();
        renderTable(); 
      }
    }
  });
}

function rejectApp(id) {
  showConfirmModal({
    title: "Reject Application",
    message: "Are you sure you want to reject this application? Please provide a reason.",
    type: "reject", requireInput: true, inputLabel: "Rejection Reason",
    onConfirm: (reason) => {
      const app = mockApplications.find(x => x.id === id);
      if (app) { 
        app.status = "Rejected"; 
        app.rejectionReason = reason; 
        saveCanteenApplications();
        renderTable(); 
      }
    }
  });
}

function removeVendor(id) {
  showConfirmModal({
    title: "Deactivate Canteen",
    message: "Are you sure you want to deactivate this canteen? Please provide a reason.",
    type: "reject", requireInput: true, inputLabel: "Deactivation Reason",
    onConfirm: (reason) => {
      const app = mockApplications.find(x => x.id === id);
      if (app) { 
        app.status = "Deactivated"; 
        app.deactivationReason = reason; 
        saveCanteenApplications();
        renderTable(); 
      }
    }
  });
}

function reactivateApp(id) {
  showConfirmModal({
    title: "Reactivate Canteen",
    message: "Are you sure you want to reactivate this canteen?",
    type: "approve", requireInput: false,
    onConfirm: () => {
      const app = mockApplications.find(x => x.id === id);
      if (app) { 
        app.status = "Active Vendor"; 
        delete app.deactivationReason;
        saveCanteenApplications();
        renderTable(); 
      }
    }
  });
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "auto";
}

function openDetails(id) {
  const app = mockApplications.find(x => x.id === id);
  if (!app) return;

  let statusClass = "";
  if (app.status === "Pending") statusClass = "status-pending";
  else if (app.status === "Under Review") statusClass = "status-review";
  else if (app.status === "Active Vendor") statusClass = "status-active";
  else if (app.status === "Rejected") statusClass = "status-rejected";
  else if (app.status === "Deactivated") statusClass = "status-deactivated";

  document.getElementById("detStatusHtml").className   = `status-pill ${statusClass}`;
  document.getElementById("detStatusHtml").innerText   = app.status === "Active Vendor" ? "Active Canteen" : app.status;
  document.getElementById("detDate").innerText         = app.dateSubmitted;
  document.getElementById("detBusiness").innerText     = app.businessName;
  document.getElementById("detOwner").innerText        = app.studentName;
  document.getElementById("detEmail").innerText        = app.studentEmail || "No email provided";
  document.getElementById("detContact").innerText      = app.contactNumber || "0912 345 6789";

  const empContainer = document.getElementById("detEmployeesContainer");
  empContainer.innerHTML = "";
  const employees = app.employees || [
    { name: "Juan Dela Cruz", role: "Cashier" },
    { name: "Maria Clara", role: "Cook" }
  ];

  employees.forEach(emp => {
    empContainer.innerHTML += `
      <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 500; color: #334155;"><i class="fa-solid fa-user" style="color: #94a3b8; margin-right: 8px;"></i> ${emp.name}</div>
          <div style="font-size: 13px; color: #64748b; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${emp.role}</div>
        </div>
        <div style="display: flex; gap: 16px; font-size: 12px; flex-wrap: wrap;">
          <a href="#" style="color: #3b82f6; text-decoration: none;"><i class="fa-solid fa-notes-medical" style="margin-right: 4px;"></i> Health Cert</a>
          <a href="#" style="color: #3b82f6; text-decoration: none;"><i class="fa-solid fa-address-card" style="margin-right: 4px;"></i> CV / ID</a>
          <a href="#" style="color: #3b82f6; text-decoration: none;"><i class="fa-solid fa-building-shield" style="margin-right: 4px;"></i> NBI Clearance</a>
        </div>
      </div>
    `;
  });

  const fbSection = document.getElementById("adminFeedbackSection");
  const fbLabel   = document.getElementById("adminFeedbackLabel");
  const fbBox     = document.getElementById("detFeedbackBox");
  if (app.status === "Rejected" && app.rejectionReason) {
    fbSection.style.display = "block";
    fbLabel.innerText       = "Rejection Reason";
    fbBox.innerText         = app.rejectionReason;
    fbBox.className         = "feedback-box rejected";
  } else if (app.status === "Deactivated" && app.deactivationReason) {
    fbSection.style.display = "block";
    fbLabel.innerText       = "Deactivation Reason";
    fbBox.innerText         = app.deactivationReason;
    fbBox.className         = "feedback-box rejected";
  } else {
    fbSection.style.display = "none";
  }

  document.getElementById("detailsFooter").innerHTML = `<button class="btn-ghost" onclick="closeModal('detailsModal')">Close</button>`;
  openModal("detailsModal");
}


document.addEventListener("DOMContentLoaded", function() {
    // ════════════════════════════════════════
    // MOCK DATA
    // ════════════════════════════════════════
    const complaints = [
        {
            id: "CMP-2026-001",
            user: "Santos, Maria",
            subject: "Wrong side dish received",
            orderId: "#ORD-2026-1547",
            message: "I ordered mashed potato but I received rice instead. This is the second time this happened with this vendor.",
            date: "Mar 05, 2026",
            status: "In Progress",
            vendor: "Spicy Dragon Kitchen"
        },
        {
            id: "CMP-2026-002",
            user: "Dela Cruz, Juan",
            subject: "Food was cold and stale",
            orderId: "#ORD-2026-1549",
            message: "The burger arrived cold and the bun was very hard. It felt like it was sitting there for hours.",
            date: "Mar 04, 2026",
            status: "In Progress",
            vendor: "Burger Bar"
        },
        {
            id: "CMP-2026-003",
            user: "Gomez, Elena",
            subject: "Overcharged for drinks",
            orderId: "#ORD-2026-1552",
            message: "The price in the app said ₱50 but I was charged ₱65 upon checkout. Please refund the difference.",
            date: "Mar 03, 2026",
            status: "Resolved",
            vendor: "Student Refreshments"
        },
        {
            id: "CMP-2026-004",
            user: "Lim, Ricardo",
            subject: "Rude delivery staff",
            orderId: "#ORD-2026-1560",
            message: "The delivery person was very impatient and used inappropriate language when I asked for my change.",
            date: "Mar 02, 2026",
            status: "In Progress",
            vendor: "Campus Express"
        },
        {
            id: "CMP-2026-005",
            user: "Reyes, Sofia",
            subject: "Hair found in food",
            orderId: "#ORD-2026-1565",
            message: "I found a long strand of hair in my pasta. This is very unhygienic and disappointing.",
            date: "Mar 01, 2026",
            status: "Closed",
            vendor: "Pasta Palace"
        },
        {
            id: "CMP-2026-006",
            user: "Tech, Gabriel",
            subject: "Order never arrived",
            orderId: "#ORD-2026-1570",
            message: "My order was marked as delivered but I never received it. I've been waiting for over an hour.",
            date: "Feb 28, 2026",
            status: "In Progress",
            vendor: "Kwek-Kwek Corner"
        }
    ];

    // Mock supplemental data for detail view
    const detailMocks = {
        studentEmail: "student@wm.edu.ph",
        contactNumber: "0912 345 6789",
        evidence: {
            name: "receipt_photo.jpg",
            size: "2.4 MB",
            icon: "fa-file-image",
            color: "#3b82f6"
        },
        timeline: [
            { time: "10:05 AM", text: "Complaint submitted by student" },
            { time: "10:15 AM", text: "System automatically flagged vendor <strong>Waitlist</strong>" },
            { time: "11:30 AM", text: "Admin viewed complaint details" }
        ]
    };

    // ════════════════════════════════════════
    // SELECTORS
    // ════════════════════════════════════════
    const complaintsList = document.getElementById("complaintsList");
    const emptyState = document.getElementById("emptyState");

    // Header count selectors
    const counts = {
        progress: document.getElementById("count-progress"),
        resolved: document.getElementById("count-resolved"),
        closed: document.getElementById("count-closed")
    };
    
    // Top card values
    const cardValues = {
        progress: document.querySelector(".card-progress .card-value"),
        resolved: document.querySelector(".card-resolved .card-value"),
        closed: document.querySelector(".card-closed .card-value")
    };

    let activeStatus = "In Progress";
    let currentPage = 1;
    const itemsPerPage = 10;

    // ════════════════════════════════════════
    // FUNCTIONS
    // ════════════════════════════════════════

    function updateStats() {
        const stats = {
            "In Progress": 0,
            "Resolved": 0,
            "Closed": 0
        };

        complaints.forEach(c => {
            if (stats[c.status] !== undefined) {
                stats[c.status]++;
            }
        });

        // Update tab numbers
        if(counts.progress) counts.progress.textContent = stats["In Progress"];
        if(counts.resolved) counts.resolved.textContent = stats["Resolved"];
        if(counts.closed) counts.closed.textContent = stats["Closed"];

        // Update top cards
        if(cardValues.progress) cardValues.progress.textContent = stats["In Progress"];
        if(cardValues.resolved) cardValues.resolved.textContent = stats["Resolved"];
        if(cardValues.closed) cardValues.closed.textContent = stats["Closed"];
    }

    function renderComplaints() {
        const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
        const sortVal = document.getElementById("sortFilter")?.value || "Latest";

        let filtered = complaints.filter(c => {
            const matchStatus = activeStatus === "All" || c.status === activeStatus;
            const matchSearch = c.subject.toLowerCase().includes(searchTerm) || c.id.toLowerCase().includes(searchTerm) || c.user.toLowerCase().includes(searchTerm) || c.vendor.toLowerCase().includes(searchTerm);
            return matchStatus && matchSearch;
        });

        if (sortVal === "Oldest") {
            filtered = [...filtered].reverse();
        }

        complaintsList.innerHTML = "";

        if (filtered.length === 0) {
            emptyState.style.display = "flex";
            document.querySelector(".table-container").style.display = "none";
            return;
        }

        emptyState.style.display = "none";
        document.querySelector(".table-container").style.display = "block";
        
        // Pagination logic
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
        const currentItems = filtered.slice(startIndex, endIndex);

        currentItems.forEach(c => {
            const tr = document.createElement("tr");
            
            let statusClass = "";
            let badgeIcon = "";
            if (c.status === "In Progress") {
                statusClass = "status-review";
                badgeIcon = "🟡";
            } else if (c.status === "Resolved") {
                statusClass = "status-active";
                badgeIcon = "🟢";
            } else if (c.status === "Closed") {
                statusClass = "status-rejected";
                badgeIcon = "🔴";
            }
            
            tr.innerHTML = `
                <td class="app-id">${c.id}</td>
                <td>
                  <div class="student-info">
                    <span class="student-name">${c.user}</span>
                  </div>
                </td>
                <td>${c.subject}</td>
                <td>
                  <div class="student-info">
                    <span class="student-name">${c.vendor}</span>
                    <span class="student-email">${c.orderId}</span>
                  </div>
                </td>
                <td>
                  <span class="status-pill ${statusClass}">
                    ${badgeIcon} ${c.status}
                  </span>
                </td>
                <td>${c.date}</td>
                <td class="actions-col">
                  <div class="action-buttons">
                    ${c.status === "In Progress" ? 
                        `<button class="btn-action btn-approve btn-resolve" data-id="${c.id}">Resolve</button>` : 
                        ""}
                    <button class="btn-action btn-details" data-id="${c.id}">View Details</button>
                  </div>
                </td>
            `;
            complaintsList.appendChild(tr);
        });

        // Attach details listener
        document.querySelectorAll(".btn-details").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.stopPropagation();
                const id = this.getAttribute("data-id");
                openDetailPanel(id);
            });
        });

        // Re-attach resolve buttons listeners
        document.querySelectorAll(".btn-resolve").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.stopPropagation();
                const id = this.getAttribute("data-id");
                
                showConfirmModal({
                    title: "Resolve Complaint",
                    message: `Are you sure you want to mark complaint ${id} as Resolved?`,
                    type: "approve",
                    requireInput: false,
                    onConfirm: () => {
                        const comp = complaints.find(c => c.id === id);
                        if (comp) {
                            comp.status = "Resolved";
                            updateStats();
                            renderComplaints();
                            showToast("Success", `Complaint ${id} resolved successfully.`);
                        }
                    }
                });
            });
        });

        // Update Pagination UI
        if (filtered.length === 0) {
            document.getElementById("pageStart").innerText = 0;
            document.getElementById("pageEnd").innerText = 0;
        } else {
            document.getElementById("pageStart").innerText = startIndex + 1;
            document.getElementById("pageEnd").innerText = endIndex;
        }
        document.getElementById("totalEntries").innerText = filtered.length;

        const prevBtn = document.getElementById("prevPage");
        const nextBtn = document.getElementById("nextPage");

        if (currentPage <= 1) prevBtn.classList.add("disabled");
        else prevBtn.classList.remove("disabled");

        if (currentPage >= totalPages || filtered.length === 0) nextBtn.classList.add("disabled");
        else nextBtn.classList.remove("disabled");
    }

    // ════════════════════════════════════════
    // EVENT LISTENERS
    // ════════════════════════════════════════

    const statusFilter = document.getElementById("statusFilter");
    if (statusFilter) {
        statusFilter.addEventListener("change", function(e) {
            activeStatus = e.target.value;
            currentPage = 1;
            renderComplaints();
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function(e) {
            currentPage = 1;
            renderComplaints();
        });
    }

    const sortFilter = document.getElementById("sortFilter");
    if (sortFilter) {
        sortFilter.addEventListener("change", function(e) {
            currentPage = 1;
            renderComplaints();
        });
    }

    const pPrev = document.getElementById("prevPage");
    const pNext = document.getElementById("nextPage");

    if (pPrev) {
        pPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderComplaints();
            }
        });
    }

    if (pNext) {
        pNext.addEventListener('click', () => {
            const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
            let filtered = complaints.filter(c => {
                const matchStatus = activeStatus === "All" || c.status === activeStatus;
                const matchSearch = c.subject.toLowerCase().includes(searchTerm) || c.id.toLowerCase().includes(searchTerm) || c.user.toLowerCase().includes(searchTerm) || c.vendor.toLowerCase().includes(searchTerm);
                return matchStatus && matchSearch;
            });
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderComplaints();
            }
        });
    }

    // ════════════════════════════════════════
    // MODAL LOGIC
    // ════════════════════════════════════════


    // ════════════════════════════════════════
    // DETAIL PANEL LOGIC
    // ════════════════════════════════════════

    let currentDetailId = null;

    function openDetailPanel(id) {
        const c = complaints.find(item => item.id === id);
        if(!c) return;

        currentDetailId = id;

        // Populate header
        document.getElementById("dpIdLocation").innerHTML = `${c.id} &bull; ${c.vendor}`;

        // Populate student info
        document.getElementById("dpStudentName").textContent = c.user;
        document.getElementById("dpEmail").textContent = detailMocks.studentEmail;
        document.getElementById("dpContact").textContent = detailMocks.contactNumber;
        document.getElementById("dpOrderRef").textContent = c.orderId;
        document.getElementById("dpDate").textContent = c.date;

        // Populate status pill
        let statusClass = "status-review";
        if (c.status === "Resolved") statusClass = "status-active";
        else if (c.status === "Closed") statusClass = "status-rejected";
        document.getElementById("detStatusHtml").className = `status-pill ${statusClass}`;
        document.getElementById("detStatusHtml").textContent = c.status;

        // Populate description
        document.getElementById("dpDescriptionText").textContent = c.message;

        // Populate evidence
        document.getElementById("dpEvidenceName").textContent = detailMocks.evidence.name;
        document.getElementById("dpEvidenceSize").textContent = detailMocks.evidence.size;
        document.querySelector(".evidence-icon").innerHTML = `<i class="fa-solid ${detailMocks.evidence.icon}" style="color: ${detailMocks.evidence.color}"></i>`;



        // Hide/Show Mark Resolved button based on status
        const markResolvedBtn = document.getElementById("dpMarkResolved");
        if(c.status === "In Progress") {
            markResolvedBtn.style.display = "inline-flex";
        } else {
            markResolvedBtn.style.display = "none";
        }

        // Show modal
        document.getElementById("detailsModal").classList.add('active');
    }

    document.getElementById("dpMarkResolved").addEventListener("click", () => {
        if(!currentDetailId) return;
        
        showConfirmModal({
            title: "Resolve Complaint",
            message: `Are you sure you want to mark complaint ${currentDetailId} as Resolved?`,
            type: "approve",
            requireInput: false,
            onConfirm: () => {
                const comp = complaints.find(c => c.id === currentDetailId);
                if(comp) {
                    comp.status = "Resolved";
                    updateStats();
                    renderComplaints();
                    closeModal("detailsModal");
                    showToast("Success", `Complaint ${currentDetailId} resolved successfully.`);
                }
            }
        });
    });

    document.getElementById("dpSendReply").addEventListener("click", () => {
        const replyInput = document.getElementById("dpReplyInput");
        if(!replyInput.value.trim()) {
            alert("Please write a reply before sending.");
            return;
        }
        alert("Reply sent successfully to student.");
        replyInput.value = "";
    });



    // Initialize
    updateStats();
    renderComplaints();
    initComplaintsChart();
});

/* ========================================================
 * COMPLAINTS CHART LOGIC
 * ======================================================== */
function initComplaintsChart() {
    const ctx = document.getElementById("complaintsChart");
    if (!ctx) return;

    const chartData = {
        daily: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            total: [4, 6, 3, 8, 5, 2, 1],
            resolved: [2, 4, 3, 5, 4, 1, 1],
            pending: [2, 2, 0, 3, 1, 1, 0],
        },
        weekly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            total: [28, 35, 30, 42],
            resolved: [20, 25, 28, 35],
            pending: [8, 10, 2, 7],
        },
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            total: [120, 140, 130, 150, 160, 155, 145, 150, 170, 180, 175, 190],
            resolved: [100, 110, 115, 125, 135, 140, 130, 135, 145, 160, 165, 170],
            pending: [20, 30, 15, 25, 25, 15, 15, 15, 25, 20, 10, 20],
        },
    };

    const compChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartData.daily.labels,
            datasets: [
                {
                    label: "Reported",
                    data: chartData.daily.total,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#3b82f6",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Resolved",
                    data: chartData.daily.resolved,
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
                    label: "Pending",
                    data: chartData.daily.pending,
                    borderColor: "#f59e42",
                    backgroundColor: "rgba(245, 158, 66, 0.1)",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#f59e42",
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

            compChart.data.labels = targetData.labels;
            compChart.data.datasets[0].data = targetData.total;
            compChart.data.datasets[1].data = targetData.resolved;
            compChart.data.datasets[2].data = targetData.pending;
            compChart.update();
        });
    });
}

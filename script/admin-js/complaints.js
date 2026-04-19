
document.addEventListener("DOMContentLoaded", function() {
    // ════════════════════════════════════════
    // MOCK DATA
    // ════════════════════════════════════════
    const complaints = [
        {
            id: "CMP-2026-001",
            user: "Maria Santos",
            subject: "Wrong side dish received",
            orderId: "#ORD-2026-1547",
            message: "I ordered mashed potato but I received rice instead. This is the second time this happened with this vendor.",
            date: "Mar 05, 2026",
            status: "In Progress",
            vendor: "Spicy Dragon Kitchen"
        },
        {
            id: "CMP-2026-002",
            user: "Juan Dela Cruz",
            subject: "Food was cold and stale",
            orderId: "#ORD-2026-1549",
            message: "The burger arrived cold and the bun was very hard. It felt like it was sitting there for hours.",
            date: "Mar 04, 2026",
            status: "In Progress",
            vendor: "Burger Bar"
        },
        {
            id: "CMP-2026-003",
            user: "Elena Gomez",
            subject: "Overcharged for drinks",
            orderId: "#ORD-2026-1552",
            message: "The price in the app said ₱50 but I was charged ₱65 upon checkout. Please refund the difference.",
            date: "Mar 03, 2026",
            status: "Resolved",
            vendor: "Student Refreshments"
        },
        {
            id: "CMP-2026-004",
            user: "Ricardo Lim",
            subject: "Rude delivery staff",
            orderId: "#ORD-2026-1560",
            message: "The delivery person was very impatient and used inappropriate language when I asked for my change.",
            date: "Mar 02, 2026",
            status: "In Progress",
            vendor: "Campus Express"
        },
        {
            id: "CMP-2026-005",
            user: "Sofia Reyes",
            subject: "Hair found in food",
            orderId: "#ORD-2026-1565",
            message: "I found a long strand of hair in my pasta. This is very unhygienic and disappointing.",
            date: "Mar 01, 2026",
            status: "Closed",
            vendor: "Pasta Palace"
        },
        {
            id: "CMP-2026-006",
            user: "Gabriel Tech",
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
                    icon: "fa-solid fa-check-circle",
                    iconColor: "#10b981",
                    confirmText: "Resolve",
                    requireInput: false,
                    onConfirm: () => {
                        const comp = complaints.find(c => c.id === id);
                        if (comp) {
                            comp.status = "Resolved";
                            updateStats();
                            renderComplaints();
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

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
    };

    let confirmCallback = null;

    function showConfirmModal(options) {
        const modal = document.getElementById("confirmModal");
        const title = document.getElementById("confirmTitle");
        const message = document.getElementById("confirmMessage");
        const icon = document.getElementById("confirmIcon");
        const submitBtn = document.getElementById("submitConfirmBtn");
        const inputContainer = document.getElementById("confirmInputContainer");
        const confirmInput = document.getElementById("confirmInput");
        
        title.textContent = options.title || "Confirm Action";
        message.textContent = options.message || "Are you sure you want to do this?";
        submitBtn.textContent = options.confirmText || "Confirm";
        
        if (options.icon) {
            icon.innerHTML = `<i class="${options.icon}"></i>`;
            icon.style.color = options.iconColor || "#ef4444";
        }
        
        if (options.requireInput) {
            inputContainer.style.display = "block";
            confirmInput.value = "";
        } else {
            inputContainer.style.display = "none";
        }
        
        confirmCallback = options.onConfirm;
        modal.classList.add("active");
    }

    document.getElementById("cancelConfirmBtn").addEventListener("click", () => {
        closeModal("confirmModal");
        confirmCallback = null;
    });

    document.getElementById("submitConfirmBtn").addEventListener("click", () => {
        const inputContainer = document.getElementById("confirmInputContainer");
        const confirmInput = document.getElementById("confirmInput");
        
        if (inputContainer.style.display === "block" && !confirmInput.value.trim()) {
            alert("Please provide a reason.");
            return;
        }
        
        if (confirmCallback) {
            confirmCallback(confirmInput.value.trim());
        }
        closeModal("confirmModal");
    });

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

        // Populate timeline
        const timelineContainer = document.getElementById("dpTimelineContainer");
        timelineContainer.innerHTML = "";
        
        detailMocks.timeline.forEach(log => {
            const tlItem = document.createElement("div");
            tlItem.className = "timeline-item";
            tlItem.innerHTML = `
                <div class="timeline-icon"><i class="fa-solid fa-clock"></i></div>
                <div class="timeline-content">
                  <p class="timeline-text">${log.text}</p>
                  <span class="timeline-time">${c.date} &bull; ${log.time}</span>
                </div>
            `;
            timelineContainer.appendChild(tlItem);
        });

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
            icon: "fa-solid fa-check-circle",
            iconColor: "#10b981",
            confirmText: "Resolve",
            requireInput: false,
            onConfirm: () => {
                const comp = complaints.find(c => c.id === currentDetailId);
                if(comp) {
                    comp.status = "Resolved";
                    updateStats();
                    renderComplaints();
                    closeModal("detailsModal");
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

    document.getElementById("dpAddNote").addEventListener("click", () => {
        const replyInput = document.getElementById("dpReplyInput");
        if(!replyInput.value.trim()) {
            alert("Please write a note before adding.");
            return;
        }
        
        const timelineContainer = document.getElementById("dpTimelineContainer");
        const tlItem = document.createElement("div");
        tlItem.className = "timeline-item";
        
        // Get current time formatted like "10:30 AM"
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        tlItem.innerHTML = `
            <div class="timeline-icon" style="background: #e0e7ff; color: #4338ca;"><i class="fa-solid fa-clipboard"></i></div>
            <div class="timeline-content">
              <p class="timeline-text"><strong>Internal Note:</strong> ${replyInput.value.trim()}</p>
              <span class="timeline-time">Just now &bull; ${timeStr}</span>
            </div>
        `;
        timelineContainer.appendChild(tlItem);
        
        replyInput.value = "";
    });

    // Initialize
    updateStats();
    renderComplaints();
});


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

    // ════════════════════════════════════════
    // SELECTORS
    // ════════════════════════════════════════
    const complaintsList = document.getElementById("complaintsList");
    const statusTabs = document.getElementById("statusTabs");
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
        const filtered = complaints.filter(c => c.status === activeStatus);

        complaintsList.innerHTML = "";

        if (filtered.length === 0) {
            emptyState.style.display = "flex";
            const statusText = activeStatus.toLowerCase();
            emptyState.querySelector(".empty-text").textContent = `No ${statusText} complaints found`;
            return;
        }

        emptyState.style.display = "none";

        filtered.forEach(c => {
            const card = document.createElement("div");
            card.className = "complaint-item";
            
            const statusClass = c.status === "In Progress" ? "progress" : c.status.toLowerCase();
            
            card.innerHTML = `
                <div class="complaint-header">
                    <div class="complaint-user-info">
                        <span class="user-name">${c.user}</span>
                        <span class="complaint-id">${c.id}</span>
                    </div>
                    <span class="status-badge ${statusClass}">${c.status}</span>
                </div>
                <div class="complaint-body">
                    <div class="complaint-subject">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b"></i>
                        <span>${c.subject}</span>
                    </div>
                    <p class="complaint-message">${c.message}</p>
                </div>
                <div class="complaint-meta">
                    <div class="meta-details">
                        <span><i class="fa-solid fa-store"></i> ${c.vendor}</span>
                        <span><i class="fa-solid fa-box"></i> ${c.orderId}</span>
                        <span><i class="fa-solid fa-calendar-days"></i> ${c.date}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-complaint btn-details">View Details</button>
                        ${c.status === "In Progress" ? 
                            `<button class="btn-complaint btn-resolve" data-id="${c.id}">Resolve</button>` : 
                            ""}
                    </div>
                </div>
            `;
            complaintsList.appendChild(card);
        });

        // Re-attach resolve buttons listeners
        document.querySelectorAll(".btn-resolve").forEach(btn => {
            btn.addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                if (confirm(`Are you sure you want to mark ${id} as Resolved?`)) {
                    const comp = complaints.find(c => c.id === id);
                    if (comp) {
                        comp.status = "Resolved";
                        updateStats();
                        renderComplaints();
                    }
                }
            });
        });
    }

    // ════════════════════════════════════════
    // EVENT LISTENERS
    // ════════════════════════════════════════

    if (statusTabs) {
        statusTabs.addEventListener("click", function(e) {
            const tab = e.target.closest(".tab");
            if (!tab) return;

            // Update UI
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Update state
            activeStatus = tab.getAttribute("data-status");
            renderComplaints();
        });
    }

    // Initialize
    updateStats();
    renderComplaints();
});

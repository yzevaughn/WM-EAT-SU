document.addEventListener("DOMContentLoaded", function() {
    // ════════════════════════════════════════
    // MOCK DATA
    // ════════════════════════════════════════
    const transactions = [
        { id: "ORD-1547", student: "Santos, Maria", vendor: "Spicy Dragon Kitchen", items: "Mashed Potato, Grilled Chicken", amount: "₱245.00", status: "Completed", date: "2026-03-05 10:15 AM" },
        { id: "ORD-1548", student: "Dela Cruz, Juan", vendor: "Burger Bar", items: "Cheese Burger, Fries", amount: "₱185.00", status: "Pending", date: "2026-03-05 10:20 AM" },
        { id: "ORD-1549", student: "Gomez, Elena", vendor: "Student Refreshments", items: "Iced Coffee, Glazed Donut", amount: "₱120.00", status: "Completed", date: "2026-03-05 10:45 AM" },
        { id: "ORD-1550", student: "Lim, Ricardo", vendor: "Campus Express", items: "Rice Bowl, Soda", amount: "₱155.00", status: "Cancelled", date: "2026-03-05 11:05 AM" },
        { id: "ORD-1551", student: "Reyes, Sofia", vendor: "Pasta Palace", items: "Carbonara, Garlic Bread", amount: "₱210.00", status: "Completed", date: "2026-03-05 11:30 AM" },
        { id: "ORD-1552", student: "Tech, Gabriel", vendor: "Kwek-Kwek Corner", items: "Fishballs, Sago't Gulaman", amount: "₱85.00", status: "Completed", date: "2026-03-05 12:15 PM" },
        { id: "ORD-1553", student: "Luna, Antonio", vendor: "Spicy Dragon Kitchen", items: "Pancit Canton, Lumpia", amount: "₱160.00", status: "Pending", date: "2026-03-05 12:45 PM" },
        { id: "ORD-1554", student: "Silang, Gabriela", vendor: "Burger Bar", items: "Double Patty, Coke", amount: "₱220.00", status: "Completed", date: "2026-03-05 01:10 PM" },
        { id: "ORD-1555", student: "Mabini, Apolinario", vendor: "Pasta Palace", items: "Lasagna", amount: "₱175.00", status: "Completed", date: "2026-03-04 10:15 AM" },
        { id: "ORD-1556", student: "Bonifacio, Andres", vendor: "Campus Express", items: "Siomai Rice, Water", amount: "₱95.00", status: "Cancelled", date: "2026-03-04 11:30 AM" },
        { id: "ORD-1557", student: "Rizal, Jose", vendor: "Student Refreshments", items: "Fruit Shake, Sandwich", amount: "₱140.00", status: "Completed", date: "2026-03-04 02:45 PM" },
        { id: "ORD-1558", student: "Aquino, Corazon", vendor: "Spicy Dragon Kitchen", items: "Siopao, Tea", amount: "₱110.00", status: "Completed", date: "2026-03-03 09:15 AM" }
    ];

    let currentPage = 1;
    const itemsPerPage = 8;
    let filteredData = [...transactions];

    const tbody = document.getElementById("transactionList");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter = document.getElementById("dateFilter");
    const emptyState = document.getElementById("emptyState");

    function renderTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pagedData = filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = "";

        if (filteredData.length === 0) {
            emptyState.style.display = "flex";
            document.querySelector(".table-container").style.display = "none";
            return;
        }

        emptyState.style.display = "none";
        document.querySelector(".table-container").style.display = "block";

        pagedData.forEach(item => {
            const tr = document.createElement("tr");
            let statusClass = "status-pending";
            if (item.status === "Completed") statusClass = "status-completed";
            if (item.status === "Cancelled") statusClass = "status-cancelled";

            tr.innerHTML = `
                <td><span class="transaction-id">${item.id}</span></td>
                <td><strong>${item.student}</strong></td>
                <td>${item.vendor}</td>
                <td>${item.items}</td>
                <td><span class="amount-col">${item.amount}</span></td>
                <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                <td>${item.date}</td>
                <td class="actions-col">
                    <button class="btn-action btn-details" onclick="viewDetails('${item.id}')">View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        document.getElementById("pageStart").textContent = filteredData.length ? (currentPage - 1) * itemsPerPage + 1 : 0;
        document.getElementById("pageEnd").textContent = Math.min(currentPage * itemsPerPage, filteredData.length);
        document.getElementById("totalEntries").textContent = filteredData.length;

        const pageNumbers = document.getElementById("pageNumbers");
        pageNumbers.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderTable();
            };
            pageNumbers.appendChild(btn);
        }

        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 0;
    }

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const dateRange = dateFilter.value;

        filteredData = transactions.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm) || 
                                 item.student.toLowerCase().includes(searchTerm) || 
                                 item.vendor.toLowerCase().includes(searchTerm);
            const matchesStatus = status === "All" || item.status === status;
            
            // Mock date filtering logic
            let matchesDate = true;
            if (dateRange === "Today") matchesDate = item.date.includes("2026-03-05");
            if (dateRange === "Week") matchesDate = item.date.includes("2026-03-"); // Simple mock
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        currentPage = 1;
        renderTable();
    }

    searchInput.addEventListener("input", filterData);
    statusFilter.addEventListener("change", filterData);
    dateFilter.addEventListener("change", filterData);

    document.getElementById("prevPage").onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    };

    document.getElementById("nextPage").onclick = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    };

    window.viewDetails = function(id) {
        const item = transactions.find(t => t.id === id);
        if (!item) return;

        const modal = document.getElementById("detailsModal");
        const content = document.getElementById("modalContent");

        content.innerHTML = `
            <div style="display: grid; gap: 16px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <span style="color: #64748b; font-size: 0.9rem;">Order ID</span>
                    <span style="font-weight: 700;">${item.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <span style="color: #64748b; font-size: 0.9rem;">Student</span>
                    <span style="font-weight: 600;">${item.student}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <span style="color: #64748b; font-size: 0.9rem;">Vendor</span>
                    <span style="font-weight: 600;">${item.vendor}</span>
                </div>
                <div style="padding: 12px; background: #f8fafc; border-radius: 8px; margin: 8px 0;">
                    <span style="color: #64748b; font-size: 0.8rem; display: block; margin-bottom: 4px;">Items Ordered</span>
                    <span style="font-size: 0.95rem; line-height: 1.5;">${item.items}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #64748b; font-size: 0.9rem;">Total Amount</span>
                    <span style="font-size: 1.25rem; font-weight: 800; color: #ef4444;">${item.amount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #64748b; font-size: 0.9rem;">Status</span>
                    <span class="status-pill ${item.status === 'Completed' ? 'status-completed' : (item.status === 'Cancelled' ? 'status-cancelled' : 'status-pending')}">${item.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #64748b; font-size: 0.9rem;">Date & Time</span>
                    <span>${item.date}</span>
                </div>
            </div>
        `;

        modal.classList.add("active");
    };

    window.closeModal = function(id) {
        document.getElementById(id).classList.remove("active");
    };

    // Initial Render
    renderTable();
});

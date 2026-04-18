document.addEventListener('DOMContentLoaded', () => {
    // Mock Data
    const applications = [
        { id: "APP-001", vendor: "The Sweet Spot", student: "Maria Clara", date: "April 15, 2026", status: "Pending" },
        { id: "APP-002", vendor: "Campus Grill", student: "Juan Dela Cruz", date: "April 14, 2026", status: "Pending" },
        { id: "APP-003", vendor: "Healthy Bites", student: "Ana Reyes", date: "April 12, 2026", status: "Approved" },
        { id: "APP-004", vendor: "Kopi & Co", student: "Pedro Santos", date: "April 10, 2026", status: "Rejected" },
        { id: "APP-005", vendor: "Quick Snack", student: "Luz Visayas", date: "April 08, 2026", status: "Pending" },
        { id: "APP-006", vendor: "Pizza Corner", student: "Benito Garcia", date: "April 05, 2026", status: "Approved" },
        { id: "APP-007", vendor: "Tapsi Hub", student: "Claro M. Recto", date: "April 02, 2026", status: "Pending" },
        { id: "APP-008", vendor: "Burger Joint", student: "Emilio Aguinaldo", date: "March 28, 2026", status: "Rejected" },
        { id: "APP-009", vendor: "Smoothie Bar", student: "Gabriela Silang", date: "March 25, 2026", status: "Pending" },
        { id: "APP-010", vendor: "Salad Station", student: "Jose Rizal", date: "March 20, 2026", status: "Approved" },
        { id: "APP-011", vendor: "Ramen House", student: "Andres Bonifacio", date: "March 15, 2026", status: "Pending" },
        { id: "APP-012", vendor: "Sushi Box", student: "Antonio Luna", date: "March 10, 2026", status: "Approved" }
    ];

    // Pagination State
    let currentPage = 1;
    const itemsPerPage = 5;

    // Selectors
    const appList = document.getElementById('applicationsList');
    const paginationControls = document.getElementById('paginationControls');
    const emptyState = document.getElementById('emptyState');
    const bPrev = document.getElementById('prevPage');
    const bNext = document.getElementById('nextPage');
    const pNumbers = document.getElementById('pageNumbers');

    // Update Top Counters
    function updateStats() {
        let pending = 0, approved = 0, rejected = 0;
        applications.forEach(a => {
            if(a.status === 'Pending') pending++;
            else if(a.status === 'Approved') approved++;
            else if(a.status === 'Rejected') rejected++;
        });

        const pendingStat = document.querySelector('.stat-card.pending .stat-value');
        const approvedStat = document.querySelector('.stat-card.approved .stat-value');
        const rejectedStat = document.querySelector('.stat-card.rejected .stat-value');

        if(pendingStat) pendingStat.textContent = pending;
        if(approvedStat) approvedStat.textContent = approved;
        if(rejectedStat) rejectedStat.textContent = rejected;
    }

    function renderList() {
        if (applications.length === 0) {
            appList.style.display = 'none';
            paginationControls.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        appList.style.display = 'flex';
        emptyState.style.display = 'none';
        
        const totalPages = Math.ceil(applications.length / itemsPerPage);
        
        // Safety bound check
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        const currentItems = applications.slice(startIndex, endIndex);

        appList.innerHTML = '';

        currentItems.forEach(item => {
            const statusClass = item.status.toLowerCase();
            const actionText = item.status === 'Pending' ? 'Review Application' : 'View Details';
            
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `
                <div class="app-info">
                    <div class="app-vendor">${item.vendor}</div>
                    <div class="app-student"><i class="fa-solid fa-user-graduate"></i> ${item.student} <span class="app-date">• ${item.date}</span></div>
                </div>
                <div class="app-actions">
                    <span class="app-status ${statusClass}">${item.status}</span>
                    <button class="btn-review">${actionText}</button>
                </div>
            `;
            appList.appendChild(card);
        });

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (totalPages <= 1) {
            paginationControls.style.display = 'none';
            return;
        }
        
        paginationControls.style.display = 'flex';
        
        // Update Buttons
        bPrev.disabled = currentPage === 1;
        bNext.disabled = currentPage === totalPages;

        // Render Numbers
        pNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderList();
            });
            pNumbers.appendChild(btn);
        }
    }

    if (bPrev && bNext) {
        bPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderList();
            }
        });

        bNext.addEventListener('click', () => {
            const totalPages = Math.ceil(applications.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderList();
            }
        });
    }

    updateStats();
    renderList();
});

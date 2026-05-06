document.addEventListener('DOMContentLoaded', () => {
    let paymentData = [
        // This Month (Assuming May 2026 based on user context)
        { id: 1, name: 'Canteen 1', operator: 'John Doe', fee: 5000, dueDate: '2026-05-15', status: 'Paid', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-05-01', receiptImg: '../../images/receipt-mock.jpg' },
        { id: 2, name: 'Canteen 2', operator: 'Jane Smith', fee: 5000, dueDate: '2026-05-20', status: 'Not Paid', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 6, name: 'Canteen 6', operator: 'Clark Kent', fee: 4000, dueDate: '2026-05-28', status: 'Paid', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-05-05', receiptImg: '../../images/receipt-mock.jpg' },
        
        // Previous Month (April 2026)
        { id: 3, name: 'Canteen 3', operator: 'Lani Cruz', fee: 3500, dueDate: '2026-04-25', status: 'Paid', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-04-20', receiptImg: '../../images/receipt-mock.jpg' },
        { id: 4, name: 'Canteen 4', operator: 'Rex Bohol', fee: 3500, dueDate: '2026-04-30', status: 'Not Paid', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 7, name: 'Canteen 7', operator: 'Diana Prince', fee: 4500, dueDate: '2026-04-15', status: 'Paid', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-04-10', receiptImg: '../../images/receipt-mock.jpg' },
        { id: 8, name: 'Canteen 8', operator: 'Barry Allen', fee: 3000, dueDate: '2026-04-05', status: 'Not Paid', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        
        // Next Month (June 2026)
        { id: 5, name: 'Canteen 5', operator: 'Bruce Wayne', fee: 6000, dueDate: '2026-06-10', status: 'Not Paid', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 9, name: 'Canteen 9', operator: 'Arthur Curry', fee: 5500, dueDate: '2026-06-12', status: 'Paid', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-06-01', receiptImg: '../../images/receipt-mock.jpg' },
        { id: 10, name: 'Canteen 10', operator: 'Victor Stone', fee: 4200, dueDate: '2026-06-25', status: 'Not Paid', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' }
    ];

    let currentStatusFilter = 'All';
    let currentTypeFilter = 'All';
    let searchQuery = '';
    
    let currentPage = 1;
    const rowsPerPage = 5;

    const tableBody = document.getElementById('payment-table-body');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('vendorTypeFilter');

    function renderTable() {
        if (!tableBody) return;

        const monthFilterValue = document.getElementById('monthFilter')?.value;
        const specificMonthValue = document.getElementById('specificMonthInput')?.value; // "YYYY-MM"

        const today = new Date();
        const thisMonthString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        
        const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthString = nextMonthDate.getFullYear() + '-' + String(nextMonthDate.getMonth() + 1).padStart(2, '0');

        let targetMonth = '';
        if (monthFilterValue === 'This Month') {
            targetMonth = thisMonthString;
        } else if (monthFilterValue === 'Next Month') {
            targetMonth = nextMonthString;
        } else if (monthFilterValue === 'Specific Month') {
            targetMonth = specificMonthValue;
        }

        const filteredData = paymentData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.operator.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = currentStatusFilter === 'All' || item.status === currentStatusFilter;
            const matchesType = currentTypeFilter === 'All' || item.type === currentTypeFilter;
            
            let matchesMonth = true;
            if (targetMonth && targetMonth !== '') {
                matchesMonth = item.dueDate && item.dueDate.startsWith(targetMonth);
            }
            
            return matchesSearch && matchesStatus && matchesType && matchesMonth;
        });

        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = paginatedData.map(item => `
            <tr>
                <td><span class="canteen-name" style="font-weight: 700; font-size: 15px; display: block;">${item.name}</span></td>
                <td><span class="operator-name" style="font-size: 13px; color: #64748b;">${item.operator}</span></td>
                <td class="fee-val" style="font-weight: 600;">
                    ₱${item.fee.toLocaleString()}
                </td>
                <td><span class="status-badge ${item.statusClass}" style="padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-block; text-align: center; min-width: 100px;">${item.status}</span></td>
                <td class="actions-col">
                    <div class="row-actions" style="display: flex; justify-content: flex-end; gap: 8px;">
                        ${item.status === 'Paid' ? `
                        <button class="btn-icon" title="View Details" onclick="recordSpecificPayment(${item.id})" style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        updateCounts(totalItems, startIndex, Math.min(endIndex, totalItems), totalPages);
    }

    function updateCounts(totalItems, startIndex, endIndex, totalPages) {
        document.getElementById('totalEntries').textContent = totalItems;
        document.getElementById('pageStart').textContent = totalItems > 0 ? startIndex + 1 : 0;
        document.getElementById('pageEnd').textContent = endIndex;

        const paginationNav = document.querySelector('.pagination-nav');
        if (paginationNav) {
            let navHtml = '';
            
            navHtml += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i>
            </button>`;

            for (let i = 1; i <= totalPages; i++) {
                navHtml += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }

            navHtml += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-right"></i>
            </button>`;

            paginationNav.innerHTML = navHtml;
        }
    }

    window.changePage = (page) => {
        currentPage = page;
        renderTable();
    };

    // Search and Filter Listeners
    searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderTable();
    });

    statusFilter?.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        currentPage = 1;
        renderTable();
    });

    typeFilter?.addEventListener('change', (e) => {
        currentTypeFilter = e.target.value;
        currentPage = 1;
        renderTable();
    });

    const monthFilter = document.getElementById('monthFilter');
    const specificMonthInput = document.getElementById('specificMonthInput');

    monthFilter?.addEventListener('change', (e) => {
        if (e.target.value === 'Specific Month') {
            if (specificMonthInput) specificMonthInput.style.display = 'block';
        } else {
            if (specificMonthInput) specificMonthInput.style.display = 'none';
        }
        console.log(`Filtering for month: ${e.target.value}`);
        currentPage = 1;
        renderTable();
    });

    specificMonthInput?.addEventListener('change', (e) => {
        console.log(`Filtering for specific month: ${e.target.value}`);
        currentPage = 1;
        renderTable();
    });

    // Modal Logic
    document.getElementById('modalCanteenSelect')?.addEventListener('change', (e) => {
        const item = paymentData.find(p => p.name === e.target.value);
        if (item) {
            document.getElementById('modalAmount').value = '₱' + item.fee.toLocaleString();
            document.getElementById('modalCurrentDueDate').value = item.dueDate || 'N/A';

            if (item.dueDate) {
                const currentDate = new Date(item.dueDate);
                currentDate.setMonth(currentDate.getMonth() + 1);
                document.getElementById('modalNextDueDate').value = currentDate.toISOString().split('T')[0];
            } else {
                document.getElementById('modalNextDueDate').value = 'N/A';
            }
        } else {
            document.getElementById('modalAmount').value = '';
            document.getElementById('modalCurrentDueDate').value = '';
            document.getElementById('modalNextDueDate').value = '';
        }
    });

    window.openPaymentModal = () => {
        const m = document.getElementById('paymentModal');
        if (m) m.classList.add('active');
        // Set today's date by default
        const dateInput = document.getElementById('modalDate');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    };

    window.closePaymentModal = () => {
        const m = document.getElementById('paymentModal');
        if (m) m.classList.remove('active');
        const form = document.getElementById('recordPaymentForm');
        if (form) form.reset();
        const preview = document.getElementById('receiptPreview');
        if (preview) preview.style.display = 'none';
        const img = document.getElementById('previewImg');
        if (img) img.src = '';
        const select = document.getElementById('modalCanteenSelect');
        if (select) select.disabled = false;
        ['modalAmount', 'modalCurrentDueDate', 'modalNextDueDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    };

    window.previewReceipt = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('receiptPreview');
                const img = document.getElementById('previewImg');
                img.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    window.recordSpecificPayment = (id) => {
        const item = paymentData.find(p => p.id === id);
        if (item) {
            const select = document.getElementById('modalCanteenSelect');
            if (select) {
                select.value = item.name;
                select.disabled = true;
                select.dispatchEvent(new Event('change'));
            }
            
            // Populate existing data if any
            const dateInput = document.getElementById('modalDate');
            const preview = document.getElementById('receiptPreview');
            const img = document.getElementById('previewImg');
            
            if (item.date) {
                dateInput.value = item.date;
            } else {
                dateInput.value = '';
            }

            if (item.receiptImg) {
                img.src = item.receiptImg;
                preview.style.display = 'block';
            } else {
                img.src = '';
                preview.style.display = 'none';
            }

            openPaymentModal();
        }
    };



    const infoModal = document.getElementById('infoModal');
    window.closeInfoModal = () => infoModal.classList.remove('active');

    window.showInfoModal = (title, message) => {
        document.getElementById('infoTitle').textContent = title;
        document.getElementById('infoMessage').textContent = message;
        infoModal.classList.add('active');
    };

    const confirmModal = document.getElementById('confirmStatusModal');
    window.closeConfirmModal = () => confirmModal.classList.remove('active');

    window.toggleStatus = (id) => {
        const item = paymentData.find(p => p.id === id);
        if (!item) return;

        const confirmBtn = document.getElementById('confirmActionBtn');
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMsg = document.getElementById('confirmMessage');
        const confirmIcon = document.getElementById('confirmIcon');

        if (item.status === 'Paid') {
            // Restriction: Can only unclear through Record Payment modal
            showInfoModal("Action Restricted", `To set ${item.name} back to Not Paid, please open the "Record Payment" modal and use the "Set to Not Paid Status" button at the top.`);
            return;
        } else {
            // Toggling to Paid requires a receipt check and confirmation
            if (!item.receiptUploaded) {
                showInfoModal("Receipt Required", `Cannot mark as Paid. No receipt has been uploaded for ${item.name}. Please upload a receipt first via "View Details".`);
                return;
            }

            confirmTitle.textContent = "Mark as Paid?";
            confirmMsg.textContent = `Are you sure you want to mark ${item.name} as Paid? This confirms you have verified the uploaded receipt.`;
            confirmIcon.style.background = "#dcfce7";
            confirmIcon.style.color = "#16a34a";
            confirmIcon.innerHTML = '<i class="fa-solid fa-check"></i>';

            confirmBtn.onclick = () => {
                item.status = 'Paid';
                item.statusClass = 'status-clear';
                renderTable();
                closeConfirmModal();
            };
            confirmModal.classList.add('active');
        }
    };




    // Month Selector Logic
    document.getElementById('monthSelector')?.addEventListener('change', (e) => {
        console.log(`Filtering for month: ${e.target.value}`);
        // In a real app, this would fetch new data
        renderTable();
    });

    // Form Submit
    document.getElementById('recordPaymentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const canteenName = document.getElementById('modalCanteenSelect').value;
        const dateVal     = document.getElementById('modalDate').value;
        const previewImg  = document.getElementById('previewImg');

        if (!canteenName) {
            showInfoModal('Missing Selection', 'Please select a canteen first.');
            return;
        }

        if (!dateVal) {
            showInfoModal('Missing Date', 'Please enter the transaction date.');
            return;
        }

        const receiptInput = document.getElementById('receiptInput');
        const hasImage = (receiptInput.files && receiptInput.files.length > 0) ||
                         (previewImg.src && !previewImg.src.endsWith('/') && previewImg.src !== location.href);

        if (!hasImage) {
            showInfoModal('Receipt Required', 'Please upload a receipt or proof of payment before submitting.');
            return;
        }

        const record = paymentData.find(p => p.name === canteenName);
        if (record) {
            record.receiptUploaded = true;
            record.date            = dateVal;
            record.status          = 'Paid';
            record.statusClass     = 'status-clear';

            const nextDueDate = document.getElementById('modalNextDueDate').value;
            if (nextDueDate && nextDueDate !== 'N/A') {
                record.dueDate = nextDueDate;
            }

            if (receiptInput.files && receiptInput.files[0]) {
                record.receiptImg = previewImg.src;
            }
        }

        closePaymentModal();
        renderTable();
        showInfoModal('Payment Recorded ✓', `Payment for ${canteenName} has been successfully recorded and marked as Paid.`);
    });

    renderTable();
});

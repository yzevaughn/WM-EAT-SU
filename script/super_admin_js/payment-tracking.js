document.addEventListener('DOMContentLoaded', () => {
    let paymentData = [
        { id: 1, name: 'Canteen 1', operator: 'John Doe', fee: 5000, status: 'Clear', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-05-01', receiptImg: '../../images/receipt-mock.jpg' },
        { id: 2, name: 'Canteen 2', operator: 'Jane Smith', fee: 5000, status: 'Unclear', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 3, name: 'Canteen 3', operator: 'Lani Cruz', fee: 3500, status: 'Unclear', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 4, name: 'Canteen 4', operator: 'Rex Bohol', fee: 3500, status: 'Unclear', type: 'Canteen', statusClass: 'status-unclear', receiptUploaded: false, date: '', receiptImg: '' },
        { id: 5, name: 'Canteen 5', operator: 'Bruce Wayne', fee: 6000, status: 'Clear', type: 'Canteen', statusClass: 'status-clear', receiptUploaded: true, date: '2026-05-02', receiptImg: '../../images/receipt-mock.jpg' }
    ];

    let currentStatusFilter = 'All';
    let currentTypeFilter = 'All';
    let searchQuery = '';

    const tableBody = document.getElementById('payment-table-body');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('vendorTypeFilter');

    function renderTable() {
        if (!tableBody) return;

        const filteredData = paymentData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.operator.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = currentStatusFilter === 'All' || item.status === currentStatusFilter;
            const matchesType = currentTypeFilter === 'All' || item.type === currentTypeFilter;
            
            return matchesSearch && matchesStatus && matchesType;
        });

        tableBody.innerHTML = filteredData.map(item => `
            <tr>
                <td><span class="canteen-name" style="font-weight: 700; font-size: 15px; display: block;">${item.name}</span></td>
                <td><span class="operator-name" style="font-size: 13px; color: #64748b;">${item.operator}</span></td>
                <td class="fee-val" style="font-weight: 600;">
                    ₱${item.fee.toLocaleString()}
                </td>
                <td><span class="status-badge ${item.statusClass}" style="padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-block; text-align: center; min-width: 100px;">${item.status}</span></td>
                <td class="actions-col">
                    <div class="row-actions" style="display: flex; justify-content: flex-end; gap: 8px;">

                        <button class="btn-icon" title="Record Payment" onclick="recordSpecificPayment(${item.id})" style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="fa-solid fa-credit-card"></i>
                        </button>
                        <button class="btn-icon ${item.status === 'Clear' ? 'is-cleared' : ''}" title="Toggle Status" onclick="toggleStatus(${item.id})" style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: ${item.status === 'Clear' ? '#475569' : 'white'}; color: ${item.status === 'Clear' ? 'white' : '#64748b'}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
                            <i class="fa-solid fa-note-sticky"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update counts
        updateCounts(filteredData.length);
    }

    function updateCounts(filteredCount) {
        const unclear = paymentData.filter(p => p.status === 'Unclear').length;
        const clear = paymentData.filter(p => p.status === 'Clear').length;

        document.getElementById('countUnclear').textContent = unclear;
        document.getElementById('countClear').textContent = clear;

        const total = paymentData.length;
        document.getElementById('totalEntries').textContent = total;
        document.getElementById('pageEnd').textContent = filteredCount;
        document.getElementById('pageStart').textContent = filteredCount > 0 ? 1 : 0;
    }

    // Search and Filter Listeners
    searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTable();
    });

    statusFilter?.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderTable();
    });

    typeFilter?.addEventListener('change', (e) => {
        currentTypeFilter = e.target.value;
        renderTable();
    });

    document.getElementById('monthFilter')?.addEventListener('change', (e) => {
        console.log(`Filtering for month: ${e.target.value}`);
        renderTable();
    });

    document.getElementById('sortFilter')?.addEventListener('change', (e) => {
        const sort = e.target.value;
        if (sort === 'Amount') {
            paymentData.sort((a, b) => b.fee - a.fee);
        } else {
            paymentData.sort((a, b) => a.id - b.id);
        }
        renderTable();
    });

    // Modal Logic
    const modal = document.getElementById('paymentModal');
    window.openPaymentModal = () => {
        modal.classList.add('active');
    };
    window.closePaymentModal = () => {
        modal.classList.remove('active');
        document.getElementById('recordPaymentForm').reset();
        document.getElementById('receiptPreview').style.display = 'none';
        document.getElementById('previewImg').src = '';
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
            document.getElementById('modalCanteenSelect').value = item.name;
            
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

        if (item.status === 'Clear') {
            // Restriction: Can only unclear through Record Payment modal
            showInfoModal("Action Restricted", `To set ${item.name} back to Unclear, please open the "Record Payment" modal and use the "Set to Unclear" button at the top.`);
            return;
        } else {
            // Toggling to Clear requires a receipt check and confirmation
            if (!item.receiptUploaded) {
                showInfoModal("Receipt Required", `Cannot mark as Clear. No receipt has been uploaded for ${item.name}. Please upload a receipt first via "Record Payment".`);
                return;
            }

            confirmTitle.textContent = "Mark as Clear?";
            confirmMsg.textContent = `Are you sure you want to mark ${item.name} as Clear? This confirms you have verified the uploaded receipt.`;
            confirmIcon.style.background = "#dcfce7";
            confirmIcon.style.color = "#16a34a";
            confirmIcon.innerHTML = '<i class="fa-solid fa-check"></i>';

            confirmBtn.onclick = () => {
                item.status = 'Clear';
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
        const dateVal = document.getElementById('modalDate').value;
        const previewImg = document.getElementById('previewImg');

        if (!canteenName) {
            showInfoModal("Error", "Canteen context lost. Please try again.");
            return;
        }

        // Check if a new file was uploaded OR if an existing image is present
        const receiptInput = document.getElementById('receiptInput');
        const hasImage = (receiptInput.files && receiptInput.files.length > 0) || (previewImg.src && !previewImg.src.endsWith('/'));

        if (!hasImage) {
            showInfoModal("Receipt Required", "Please upload a receipt/proof of payment to record this transaction.");
            return;
        }

        // Find the record and update it
        const record = paymentData.find(p => p.name === canteenName);
        if (record) {
            record.receiptUploaded = true;
            record.date = dateVal;
            // In a real app, we'd save the actual file path or base64
            if (receiptInput.files && receiptInput.files[0]) {
                record.receiptImg = previewImg.src; 
            }
            showInfoModal("Success", `Payment record updated for ${canteenName}.`);
        }

        closePaymentModal();
        renderTable();
    });

    window.unclearCurrentTransaction = () => {
        const canteenName = document.getElementById('modalCanteenSelect').value;
        if (!canteenName) return;

        const record = paymentData.find(p => p.name === canteenName);
        if (record) {
            record.status = 'Unclear';
            record.statusClass = 'status-unclear';
            renderTable();
            closePaymentModal();
            showInfoModal("Status Updated", `${canteenName} has been set to Unclear.`);
        }
    };

    renderTable();
});

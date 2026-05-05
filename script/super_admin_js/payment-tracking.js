document.addEventListener('DOMContentLoaded', () => {
    let paymentData = [
        { id: 1, name: 'Canteen 1', operator: 'John Doe', fee: 5000, status: 'Paid', statusClass: 'status-paid', history: [{ date: 'May 01', amount: 5000, method: 'Cash', status: 'Cleared' }] },
        { id: 2, name: 'Canteen 2', operator: 'Jane Smith', fee: 5000, status: 'Overdue', statusClass: 'status-overdue', history: [{ date: 'Apr 01', amount: 5000, method: 'G-Cash', status: 'Cleared' }] },
        { id: 3, name: 'Canteen 3', operator: 'Mike Ross', fee: 4500, status: 'Due Soon', statusClass: 'status-due-soon', history: [] },
        { id: 4, name: 'Canteen 4', operator: 'Sarah Connor', fee: 5500, status: 'Upcoming', statusClass: 'status-upcoming', history: [] },
        { id: 5, name: 'Canteen 5', operator: 'Bruce Wayne', fee: 6000, status: 'Paid', statusClass: 'status-paid', history: [{ date: 'May 02', amount: 6000, method: 'Bank Transfer', status: 'Cleared' }] }
    ];

    let currentFilter = 'all';

    const tableBody = document.getElementById('payment-table-body');

    function renderTable() {
        if (!tableBody) return;

        const filteredData = paymentData.filter(item => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'pending') return item.status === 'Due Soon' || item.status === 'Upcoming';
            if (currentFilter === 'overdue') return item.status === 'Overdue';
            if (currentFilter === 'paid') return item.status === 'Paid' || item.status === 'Partially Paid';
            
            return true;
        });

        tableBody.innerHTML = filteredData.map(item => `
            <tr>
                <td><span class="canteen-name">${item.name}</span></td>
                <td><span class="operator-name">${item.operator}</span></td>
                <td class="fee-val">
                    ₱${item.fee.toLocaleString()}
                </td>
                <td style="text-align: center;"><span class="status-badge ${item.statusClass}">${item.status}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="btn-icon" title="View History" onclick="viewHistory(${item.id})">
                            <i class="fa-solid fa-history"></i>
                        </button>
                        <button class="btn-icon" title="Record Payment" onclick="recordSpecificPayment(${item.id})">
                            <i class="fa-solid fa-credit-card"></i>
                        </button>
                        <button class="btn-icon remind" title="Send Reminder" onclick="sendReminder('${item.operator}')">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

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
            const select = document.getElementById('modalCanteenSelect');
            if (select) {
                // Find option that matches name or id
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].text.includes(item.name)) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }
            openPaymentModal();
        }
    };

    window.sendReminder = (operator) => {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.color = 'var(--color-green)';
            btn.style.borderColor = 'var(--color-green)';
            alert(`Reminder successfully sent to ${operator}!`);
            
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.pointerEvents = 'auto';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        }, 1500);
    };

    const historyModal = document.getElementById('historyModal');
    window.openHistoryModal = () => historyModal.classList.add('active');
    window.closeHistoryModal = () => historyModal.classList.remove('active');

    window.viewHistory = (id) => {
        const item = paymentData.find(p => p.id === id);
        if (item) {
            document.getElementById('historyTitle').textContent = `${item.name} Payment History`;
            const list = document.getElementById('historyList');
            
            if (item.history && item.history.length > 0) {
                list.innerHTML = item.history.map(h => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--card-border);">
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">${h.date}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">${h.method}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: var(--color-green);">₱${h.amount.toLocaleString()}</div>
                            <div style="font-size: 11px; background: rgba(22, 163, 74, 0.1); color: var(--color-green); padding: 2px 8px; border-radius: 10px; display: inline-block;">${h.status}</div>
                        </div>
                    </div>
                `).join('');
            } else {
                list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">No payment history found for this canteen.</div>';
            }
            openHistoryModal();
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
        alert('Payment recorded successfully!');
        closePaymentModal();
        renderTable();
    });

    renderTable();
});

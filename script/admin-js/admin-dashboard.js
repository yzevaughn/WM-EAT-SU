document.addEventListener('DOMContentLoaded', () => {
    /* ── Stat Card Counts (mock data) ── */
    const data = {
        vendors:    { value: '12',  sub: '3 pending approval' },
        orders:     { value: '2,450', sub: '+12% from last week' },
        pending:    { value: '22',  sub: 'Needs your review' },
        complaints: { value: '6',   sub: 'Requires resolution' }
    };

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    setEl('statVendors',    data.vendors.value);
    setEl('statOrders',     data.orders.value);
    setEl('statPending',    data.pending.value);
    setEl('statComplaints', data.complaints.value);

    /* ── Quick-card badges ── */
    setEl('qbStudents',   '3');
    setEl('qbComplaints', '6');
    setEl('qbMenus',      '14');

    /* ── Approval Queue counts ── */
    setEl('qcStudents',   '3');
    setEl('qcMenus',      '14');
    setEl('qcPosters',    '5');
    setEl('qcComplaints', '6');
    setEl('qcCanteens',   '0');

    // Total queue badge
    const total = 3 + 14 + 5 + 6;
    setEl('queueTotal', `${total} items`);
});

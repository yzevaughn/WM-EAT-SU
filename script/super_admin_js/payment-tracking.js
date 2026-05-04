document.addEventListener('DOMContentLoaded', () => {
    const paymentData = [
        {
            name: "Canteen A - Main",
            operator: "Jess Malong",
            fee: "₱7,500",
            due: "May 05 · 1d left",
            dueDateStatus: "soon",
            status: "Due Soon",
            statusClass: "status-due-soon",
            progressText: "Not yet paid",
            progress: 0,
            progressColor: "var(--text-muted)",
            action: "Mark Paid",
            actionClass: "btn-mark-paid"
        },
        {
            name: "Canteen B - Annex",
            operator: "Alma Cruz",
            fee: "₱6,000",
            due: "May 07 · 3d left",
            dueDateStatus: "soon",
            status: "Due Soon",
            statusClass: "status-due-soon",
            progressText: "Not yet paid",
            progress: 0,
            progressColor: "var(--text-muted)",
            action: "Mark Paid",
            actionClass: "btn-mark-paid"
        },
        {
            name: "Canteen C - Science",
            operator: "Nora Lim",
            fee: "₱4,500",
            due: "May 15 · 11d left",
            dueDateStatus: "ok",
            status: "Upcoming",
            statusClass: "status-upcoming",
            progressText: "Not yet paid",
            progress: 0,
            progressColor: "var(--text-muted)",
            action: "Mark Paid",
            actionClass: "btn-mark-paid"
        },
        {
            name: "Canteen D - Engineering",
            operator: "Raul Diaz",
            fee: "₱5,000",
            due: "Apr 30 · OVERDUE",
            dueDateStatus: "overdue",
            status: "Overdue",
            statusClass: "status-overdue",
            progressText: "4 days overdue",
            progress: 100,
            progressColor: "var(--color-red)",
            action: "Send Notice",
            actionClass: "btn-send-notice"
        },
        {
            name: "Canteen E - Arts",
            operator: "Gil Reyes",
            fee: "₱3,800",
            due: "Paid May 01 ✓",
            dueDateStatus: "paid",
            status: "Paid",
            statusClass: "status-paid",
            progressText: "Paid on time",
            progress: 100,
            progressColor: "var(--color-green)",
            action: "Receipt",
            actionClass: "btn-receipt"
        }
    ];

    const tableBody = document.getElementById('payment-table-body');
    if (tableBody) {
        tableBody.innerHTML = paymentData.map(item => `
            <tr>
                <td>
                    <div class="canteen-cell">
                        <span class="canteen-name">${item.name}</span>
                        <span class="operator-name">Operator: ${item.operator}</span>
                    </div>
                </td>
                <td class="fee-val">${item.fee}</td>
                <td class="due-date ${item.dueDateStatus}">${item.due}</td>
                <td><span class="status-badge ${item.statusClass}">${item.status}</span></td>
            </tr>
        `).join('');
    }
});

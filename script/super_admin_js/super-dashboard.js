document.addEventListener('DOMContentLoaded', () => {
    // Top Earning Canteens Data
    const earnings = [
        { rank: "#1", name: "Canteen A - Main", amount: "₱88,200", progress: 95, color: "var(--color-teal)" },
        { rank: "#2", name: "Canteen B - Annex", amount: "₱58,900", progress: 75, color: "var(--color-purple)" },
        { rank: "#3", name: "Lani Cruz (Student)", amount: "₱54,700", progress: 65, color: "var(--color-blue)" },
        { rank: "#4", name: "Canteen C - Science", amount: "₱44,300", progress: 55, color: "var(--color-purple)" },
        { rank: "#5", name: "Rex Bohol (Student)", amount: "₱33,150", progress: 45, color: "var(--color-teal)" }
    ];

    // Payment Due Tracking Data
    const payments = [
        { 
            name: "Canteen D - Engineering", 
            due: "Due Apr 30 · OVERDUE", 
            amount: "₱5,000", 
            progress: 100, 
            status: "overdue",
            color: "var(--color-red)" 
        },
        { 
            name: "Canteen A - Main", 
            due: "Due May 05 · 1 day left", 
            amount: "₱7,500", 
            progress: 80, 
            status: "warning",
            color: "var(--color-orange)" 
        },
        { 
            name: "Canteen B - Annex", 
            due: "Due May 07 · 3 days left", 
            amount: "₱6,000", 
            progress: 80, 
            status: "warning",
            color: "var(--color-orange)" 
        },
        { 
            name: "Canteen C - Science", 
            due: "Due May 15 · 11 days left", 
            amount: "₱4,500", 
            progress: 30, 
            status: "ok",
            color: "var(--color-green)" 
        },
        { 
            name: "Canteen E - Arts", 
            due: "Paid May 01 ✓", 
            amount: "Paid", 
            progress: 0, 
            status: "paid",
            color: "var(--text-muted)" 
        }
    ];

    // Render Earning List
    const earningList = document.getElementById('earning-list');
    if (earningList) {
        earningList.innerHTML = earnings.map(item => `
            <div class="earning-item">
                <span class="rank">${item.rank}</span>
                <div class="earning-info">
                    <span class="earning-name">${item.name}</span>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${item.progress}%; background: ${item.color}"></div>
                    </div>
                </div>
                <span class="amount">${item.amount}</span>
            </div>
        `).join('');
    }

    // Render Payment List
    const paymentList = document.getElementById('payment-list');
    if (paymentList) {
        paymentList.innerHTML = payments.map(item => `
            <div class="payment-item">
                <div class="status-dot" style="background: ${item.color}"></div>
                <div class="payment-details">
                    <div class="payment-info">
                        <span class="payment-name">${item.name}</span>
                        <span class="payment-due">${item.due}</span>
                    </div>
                    <div class="due-bar-container">
                        <div class="due-bar" style="width: ${item.progress}%; background: ${item.color}"></div>
                    </div>
                    <span class="payment-badge status-${item.status}">
                        ${item.amount}
                    </span>
                </div>
            </div>
        `).join('');
    }
});

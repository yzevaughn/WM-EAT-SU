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
    let payments = [
        { 
            id: 1,
            name: "Canteen D - Engineering", 
            due: "Due Apr 30 · OVERDUE", 
            amount: "₱5,000", 
            progress: 100, 
            status: "unclear",
            color: "var(--color-red)" 
        },
        { 
            id: 2,
            name: "Canteen A - Main", 
            due: "Due May 05 · 1 day left", 
            amount: "₱7,500", 
            progress: 80, 
            status: "unclear",
            color: "var(--color-orange)" 
        },
        { 
            id: 3,
            name: "Canteen B - Annex", 
            due: "Due May 07 · 3 days left", 
            amount: "₱6,000", 
            progress: 80, 
            status: "unclear",
            color: "var(--color-orange)" 
        },
        { 
            id: 4,
            name: "Canteen C - Science", 
            due: "Due May 15 · 11 days left", 
            amount: "₱4,500", 
            progress: 30, 
            status: "unclear",
            color: "var(--color-green)" 
        },
        { 
            id: 5,
            name: "Canteen E - Arts", 
            due: "Paid May 01 ✓", 
            amount: "₱3,200", 
            progress: 0, 
            status: "clear",
            color: "var(--text-muted)" 
        }
    ];

    // Render Payment List
    function renderPaymentList() {
        const paymentList = document.getElementById('payment-list');
        if (!paymentList) return;

        paymentList.innerHTML = payments.map(item => `
            <div class="payment-item">
                <div class="status-dot" style="background: ${item.status === 'clear' ? 'var(--color-green)' : 'var(--color-red)'}"></div>
                <div class="payment-details">
                    <div class="payment-info">
                        <span class="payment-name">${item.name}</span>
                        <span class="payment-due">${item.due}</span>
                    </div>
                    <div class="due-bar-container">
                        <div class="due-bar" style="width: ${item.progress}%; background: ${item.status === 'clear' ? 'var(--color-green)' : 'var(--color-red)'}"></div>
                    </div>
                    <span class="payment-badge status-${item.status}">
                        ${item.status.toUpperCase()}
                    </span>
                    <div class="payment-actions">
                        <button class="btn-status-toggle" onclick="togglePaymentStatus(${item.id})">
                            <i class="fa-solid fa-rotate"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render Earnings List
    function renderEarningsList() {
        const earningList = document.getElementById('earning-list');
        if (!earningList) return;

        earningList.innerHTML = earnings.map(item => `
            <div class="earning-item">
                <div class="earning-rank" style="color: ${item.color}">${item.rank}</div>
                <div class="earning-details">
                    <div class="earning-info">
                        <span class="earning-name">${item.name}</span>
                        <span class="earning-amount">${item.amount}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${item.progress}%; background: ${item.color}"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Toggle Payment Status
    window.togglePaymentStatus = (id) => {
        const payment = payments.find(p => p.id === id);
        if (payment) {
            payment.status = payment.status === 'clear' ? 'unclear' : 'clear';
            renderPaymentList();
        }
    };

    // Initial Renders
    renderEarningsList();
    renderPaymentList();
});

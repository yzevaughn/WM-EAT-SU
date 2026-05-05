// Top Canteens Data
const canteens = [
    { rank: "#1", name: "Canteen A - Main", amount: "₱88,200", progress: 95, color: "var(--color-teal)" },
    { rank: "#2", name: "Canteen B - Annex", amount: "₱68,900", progress: 75, color: "var(--color-purple)" },
    { rank: "#3", name: "Canteen C - Science", amount: "₱44,300", progress: 55, color: "var(--color-purple)" },
    { rank: "#4", name: "Canteen E - Arts", amount: "₱31,800", progress: 40, color: "var(--text-muted)" },
    { rank: "#5", name: "Canteen D - Eng.", amount: "₱24,600", progress: 30, color: "var(--text-muted)" }
];

// Top Student Vendors Data
const students = [
    { rank: "#1", name: "Lani Cruz", amount: "₱54,700", progress: 90, color: "var(--color-blue)" },
    { rank: "#2", name: "Rex Bohol", amount: "₱33,150", progress: 65, color: "var(--color-blue)" },
    { rank: "#3", name: "Mark Ty", amount: "₱26,400", progress: 50, color: "var(--text-muted)" },
    { rank: "#4", name: "Sofia Ramos", amount: "₱18,200", progress: 35, color: "var(--text-muted)" },
    { rank: "#5", name: "Carlo Mendoza", amount: "₱12,050", progress: 25, color: "var(--text-muted)" }
];

// Combined Leaderboard Data
const leaderboard = [
    { rank: "#1", name: "Canteen A - Main", type: "Canteen", revenue: "₱88,200", allTime: "₱1.2M", growth: "14%", growthStatus: "up" },
    { rank: "#2", name: "Canteen B - Annex", type: "Canteen", revenue: "₱68,900", allTime: "₱980K", growth: "9%", growthStatus: "up" },
    { rank: "#3", name: "Lani Cruz", type: "Student", revenue: "₱54,700", allTime: "₱210K", growth: "22%", growthStatus: "up" },
    { rank: "#4", name: "Canteen C - Science", type: "Canteen", revenue: "₱44,300", allTime: "₱670K", growth: "3%", growthStatus: "down" },
    { rank: "#5", name: "Rex Bohol", type: "Student", revenue: "₱33,150", allTime: "₱145K", growth: "18%", growthStatus: "up" }
];

// Render lists
renderList('canteens-list', canteens);
renderList('students-list', students);

// Render Table
const tableBody = document.getElementById('leaderboard-body');
if (tableBody) {
    tableBody.innerHTML = leaderboard.map(item => `
        <tr>
            <td class="row-rank">${item.rank}</td>
            <td class="row-name">${item.name}</td>
            <td><span class="badge-type badge-${item.type.toLowerCase()}">${item.type}</span></td>
            <td class="revenue-val">${item.revenue}</td>
            <td class="all-time-val">${item.allTime}</td>
            <td class="growth-val growth-${item.growthStatus}">
                <i class="fa-solid fa-arrow-${item.growthStatus}"></i>
                ${item.growth}
            </td>
        </tr>
    `).join('');
}

function renderList(elementId, data) {
    const list = document.getElementById(elementId);
    if (list) {
        list.innerHTML = data.map(item => `
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
}

// --- Revenue Analytics Chart Logic ---
console.log('Top Earners JS: Initializing Analytics (direct)...');
const ctx = document.getElementById('revenueChart');
console.log('Top Earners JS: Chart element:', ctx);
if (ctx) {
    const chartCtx = ctx.getContext('2d');
    
    // Mock data for different views
    const chartData = {
        daily: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [120, 190, 150, 220, 180, 250, 290],
            total: "₱1,400.00",
            growth: "+12%",
            growthType: "positive"
        },
        weekly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            data: [850, 920, 1100, 1400],
            total: "₱4,270.00",
            growth: "+8%",
            growthType: "positive"
        },
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            data: [3200, 3800, 3500, 4100, 4800, 5200],
            total: "₱24,600.00",
            growth: "+15%",
            growthType: "positive"
        },
        yearly: {
            labels: ["2023", "2024", "2025", "2026"],
            data: [45000, 52000, 68000, 85000],
            total: "₱250,000.00",
            growth: "+25%",
            growthType: "positive"
        },
        all_time: {
            labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
            data: [15000, 25000, 45000, 52000, 68000, 85000],
            total: "₱290,000.00",
            growth: "+100%",
            growthType: "positive"
        }
    };

    // Total Revenue Card Filter
    const revenueFilter = document.getElementById('revenueFilter');
    const totalRevenueValue = document.getElementById('totalRevenueValue');

    const cardRevenueData = {
        all_time: "₱290,000.00",
        ytd: "₱85,000.00",
        monthly: "₱24,600.00",
        daily: "₱1,400.00"
    };

    if (revenueFilter && totalRevenueValue) {
        revenueFilter.addEventListener('change', function() {
            totalRevenueValue.innerHTML = cardRevenueData[this.value];
        });
    }

    // Create gradient
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(234, 88, 12, 0.2)');
    gradient.addColorStop(1, 'rgba(234, 88, 12, 0)');

    let revenueChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: chartData.daily.labels,
            datasets: [{
                label: 'Revenue (₱)',
                data: chartData.daily.data,
                borderColor: '#ea580c',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ea580c',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return '₱' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6' },
                    ticks: {
                        callback: function(value) { return '₱' + value; }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // Handle tab switching
    const tabs = document.querySelectorAll('.chart-tab');
    const domTotal = document.getElementById('chartTotalRevenue');
    const domGrowth = document.getElementById('chartGrowth');
    const domGrowthBadge = domGrowth ? domGrowth.parentElement : null;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            const view = e.target.getAttribute('data-view');
            const dataToLoad = chartData[view];

            revenueChart.data.labels = dataToLoad.labels;
            revenueChart.data.datasets[0].data = dataToLoad.data;
            revenueChart.update();

            if (domTotal) domTotal.textContent = dataToLoad.total;
            if (domGrowth) domGrowth.textContent = dataToLoad.growth;
            
            if (domGrowthBadge) {
                if (dataToLoad.growthType === 'positive') {
                    domGrowthBadge.className = 'growth-badge positive';
                    domGrowthBadge.querySelector('i').className = 'fas fa-arrow-up';
                } else {
                    domGrowthBadge.className = 'growth-badge negative';
                    domGrowthBadge.querySelector('i').className = 'fas fa-arrow-down';
                }
            }
        });
    });
}

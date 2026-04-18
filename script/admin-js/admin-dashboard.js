document.addEventListener('DOMContentLoaded', () => {
    // Top Metrics Mock Data
    const metrics = {
        vendors: { title: "Total Vendors", count: 12, subtitle: "3 pending approval", icon: "fa-store" },
        orders: { title: "Total Orders", count: 2450, subtitle: "+12% from last week", icon: "fa-bag-shopping" },
        revenue: { title: "Platform Revenue", count: "₱142,500", subtitle: "This month", icon: "fa-wallet" }
    };

    // Populate Metrics Grid
    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length >= 3) {
        // Vendors (Blue)
        updateMetricCard(metricCards[0], metrics.vendors);
        // Orders (Green)
        updateMetricCard(metricCards[1], metrics.orders);
        // Revenue (Purple)
        updateMetricCard(metricCards[2], metrics.revenue);
    }

    function updateMetricCard(card, data) {
        card.querySelector('h4').textContent = data.title;
        card.querySelector('h2').textContent = data.count;
        card.querySelector('p').textContent = data.subtitle;
        card.querySelector('.metric-icon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    }

    // Badge counts
    const badges = document.querySelectorAll('.fade-card .badge-minimal');
    if(badges.length >= 3) {
        badges[0].textContent = "3"; // Student Applications
        badges[1].textContent = "New"; // Create Vendor is now Assign Vendor
        badges[2].textContent = "6"; // Open Complaints
    }
    
    const saasBadges = document.querySelectorAll('.saas-list-badge.saas-badge-amber');
    if (saasBadges.length >= 3) {
        saasBadges[0].textContent = "3"; // Pending Vendors
        saasBadges[1].textContent = "14"; // Pending Menu Items
        saasBadges[2].textContent = "5"; // Pending Posts
    }


    /* ========================================================
     * REVENUE CHART LOGIC
     * ======================================================== */
    const ctx = document.getElementById('revenueChart');
    if(!ctx) return; // Exit if canvas is not found

    // Chart.js Configuration & Data
    const chartData = {
        daily: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            data: [1500, 2300, 1800, 2800, 3200, 1200, 900]
        },
        weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [12000, 15500, 14200, 18000]
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [45000, 52000, 48000, 56000, 61000, 59000, 55000, 60000, 65000, 72000, 68000, 75000]
        }
    };

    let revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.daily.labels,
            datasets: [{
                label: 'Gross Revenue (₱)',
                data: chartData.daily.data,
                borderColor: '#9d26ff', // Purple theme
                backgroundColor: 'rgba(157, 38, 255, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#9d26ff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide default legend as we have title
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 13, family: "'Inter', sans-serif" },
                    bodyFont: { size: 14, family: "'Inter', sans-serif" },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += '₱' + context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: '#64748b',
                        callback: function(value) {
                            if(value >= 1000) return '₱' + (value/1000) + 'k';
                            return '₱' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: '#64748b'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // Handle Revenue Toggle Buttons
    const toggles = document.querySelectorAll('.revenue-controls .filter-tab');
    
    toggles.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all
            toggles.forEach(t => t.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
            
            const range = this.getAttribute('data-range');
            const targetData = chartData[range];
            
            // Update Chart
            revenueChart.data.labels = targetData.labels;
            revenueChart.data.datasets[0].data = targetData.data;
            revenueChart.update();
        });
    });
});

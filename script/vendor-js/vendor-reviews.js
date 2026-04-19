document.addEventListener('DOMContentLoaded', () => {
    // ════════════════════════════════════════
    // MOCK DATA
    // ════════════════════════════════════════
    const mockReviews = [
        { id: 1, date: "2026-03-05", customer: "Sarah Johnson", item: "Classic Burger Meal", rating: 5, comment: "The food was absolutely delicious! Juicy and hot, perfectly cooked. Will definitely be back!", status: "Responded" },
        { id: 2, date: "2026-03-03", customer: "Michael Smith", item: "Classic Burger Meal", rating: 4, comment: "Great taste, but preparation took a bit longer than expected. Still worth it!", status: "Pending" },
        { id: 3, date: "2026-03-10", customer: "Elena Gomez", item: "Crispy French Fries", rating: 5, comment: "Super crispy and salty! Just the way I like it.", status: "Pending" },
        { id: 4, date: "2026-03-12", customer: "Juan Dela Cruz", item: "Classic Burger Meal", rating: 3, comment: "The burger was okay, but the fries were a bit cold.", status: "Responded" },
        { id: 5, date: "2026-03-15", customer: "Maria Santos", item: "Double Patty Deluxe", rating: 5, comment: "Amazing flavor! The special sauce is the best.", status: "Pending" },
        { id: 6, date: "2026-03-18", customer: "Ricardo Lim", item: "Crispy French Fries", rating: 2, comment: "Too greasy for my taste this time. Usually better.", status: "Pending" },
        { id: 7, date: "2026-03-20", customer: "Sofia Reyes", item: "Veggie Burger", rating: 4, comment: "Decent veggie option! Good to have more choices.", status: "Responded" },
        { id: 8, date: "2026-03-22", customer: "Gabriel Tech", item: "Classic Burger Meal", rating: 5, comment: "Perfect meal for a long day. 10/10.", status: "Pending" },
        { id: 9, date: "2026-03-24", customer: "Anna Lopez", item: "Double Patty Deluxe", rating: 4, comment: "Very filling and tasty.", status: "Pending" },
        { id: 10, date: "2026-03-26", customer: "David King", item: "Crispy French Fries", rating: 5, comment: "Best fries on campus hands down.", status: "Responded" },
        { id: 11, date: "2026-03-28", customer: "Carla D.", item: "Classic Burger Meal", rating: 1, comment: "Order was missing items and took too long.", status: "Pending" }
    ];

    // ════════════════════════════════════════
    // TABLE STATE
    // ════════════════════════════════════════
    let currentSearch = "";
    let currentRating = "All";
    let currentFood = "All";
    let currentPage = 1;
    const itemsPerPage = 6;
    let reviewChartInstance = null;

    // ════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════
    function init() {
        populateFoodDropdown();
        initReviewsChart();
        renderReviewsTable();
        // Initial metrics update
        updateSummaryMetrics(mockReviews);
    }

    function populateFoodDropdown() {
        const foodFilter = document.getElementById('foodFilter');
        if (!foodFilter) return;

        // Get unique items from mockReviews
        const uniqueItems = [...new Set(mockReviews.map(r => r.item))].sort();
        
        uniqueItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            foodFilter.appendChild(option);
        });
    }

    function updateSummaryMetrics(filteredData) {
        const totalCount = filteredData.length;
        const avgRating = totalCount > 0 
            ? (filteredData.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) 
            : "0.0";
        const positiveCount = filteredData.filter(r => r.rating >= 4).length;
        const positivePercentage = totalCount > 0 
            ? Math.round((positiveCount / totalCount) * 100) 
            : 0;
        const pendingCount = filteredData.filter(r => r.status === "Pending").length;

        // Update DOM
        if (document.getElementById('totalReviewsCount')) document.getElementById('totalReviewsCount').textContent = totalCount;
        if (document.getElementById('avgRatingValue')) document.getElementById('avgRatingValue').textContent = avgRating;
        if (document.getElementById('positivePercentage')) document.getElementById('positivePercentage').textContent = `${positivePercentage}%`;
        if (document.getElementById('pendingCount')) document.getElementById('pendingCount').textContent = pendingCount;
    }

    // ════════════════════════════════════════
    // CHART INITIALIZATION
    // ════════════════════════════════════════
    function initReviewsChart() {
        const ctx = document.getElementById('reviewChart');
        if (!ctx) return;

        const chartData = {
            daily: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [4.2, 4.5, 3.8, 4.7, 4.9, 4.1, 4.3]
            },
            weekly: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [4.1, 4.4, 4.3, 4.5]
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [3.9, 4.2, 4.1, 4.4, 4.5, 4.3, 4.6, 4.4, 4.5, 4.7, 4.6, 4.8]
            }
        };

        if (reviewChartInstance) reviewChartInstance.destroy();

        reviewChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.daily.labels,
                datasets: [{
                    label: 'Avg. Rating',
                    data: chartData.daily.data,
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#a855f7',
                    pointBorderWidth: 2,
                    pointRadius: 4,
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
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: { size: 13, family: "'Inter', sans-serif" },
                        bodyFont: { size: 14, family: "'Inter', sans-serif" },
                        callbacks: {
                            label: (context) => `Rating: ${context.parsed.y} ★`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 3,
                        max: 5,
                        grid: { color: '#f1f5f9', drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#64748b'
                        }
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        });

        const toggles = document.querySelectorAll('.revenue-controls .filter-tab');
        toggles.forEach(btn => {
            btn.addEventListener('click', function() {
                toggles.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const range = this.getAttribute('data-range');
                reviewChartInstance.data.labels = chartData[range].labels;
                reviewChartInstance.data.datasets[0].data = chartData[range].data;
                reviewChartInstance.update();
            });
        });
    }

    // ════════════════════════════════════════
    // TABLE RENDERING
    // ════════════════════════════════════════
    function renderReviewsTable() {
        const tableBody = document.getElementById('reviewsTableBody');
        if (!tableBody) return;

        const filtered = mockReviews.filter(r => {
            const matchesSearch = r.customer.toLowerCase().includes(currentSearch) || r.comment.toLowerCase().includes(currentSearch);
            const matchesRating = currentRating === "All" || r.rating.toString() === currentRating;
            const matchesFood = currentFood === "All" || r.item === currentFood;
            return matchesSearch && matchesRating && matchesFood;
        });

        // Update Summary Metrics based on filtered data
        updateSummaryMetrics(filtered);

        const totalEntries = filtered.length;
        const totalPages = Math.ceil(totalEntries / itemsPerPage);
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, totalEntries);
        const paginated = filtered.slice(start, end);

        tableBody.innerHTML = paginated.map(r => `
            <tr>
                <td style="white-space: nowrap; color: #64748b; font-size: 13px;">${r.date}</td>
                <td><span style="font-weight: 600; color: #0f172a;">${r.customer}</span></td>
                <td><span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; color: #475569;">${r.item}</span></td>
                <td>
                    <div style="color: #fbbf24; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-star" style="font-size: 12px;"></i>
                        <span style="font-weight: 700; color: #0f172a;">${r.rating}</span>
                    </div>
                </td>
                <td><p style="margin: 0; max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #64748b; font-size: 13px;" title="${r.comment}">${r.comment}</p></td>
            </tr>
        `).join('');

        // Update Pagination Stats
        document.getElementById('pageStart').textContent = totalEntries ? start + 1 : 0;
        document.getElementById('pageEnd').textContent = end;
        document.getElementById('totalEntries').textContent = totalEntries;

        // Render Page Numbers
        renderPageNumbers(totalPages);

        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (currentPage <= 1) prevPageBtn.classList.add('disabled');
        else prevPageBtn.classList.remove('disabled');

        if (currentPage >= totalPages) nextPageBtn.classList.add('disabled');
        else nextPageBtn.classList.remove('disabled');
    }

    function renderPageNumbers(totalPages) {
        const container = document.getElementById('pageNumbers');
        if (!container) return;
        container.innerHTML = "";
        
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderReviewsTable();
            };
            container.appendChild(btn);
        }
    }

    // ════════════════════════════════════════
    // TABLE CONTROLS
    // ════════════════════════════════════════
    const searchInput = document.getElementById('reviewSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            currentPage = 1;
            renderReviewsTable();
        });
    }

    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter) {
        ratingFilter.addEventListener('change', (e) => {
            currentRating = e.target.value;
            currentPage = 1;
            renderReviewsTable();
        });
    }

    const foodFilter = document.getElementById('foodFilter');
    if (foodFilter) {
        foodFilter.addEventListener('change', (e) => {
            currentFood = e.target.value;
            currentPage = 1;
            renderReviewsTable();
            // Shuffle chart data to simulate item-specific trends
            initReviewsChart(); 
        });
    }

    const prevBtn = document.getElementById('prevPage');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderReviewsTable();
            }
        });
    }

    const nextBtn = document.getElementById('nextPage');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const filteredCount = mockReviews.filter(r => {
                const matchesSearch = r.customer.toLowerCase().includes(currentSearch) || r.comment.toLowerCase().includes(currentSearch);
                const matchesRating = currentRating === "All" || r.rating.toString() === currentRating;
                const matchesFood = currentFood === "All" || r.item === currentFood;
                return matchesSearch && matchesRating && matchesFood;
            }).length;
            if (currentPage < Math.ceil(filteredCount / itemsPerPage)) {
                currentPage++;
                renderReviewsTable();
            }
        });
    }

    // Initialize
    init();
});

document.addEventListener('DOMContentLoaded', () => {
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
});

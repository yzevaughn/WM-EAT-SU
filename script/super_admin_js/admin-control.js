/**
 * Admin Control Logic
 * Manages the administrative user grid and account actions
 */

document.addEventListener('DOMContentLoaded', () => {
    renderAdminAccounts();
});

const adminData = [
    {
        id: 1,
        name: "Maria ...",
        email: "maria@campusbite.edu",
        role: "Canteen Admin",
        status: "Active",
        lastLogin: "Today 08:30",
        initials: "MS",
        avatarClass: "av-ms"
    },
    {
        id: 2,
        name: "Juan R...",
        email: "juan@campusbite.edu",
        role: "Finance Admin",
        status: "Active",
        lastLogin: "Today 07:55",
        initials: "JR",
        avatarClass: "av-jr"
    },
    {
        id: 3,
        name: "Ana D...",
        email: "ana@campusbite.edu",
        role: "App Reviewer",
        status: "Suspended",
        lastLogin: "Apr 28 14:20",
        initials: "AD",
        avatarClass: "av-ad"
    },
    {
        id: 4,
        name: "Ben T...",
        email: "ben@campusbite.edu",
        role: "Menu Admin",
        status: "Banned",
        lastLogin: "Apr 15 09:10",
        initials: "BT",
        avatarClass: "av-bt"
    },
    {
        id: 5,
        name: "Lea G...",
        email: "lea@campusbite.edu",
        role: "Support Admin",
        status: "Inactive",
        lastLogin: "Never",
        initials: "LG",
        avatarClass: "av-lg"
    }
];

function renderAdminAccounts() {
    const tableBody = document.getElementById('adminTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = adminData.map(admin => `
        <tr>
            <td>
                <div class="user-cell">
                    <div class="avatar-circle ${admin.avatarClass}">${admin.initials}</div>
                    <div class="user-details">
                        <h4>${admin.name}</h4>
                        <p>${admin.email}</p>
                    </div>
                </div>
            </td>
            <td><span class="role-badge">${admin.role}</span></td>
            <td><span class="status-pill ${admin.status.toLowerCase()}">${admin.status}</span></td>
            <td><span class="login-time">${admin.lastLogin}</span></td>
            <td>
                <div class="action-group">
                    ${getActionButtons(admin.status)}
                </div>
            </td>
        </tr>
    `).join('');
}

function getActionButtons(status) {
    switch (status) {
        case 'Active':
            return `
                <button class="btn-action" onclick="handleEdit()">Edit</button>
                <button class="btn-action warning" onclick="handleSuspend()">Suspend</button>
            `;
        case 'Suspended':
            return `
                <button class="btn-action success" onclick="handleRestore()">Restore</button>
                <button class="btn-action danger" onclick="handleBan()">Ban</button>
            `;
        case 'Banned':
            return `
                <button class="btn-action success" onclick="handleRestore()">Restore</button>
                <button class="btn-action" onclick="handleView()">View</button>
            `;
        case 'Inactive':
            return `
                <button class="btn-action" onclick="handleEdit()">Edit</button>
                <button class="btn-action danger" onclick="handleDelete()">Delete</button>
            `;
        default:
            return `<button class="btn-action">Action</button>`;
    }
}

// Placeholder functions for actions
function handleEdit() { alert('Edit admin flow...'); }
function handleSuspend() { alert('Suspend account flow...'); }
function handleRestore() { alert('Restore account flow...'); }
function handleBan() { alert('Ban account flow...'); }
function handleView() { alert('View details flow...'); }
function handleDelete() { alert('Delete account flow...'); }
function openCreateAdminModal() { alert('Opening Create Admin Modal...'); }
function handleSavePermissions() { alert('Permissions saved successfully!'); }

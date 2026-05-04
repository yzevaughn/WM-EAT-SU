/**
 * Admin Control Logic
 * Manages the administrative user grid and account actions
 */

document.addEventListener('DOMContentLoaded', () => {
    renderAdminAccounts();
    renderBannedAccounts();
    renderPermissionAdminList();
});

const adminData = [
    {
        id: 1,
        name: "admin1",
        email: "admin1@campusbite.edu",
        role: "Admin",
        status: "Active",
        lastLogin: "Today 08:30",
        initials: "A1",
        avatarClass: "av-ms"
    },
    {
        id: 2,
        name: "admin2",
        email: "admin2@campusbite.edu",
        role: "Admin",
        status: "Active",
        lastLogin: "Today 07:55",
        initials: "A2",
        avatarClass: "av-jr"
    },
    {
        id: 3,
        name: "admin3",
        email: "admin3@campusbite.edu",
        role: "Admin",
        status: "Suspended",
        lastLogin: "Apr 28 14:20",
        initials: "A3",
        avatarClass: "av-ad"
    },
    {
        id: 4,
        name: "admin4",
        email: "admin4@campusbite.edu",
        role: "Admin",
        status: "Banned",
        lastLogin: "Apr 15 09:10",
        initials: "A4",
        avatarClass: "av-bt"
    },
    {
        id: 5,
        name: "admin5",
        email: "admin5@campusbite.edu",
        role: "Admin",
        status: "Inactive",
        lastLogin: "Never",
        initials: "A5",
        avatarClass: "av-lg"
    }
];

function renderAdminAccounts() {
    const tableBody = document.getElementById('adminTableBody');
    if (!tableBody) return;

    const activeAdmins = adminData.filter(a => a.status === 'Active');

    tableBody.innerHTML = activeAdmins.map(admin => `
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
                    ${getActionButtons(admin.status, admin.id)}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderBannedAccounts() {
    const bannedBody = document.getElementById('bannedTableBody');
    if (!bannedBody) return;

    const inactiveAdmins = adminData.filter(a => a.status !== 'Active');

    bannedBody.innerHTML = inactiveAdmins.map(admin => `
        <tr>
            <td>
            <div class="account-status-cell">
                <div class="avatar-circle ${admin.avatarClass}">${admin.initials}</div>
                <div class="account-info-text">
                <h4>${admin.name}</h4>
                <div class="role-status-row">
                    <span class="account-role">${admin.role}</span>
                    <span class="status-pill inactive">${admin.status}</span>
                </div>
                </div>
            </div>
            </td>
            <td><span class="reason-text">${admin.reason || 'Manual Deactivation'}</span></td>
            <td><span class="date-text">${admin.deactivatedDate || 'Recently'}</span></td>
            <td>
                <div class="action-group">
                    ${getActionButtons(admin.status, admin.id)}
                </div>
            </td>
        </tr>
    `).join('');
}

function getActionButtons(status, adminId) {
    if (status === 'Active') {
        return `<button class="btn-action danger" onclick="promptDeactivate(${adminId})">Inactive</button>`;
    } else {
        return `<button class="btn-action success" onclick="reactivateAdmin(${adminId})">Active</button>`;
    }
}

// Workflow functions
function promptDeactivate(adminId) {
    const modal = document.getElementById('deactivateModal');
    if (modal) {
        document.getElementById('deactivateAdminId').value = adminId;
        document.getElementById('deactivateReason').value = '';
        modal.style.display = 'flex';
    }
}

function confirmDeactivate() {
    const adminId = parseInt(document.getElementById('deactivateAdminId').value);
    const reason = document.getElementById('deactivateReason').value;
    
    if (!reason.trim()) {
        alert('Please provide a reason for deactivation.');
        return;
    }

    const admin = adminData.find(a => a.id === adminId);
    if (admin) {
        admin.status = 'Inactive';
        admin.reason = reason;
        
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        admin.deactivatedDate = today.toLocaleDateString('en-US', options);

        renderAdminAccounts();
        renderBannedAccounts();
        closeDeactivateModal();
    }
}

function closeDeactivateModal() {
    const modal = document.getElementById('deactivateModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function reactivateAdmin(adminId) {
    const admin = adminData.find(a => a.id === adminId);
    if (admin) {
        admin.status = 'Active';
        admin.reason = '';
        admin.deactivatedDate = '';
        renderAdminAccounts();
        renderBannedAccounts();
    }
}

function openCreateAdminModal() { alert('Opening Create Admin Modal...'); }

function renderPermissionAdminList() {
    const adminList = document.querySelector('.admin-list');
    if (!adminList) return;

    adminList.innerHTML = adminData.slice(0, 4).map((admin, index) => `
        <div class="admin-item" data-id="${admin.id}" onclick="openPermissionModal('${admin.name}', '${admin.email}')">
            <div class="admin-item-info">
                <span class="status-dot ${admin.status.toLowerCase()}"></span>
                <div class="admin-item-text">
                    <h4>${admin.name}</h4>
                    <p>${admin.email}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function openPermissionModal(adminName, adminEmail) {
    const modal = document.getElementById('permissionModal');
    const nameDisplay = document.getElementById('modalAdminName');
    const emailDisplay = document.getElementById('modalAdminEmail');
    if (modal && nameDisplay) {
        nameDisplay.textContent = `${adminName} — Permissions`;
        if (emailDisplay) emailDisplay.textContent = adminEmail;
        modal.style.display = 'flex';
    }
}

function closePermissionModal() {
    const modal = document.getElementById('permissionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('permissionModal');
    if (e.target === modal) {
        closePermissionModal();
    }
});

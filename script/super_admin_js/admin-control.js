/**
 * Admin Control Logic
 * Manages the administrative user grid and account actions
 */

document.addEventListener('DOMContentLoaded', () => {
    renderAdminAccounts();
    renderDeactivatedAccounts();
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
        status: "Deactivated",
        lastLogin: "Apr 28 14:20",
        initials: "A3",
        avatarClass: "av-ad"
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
                    <img src="../../images/pfp.jpg" class="admin-avatar-img" alt="Admin">
                    <div class="user-details">
                        <h4>${admin.name}</h4>
                    </div>
                </div>
            </td>
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
                <img src="../../images/pfp.jpg" class="admin-avatar-img" alt="Admin">
                <div class="account-info-text">
                <h4>${admin.name}</h4>
                <div class="role-status-row">
                    <span class="status-pill inactive">${admin.status}</span>
                </div>
                </div>
            </div>
            </td>
            <td><span class="date-text">${admin.deactivatedDate || 'Recently'}</span></td>
            <td>
                <div class="action-group">
                    ${getActionButtons(admin.status, admin.id)}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderDeactivatedAccounts() {
    const deactivatedBody = document.getElementById('deactivatedTableBody');
    if (!deactivatedBody) return;

    const inactiveAdmins = adminData.filter(a => a.status === 'Deactivated');

    deactivatedBody.innerHTML = inactiveAdmins.map(admin => `
        <tr>
            <td>
            <div class="account-status-cell">
                <img src="../../images/pfp.jpg" class="admin-avatar-img sm" alt="Admin">
                <div class="account-info-text">
                <h4>${admin.name}</h4>
                <div class="role-status-row">
                    <span class="status-pill deactivated">${admin.status}</span>
                </div>
                </div>
            </div>
            </td>
            <td><span class="date-text">${admin.deactivatedDate || 'Recently'}</span></td>
            <td><span class="reason-text">${admin.reason || 'No reason provided'}</span></td>
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
        return `<button class="btn-action danger" onclick="promptDeactivate(${adminId})">Deactivate</button>`;
    } else {
        return `<button class="btn-action success" onclick="reactivateAdmin(${adminId})">Reactivate</button>`;
    }
}

// Workflow functions
function promptDeactivate(adminId) {
    const modal = document.getElementById('deactivateModal');
    if (modal) {
        document.getElementById('deactivateAdminId').value = adminId;
        modal.style.display = 'flex';
    }
}

function confirmDeactivate() {
    const adminId = parseInt(document.getElementById('deactivateAdminId').value);
    const reason = document.getElementById('deactivationReason').value;
    
    if (!reason) {
        alert('Please provide a reason for deactivation.');
        return;
    }

    const admin = adminData.find(a => a.id === adminId);
    if (admin) {
        admin.status = 'Deactivated';
        admin.reason = reason;
        
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        admin.deactivatedDate = today.toLocaleDateString('en-US', options);

        renderAdminAccounts();
        renderDeactivatedAccounts();
        closeDeactivateModal();
    }
}

function closeDeactivateModal() {
    const modal = document.getElementById('deactivateModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('deactivationReason').value = '';
    }
}

function reactivateAdmin(adminId) {
    const admin = adminData.find(a => a.id === adminId);
    if (admin) {
        admin.status = 'Active';
        admin.reason = '';
        admin.deactivatedDate = '';
        renderAdminAccounts();
        renderDeactivatedAccounts();
    }
}

function openCreateAdminModal() {
    const modal = document.getElementById('createAdminModal');
    if (modal) modal.style.display = 'flex';
}

function closeCreateAdminModal() {
    const modal = document.getElementById('createAdminModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createAdminForm').reset();
    }
}

// Create Admin Form Submission
document.getElementById('createAdminForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    
    const newAdmin = {
        id: adminData.length + 1,
        name: username,
        status: 'Active',
        lastLogin: 'Never',
        initials: username.slice(0, 2).toUpperCase(),
        avatarClass: 'av-ms'
    };
    
    adminData.push(newAdmin);
    renderAdminAccounts();
    renderPermissionAdminList();
    closeCreateAdminModal();
    alert(`New admin account created for ${username}`);
});

function renderPermissionAdminList() {
    const tableBody = document.getElementById('permissionAdminTableBody');
    if (!tableBody) return;

    const activeAdmins = adminData.filter(admin => admin.status === 'Active');

    tableBody.innerHTML = activeAdmins.map(admin => `
        <tr>
            <td>
                <div class="user-cell">
                    <img src="../../images/pfp.jpg" class="admin-avatar-img sm" alt="Admin">
                    <div class="user-details">
                        <h4>${admin.name}</h4>
                    </div>
                </div>
            </td>
            <td><span class="status-pill active">${admin.status}</span></td>
            <td><span class="login-time">${admin.lastLogin}</span></td>
            <td>
                <button class="btn-action" onclick="openPermissionModal('${admin.name}', '${admin.email}')">
                    <i class="fa-solid fa-eye"></i> View Audit
                </button>
            </td>
        </tr>
    `).join('');
}

function openPermissionModal(adminName, adminEmail) {
    const modal = document.getElementById('permissionModal');
    const nameDisplay = document.getElementById('modalAdminName');
    const emailDisplay = document.getElementById('modalAdminEmail');
    if (modal && nameDisplay) {
        nameDisplay.textContent = `${adminName} — Audit Logs`;
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

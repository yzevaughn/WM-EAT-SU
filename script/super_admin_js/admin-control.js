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
        avatarClass: "av-ms",
        permissions: ["users", "transactions", "apps", "complaints", "menu"]
    },
    {
        id: 2,
        name: "admin2",
        email: "admin2@campusbite.edu",
        role: "Admin",
        status: "Active",
        lastLogin: "Today 07:55",
        initials: "A2",
        avatarClass: "av-jr",
        permissions: ["users", "transactions", "apps", "complaints", "menu"]
    },
    {
        id: 3,
        name: "admin3",
        email: "admin3@campusbite.edu",
        role: "Admin",
        status: "Deactivated",
        lastLogin: "Apr 28 14:20",
        initials: "A3",
        avatarClass: "av-ad",
        permissions: ["users", "transactions"]
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
    const modal = document.getElementById('reactivateModal');
    if (modal) {
        document.getElementById('reactivateAdminId').value = adminId;
        modal.style.display = 'flex';
    }
}

function confirmReactivate() {
    const adminId = parseInt(document.getElementById('reactivateAdminId').value);
    const admin = adminData.find(a => a.id === adminId);
    if (admin) {
        admin.status = 'Active';
        admin.reason = '';
        admin.deactivatedDate = '';
        renderAdminAccounts();
        renderDeactivatedAccounts();
        closeReactivateModal();
    }
}

function closeReactivateModal() {
    const modal = document.getElementById('reactivateModal');
    if (modal) {
        modal.style.display = 'none';
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
    
    // Collect permissions
    const permissions = [];
    if (document.getElementById('permUsers').checked) permissions.push('users');
    if (document.getElementById('permTransactions').checked) permissions.push('transactions');
    if (document.getElementById('permApps').checked) permissions.push('apps');
    if (document.getElementById('permComplaints').checked) permissions.push('complaints');
    if (document.getElementById('permMenu').checked) permissions.push('menu');
    if (document.getElementById('permVouchers').checked) permissions.push('vouchers');

    const newAdmin = {
        id: adminData.length + 1,
        name: username,
        email: `${username}@campusbite.edu`, // Default email
        status: 'Active',
        lastLogin: 'Never',
        initials: username.slice(0, 2).toUpperCase(),
        avatarClass: 'av-ms',
        permissions: permissions
    };
    
    adminData.push(newAdmin);
    renderAdminAccounts();
    renderPermissionAdminList();
    closeCreateAdminModal();
    
    // Show success message
    if (typeof showToast === 'function') {
        showToast('success', 'fa-user-shield', `Admin ${username} created with ${permissions.length} permissions.`);
    } else {
        alert(`New admin account created for ${username} with ${permissions.length} permissions.`);
    }
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
                <button class="btn-action" onclick="openPermissionModal(${admin.id})">
                    <i class="fa-solid fa-user-gear"></i> View Details
                </button>
            </td>
        </tr>
    `).join('');
}

let currentEditingAdminId = null;

function openPermissionModal(adminId) {
    const admin = adminData.find(a => a.id === adminId);
    if (!admin) return;

    currentEditingAdminId = adminId;
    const modal = document.getElementById('permissionModal');
    const nameDisplay = document.getElementById('modalAdminName');
    const emailDisplay = document.getElementById('modalAdminEmail');
    const grid = document.getElementById('modalPermissionsGrid');

    if (modal && nameDisplay && grid) {
        nameDisplay.textContent = `${admin.name} — Details`;
        if (emailDisplay) emailDisplay.textContent = admin.email || `${admin.name}@campusbite.edu`;
        
        // Render Permissions Toggles
        const allPerms = [
            { id: 'editUsers', key: 'users', label: 'User Management' },
            { id: 'editTransactions', key: 'transactions', label: 'Transactions' },
            { id: 'editApps', key: 'apps', label: 'Applications' },
            { id: 'editComplaints', key: 'complaints', label: 'Complaints' },
            { id: 'editMenu', key: 'menu', label: 'Menu Control' },
            { id: 'editVouchers', key: 'vouchers', label: 'Voucher Control' }
        ];

        grid.innerHTML = allPerms.map(p => `
            <div class="perm-item">
              <label class="switch">
                <input type="checkbox" id="${p.id}" ${admin.permissions?.includes(p.key) ? 'checked' : ''}>
                <span class="slider round"></span>
              </label>
              <span>${p.label}</span>
            </div>
        `).join('');

        modal.style.display = 'flex';
    }
}

function saveAdminPermissions() {
    if (!currentEditingAdminId) return;
    
    const admin = adminData.find(a => a.id === currentEditingAdminId);
    if (admin) {
        const permissions = [];
        if (document.getElementById('editUsers').checked) permissions.push('users');
        if (document.getElementById('editTransactions').checked) permissions.push('transactions');
        if (document.getElementById('editApps').checked) permissions.push('apps');
        if (document.getElementById('editComplaints').checked) permissions.push('complaints');
        if (document.getElementById('editMenu').checked) permissions.push('menu');
        if (document.getElementById('editVouchers').checked) permissions.push('vouchers');

        admin.permissions = permissions;
        
        if (typeof showToast === 'function') {
            showToast('success', 'fa-check-circle', `Permissions updated for ${admin.name}`);
        } else {
            alert(`Permissions updated for ${admin.name}`);
        }
        closePermissionModal();
    }
}

function closePermissionModal() {
    const modal = document.getElementById('permissionModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingAdminId = null;
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('permissionModal');
    const createModal = document.getElementById('createAdminModal');
    const deactivateModal = document.getElementById('deactivateModal');
    const reactivateModal = document.getElementById('reactivateModal');

    if (e.target === modal) closePermissionModal();
    if (e.target === createModal) closeCreateAdminModal();
    if (e.target === deactivateModal) closeDeactivateModal();
    if (e.target === reactivateModal) closeReactivateModal();
});

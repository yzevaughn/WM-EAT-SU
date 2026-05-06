console.log('User Control JS Loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('User Control DOM Ready');
    
    // Mock Data
    let users = [
        { id: 'USR-1024', name: 'Reyes, Pedro', email: 'pedro.r@wm.edu.ph', type: 'Student', status: 'Active', joined: 'May 3, 2026' },
        { id: 'USR-1025', name: 'Santos, Maria', email: 'maria.s@wm.edu.ph', type: 'Staff', status: 'Active', joined: 'May 2, 2026' },
        { id: 'USR-1026', name: 'Dela Cruz, Juan', email: 'juan.dc@wm.edu.ph', type: 'Outsider', status: 'Deactivated', joined: 'May 1, 2026' },
        { id: 'USR-1027', name: 'Lopez, Elena', email: 'elena.l@wm.edu.ph', type: 'Student', status: 'Suspended', joined: 'Apr 30, 2026' },
        { id: 'USR-1028', name: 'Garcia, Jose', email: 'jose.g@wm.edu.ph', type: 'Staff', status: 'Active', joined: 'Apr 29, 2026' },
        { id: 'USR-1029', name: 'Zaragosa, Ana', email: 'ana.z@wm.edu.ph', type: 'Outsider', status: 'Active', joined: 'Apr 28, 2026' },
        { id: 'USR-1030', name: 'Mendoza, Luis', email: 'luis.m@wm.edu.ph', type: 'Student', status: 'Active', joined: 'Apr 27, 2026' },
        { id: 'USR-1031', name: 'Bautista, Rosa', email: 'rosa.b@wm.edu.ph', type: 'Staff', status: 'Deactivated', joined: 'Apr 26, 2026' },
        { id: 'USR-1032', name: 'Torres, Mark', email: 'mark.t@wm.edu.ph', type: 'Outsider', status: 'Suspended', joined: 'Apr 25, 2026' },
        { id: 'USR-1033', name: 'Villanueva, Clara', email: 'clara.v@wm.edu.ph', type: 'Student', status: 'Active', joined: 'Apr 24, 2026' },
        { id: 'USR-1034', name: 'Dimagiba, Bong', email: 'bong.d@wm.edu.ph', type: 'Staff', status: 'Active', joined: 'Apr 23, 2026' },
        { id: 'USR-1035', name: 'Pascual, Irene', email: 'irene.p@wm.edu.ph', type: 'Student', status: 'Deactivated', joined: 'Apr 22, 2026' },
        { id: 'USR-1036', name: 'Quinto, Roberto', email: 'roberto.q@wm.edu.ph', type: 'Outsider', status: 'Active', joined: 'Apr 21, 2026' },
        { id: 'USR-1037', name: 'Santiago, Linda', email: 'linda.s@wm.edu.ph', type: 'Staff', status: 'Active', joined: 'Apr 20, 2026' },
        { id: 'USR-1038', name: 'Aquino, Benjie', email: 'benjie.a@wm.edu.ph', type: 'Student', status: 'Active', joined: 'Apr 19, 2026' },
        { id: 'USR-1039', name: 'Dizon, Felicia', email: 'felicia.d@wm.edu.ph', type: 'Outsider', status: 'Deactivated', joined: 'Apr 18, 2026' },
        { id: 'USR-1040', name: 'Gomez, Ricardo', email: 'ricardo.g@wm.edu.ph', type: 'Staff', status: 'Suspended', joined: 'Apr 17, 2026' },
        { id: 'USR-1041', name: 'Navarro, Sofia', email: 'sofia.n@wm.edu.ph', type: 'Student', status: 'Active', joined: 'Apr 16, 2026' },
        { id: 'USR-1042', name: 'Ramos, Miguel', email: 'miguel.r@wm.edu.ph', type: 'Outsider', status: 'Active', joined: 'Apr 15, 2026' },
        { id: 'USR-1043', name: 'Cruz, Teresa', email: 'teresa.c@wm.edu.ph', type: 'Staff', status: 'Active', joined: 'Apr 14, 2026' },
    ];

    const tableBody = document.getElementById('userTableBody');
    const searchInput = document.getElementById('userSearch');
    const accountFilter = document.getElementById('accountFilter');
    const statusFilter = document.getElementById('statusFilter');
    const entriesDropdown = document.getElementById('entriesPerPage');

    let currentPage = 1;
    let entriesLimit = 10;

    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No users matching your criteria.</td></tr>';
            return;
        }

        // Handle pagination display (mock for now as per "entries" requirement)
        const start = 1;
        const end = Math.min(entriesLimit, data.length);
        
        const displayData = data.slice(0, entriesLimit);

        displayData.forEach(user => {
            const row = document.createElement('tr');
            
            let statusHtml = '';
            if (user.status === 'Active') {
                statusHtml = `<span class="premium-status active"><span class="status-dot-pulse"></span> ${user.status}</span>`;
            } else if (user.status === 'Deactivated') {
                statusHtml = `<span class="premium-status deactivated"><i class="fa-solid fa-clock-rotate-left"></i> ${user.status}</span>`;
            } else if (user.status === 'Suspended') {
                statusHtml = `<span class="premium-status suspended"><i class="fa-solid fa-triangle-exclamation"></i> ${user.status}</span>`;
            }

            row.innerHTML = `
                <td><span class="transaction-id">${user.id}</span></td>
                <td>
                    <div class="student-info">
                        <span class="student-name">${user.name}</span>
                        <span class="student-email">${user.email}</span>
                    </div>
                </td>
                <td><span class="badge-type">${user.type === 'Staff' ? 'Teacher & Staff' : user.type}</span></td>
                <td>${statusHtml}</td>
                <td>${user.joined}</td>
                <td>
                    <div class="action-buttons" style="display: flex; align-items: center; gap: 8px;">
                        ${user.status === 'Active' 
                            ? `<button class="btn-action danger" style="padding: 6px 12px; font-size: 11px; font-weight: 600;" onclick="openDeactivateModal('${user.id}')">Deactivate</button>` 
                            : `<button class="btn-action success" style="padding: 6px 12px; font-size: 11px; font-weight: 600;" onclick="openReactivateModal('${user.id}')">Reactivate</button>`
                        }
                        <button class="btn-action-icon" style="color: #64748b; background: none; border: none; cursor: pointer; font-size: 14px;" onclick="openSuspendModal('${user.id}')" title="Suspend User">
                            <i class="fa-solid fa-ban"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Update pagination info
        const totalEl = document.getElementById('totalEntries');
        const endEl = document.getElementById('pageEnd');
        const startEl = document.getElementById('pageStart');
        const pageNumbers = document.getElementById('pageNumbers');

        if (totalEl) totalEl.textContent = data.length;
        if (endEl) endEl.textContent = end;
        if (startEl) startEl.textContent = data.length > 0 ? 1 : 0;
        
        if (pageNumbers) {
            pageNumbers.innerHTML = data.length > 0 ? `<button class="page-btn active">1</button>` : '';
        }
    }

    function filterTable() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedType = accountFilter ? accountFilter.value : 'All';
        const selectedStatus = statusFilter ? statusFilter.value : 'All';

        const filteredData = users.filter(user => {
            const matchesSearch = user.id.toLowerCase().includes(searchTerm) || user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === 'All' || user.type === selectedType;
            const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
            return matchesSearch && matchesType && matchesStatus;
        });

        renderTable(filteredData);
    }

    // Modal Workflows
    window.openDeactivateModal = (id) => {
        const modal = document.getElementById('deactivateModal');
        if (modal) {
            document.getElementById('targetUserId').value = id;
            modal.style.display = 'flex';
        }
    };

    window.closeDeactivateModal = () => {
        const modal = document.getElementById('deactivateModal');
        if (modal) modal.style.display = 'none';
        document.getElementById('deactivationReason').value = '';
    };

    window.confirmDeactivate = () => {
        const id = document.getElementById('targetUserId').value;
        const reason = document.getElementById('deactivationReason').value;
        if (!reason) {
            alert('Please provide a reason for deactivation.');
            return;
        }
        const user = users.find(u => u.id === id);
        if (user) {
            user.status = 'Deactivated';
            filterTable();
            closeDeactivateModal();
        }
    };

    window.openReactivateModal = (id) => {
        const modal = document.getElementById('reactivateModal');
        if (modal) {
            document.getElementById('reactivateUserId').value = id;
            modal.style.display = 'flex';
        }
    };

    window.closeReactivateModal = () => {
        const modal = document.getElementById('reactivateModal');
        if (modal) modal.style.display = 'none';
    };

    window.confirmReactivate = () => {
        const id = document.getElementById('reactivateUserId').value;
        const user = users.find(u => u.id === id);
        if (user) {
            user.status = 'Active';
            filterTable();
            closeReactivateModal();
        }
    };

    window.openSuspendModal = (id) => {
        const modal = document.getElementById('suspendModal');
        if (modal) {
            document.getElementById('suspendUserId').value = id;
            modal.style.display = 'flex';
        }
    };

    window.closeSuspendModal = () => {
        const modal = document.getElementById('suspendModal');
        if (modal) modal.style.display = 'none';
        document.getElementById('suspensionReason').value = '';
    };

    window.confirmSuspend = () => {
        const id = document.getElementById('suspendUserId').value;
        const reason = document.getElementById('suspensionReason').value.trim();
        if (!reason) {
            alert('Please provide a reason for suspension.');
            return;
        }
        const user = users.find(u => u.id === id);
        if (user) {
            user.status = 'Suspended';
            user.reason = reason;
            filterTable();
            closeSuspendModal();
            if (typeof showToast === 'function') {
                showToast('Success', `Account ${id} has been suspended.`);
            }
        }
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (accountFilter) accountFilter.addEventListener('change', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);
    if (entriesDropdown) {
        entriesDropdown.addEventListener('change', (e) => {
            entriesLimit = parseInt(e.target.value);
            filterTable();
        });
    }

    // Initial render
    renderTable(users);
});

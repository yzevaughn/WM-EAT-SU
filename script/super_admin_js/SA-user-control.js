console.log('User Control JS Loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('User Control DOM Ready');

    // ── Mock Data ──────────────────────────────────────────
    let users = [
        { id: 'USR-1024', name: 'Reyes, Pedro',       email: 'pedro.r@wm.edu.ph',   type: 'Student',  status: 'Active',      joined: 'May 3, 2026' },
        { id: 'USR-1025', name: 'Santos, Maria',       email: 'maria.s@wm.edu.ph',   type: 'Staff',    status: 'Active',      joined: 'May 2, 2026' },
        { id: 'USR-1026', name: 'Dela Cruz, Juan',     email: 'juan.dc@wm.edu.ph',   type: 'Outsider', status: 'Deactivated', joined: 'May 1, 2026' },
        { id: 'USR-1027', name: 'Lopez, Elena',        email: 'elena.l@wm.edu.ph',   type: 'Student',  status: 'Suspended',   joined: 'Apr 30, 2026' },
        { id: 'USR-1028', name: 'Garcia, Jose',        email: 'jose.g@wm.edu.ph',    type: 'Staff',    status: 'Active',      joined: 'Apr 29, 2026' },
        { id: 'USR-1029', name: 'Zaragosa, Ana',       email: 'ana.z@wm.edu.ph',     type: 'Outsider', status: 'Active',      joined: 'Apr 28, 2026' },
        { id: 'USR-1030', name: 'Mendoza, Luis',       email: 'luis.m@wm.edu.ph',    type: 'Student',  status: 'Active',      joined: 'Apr 27, 2026' },
        { id: 'USR-1031', name: 'Bautista, Rosa',      email: 'rosa.b@wm.edu.ph',    type: 'Staff',    status: 'Deactivated', joined: 'Apr 26, 2026' },
        { id: 'USR-1032', name: 'Torres, Mark',        email: 'mark.t@wm.edu.ph',    type: 'Outsider', status: 'Suspended',   joined: 'Apr 25, 2026' },
        { id: 'USR-1033', name: 'Villanueva, Clara',   email: 'clara.v@wm.edu.ph',   type: 'Student',  status: 'Active',      joined: 'Apr 24, 2026' },
        { id: 'USR-1034', name: 'Dimagiba, Bong',      email: 'bong.d@wm.edu.ph',    type: 'Staff',    status: 'Active',      joined: 'Apr 23, 2026' },
        { id: 'USR-1035', name: 'Pascual, Irene',      email: 'irene.p@wm.edu.ph',   type: 'Student',  status: 'Deactivated', joined: 'Apr 22, 2026' },
        { id: 'USR-1036', name: 'Quinto, Roberto',     email: 'roberto.q@wm.edu.ph', type: 'Outsider', status: 'Active',      joined: 'Apr 21, 2026' },
        { id: 'USR-1037', name: 'Santiago, Linda',     email: 'linda.s@wm.edu.ph',   type: 'Staff',    status: 'Active',      joined: 'Apr 20, 2026' },
        { id: 'USR-1038', name: 'Aquino, Benjie',      email: 'benjie.a@wm.edu.ph',  type: 'Student',  status: 'Active',      joined: 'Apr 19, 2026' },
        { id: 'USR-1039', name: 'Dizon, Felicia',      email: 'felicia.d@wm.edu.ph', type: 'Outsider', status: 'Deactivated', joined: 'Apr 18, 2026' },
        { id: 'USR-1040', name: 'Gomez, Ricardo',      email: 'ricardo.g@wm.edu.ph', type: 'Staff',    status: 'Suspended',   joined: 'Apr 17, 2026' },
        { id: 'USR-1041', name: 'Navarro, Sofia',      email: 'sofia.n@wm.edu.ph',   type: 'Student',  status: 'Active',      joined: 'Apr 16, 2026' },
        { id: 'USR-1042', name: 'Ramos, Miguel',       email: 'miguel.r@wm.edu.ph',  type: 'Outsider', status: 'Active',      joined: 'Apr 15, 2026' },
        { id: 'USR-1043', name: 'Cruz, Teresa',        email: 'teresa.c@wm.edu.ph',  type: 'Staff',    status: 'Active',      joined: 'Apr 14, 2026' },
    ];

    const tableBody     = document.getElementById('userTableBody');
    const searchInput   = document.getElementById('userSearch');
    const accountFilter = document.getElementById('accountFilter');
    const statusFilter  = document.getElementById('statusFilter');
    const entriesDD     = document.getElementById('entriesPerPage');

    let currentPage  = 1;
    let entriesLimit = 10;
    let filtered     = [...users];

    // ── Status Badge HTML ──────────────────────────────────
    function statusBadge(status) {
        if (status === 'Active')
            return `<span class="premium-status active"><span class="status-dot-pulse"></span> Active</span>`;
        if (status === 'Deactivated')
            return `<span class="premium-status deactivated"><i class="fa-solid fa-circle-minus"></i> Deactivated</span>`;
        if (status === 'Suspended')
            return `<span class="premium-status suspended"><i class="fa-solid fa-triangle-exclamation"></i> Suspended</span>`;
        return `<span class="premium-status">${status}</span>`;
    }

    // ── Action Buttons Logic ───────────────────────────────
    function actionButtons(user) {
        const id = user.id;
        let primary = '';

        if (user.status === 'Active') {
            primary = `<button class="btn-action danger" onclick="openDeactivateModal('${id}')">Deactivate</button>`;
        } else if (user.status === 'Deactivated') {
            primary = `<button class="btn-action success" onclick="openReactivateModal('${id}')">Reactivate</button>`;
        } else if (user.status === 'Suspended') {
            primary = `<button class="btn-action success" onclick="openReactivateModal('${id}')">Restore</button>`;
        }

        // Suspend icon only shown when user is Active
        const suspendBtn = user.status === 'Active'
            ? `<button class="btn-action-icon" onclick="openSuspendModal('${id}')" title="Suspend User" style="color:#f59e0b; background:#fffbeb; border:1px solid #fde68a; padding:6px 10px; border-radius:8px; cursor:pointer; font-size:13px;">
                <i class="fa-solid fa-ban"></i>
               </button>`
            : '';

        return `<div class="action-buttons" style="display:flex;align-items:center;gap:8px;">${primary}${suspendBtn}</div>`;
    }

    // ── Render Table ───────────────────────────────────────
    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;">No users matching your criteria.</td></tr>`;
            updatePagination(0);
            return;
        }

        const totalPages = Math.ceil(filtered.length / entriesLimit);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIdx = (currentPage - 1) * entriesLimit;
        const endIdx   = Math.min(startIdx + entriesLimit, filtered.length);
        const pageData = filtered.slice(startIdx, endIdx);

        pageData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="transaction-id">${user.id}</span></td>
                <td>
                    <div class="student-info">
                        <span class="student-name">${user.name}</span>
                        <span class="student-email">${user.email}</span>
                    </div>
                </td>
                <td><span class="badge-type">${user.type === 'Staff' ? 'Teacher & Staff' : user.type}</span></td>
                <td>${statusBadge(user.status)}</td>
                <td>${user.joined}</td>
                <td>${actionButtons(user)}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePagination(filtered.length);
    }

    // ── Pagination UI ──────────────────────────────────────
    function updatePagination(total) {
        const totalPages  = Math.ceil(total / entriesLimit) || 1;
        const startEl     = document.getElementById('pageStart');
        const endEl       = document.getElementById('pageEnd');
        const totalEl     = document.getElementById('totalEntries');
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn     = document.getElementById('prevPage');
        const nextBtn     = document.getElementById('nextPage');

        const startIdx = total === 0 ? 0 : (currentPage - 1) * entriesLimit + 1;
        const endIdx   = Math.min(currentPage * entriesLimit, total);

        if (startEl)  startEl.textContent  = startIdx;
        if (endEl)    endEl.textContent    = endIdx;
        if (totalEl)  totalEl.textContent  = total;

        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

        if (pageNumbers) {
            let btns = '';
            for (let i = 1; i <= totalPages; i++) {
                btns += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            pageNumbers.innerHTML = btns;
        }
    }

    window.goToPage = (p) => {
        currentPage = p;
        renderTable();
    };

    // ── Filter Logic ───────────────────────────────────────
    function applyFilters() {
        const term   = searchInput  ? searchInput.value.toLowerCase()  : '';
        const type   = accountFilter ? accountFilter.value             : 'All';
        const status = statusFilter  ? statusFilter.value              : 'All';

        filtered = users.filter(u => {
            const matchSearch = u.id.toLowerCase().includes(term)   ||
                                u.name.toLowerCase().includes(term) ||
                                u.email.toLowerCase().includes(term);
            const matchType   = type   === 'All' || u.type   === type;
            const matchStatus = status === 'All' || u.status === status;
            return matchSearch && matchType && matchStatus;
        });

        currentPage = 1;
        renderTable();
    }

    // ── Validation Helper (no browser alert) ──────────────
    function showValidation(msg) {
        let el = document.getElementById('_uc_validation');
        if (!el) {
            el = document.createElement('div');
            el.id = '_uc_validation';
            el.style.cssText = `
                position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
                background:#1e293b; color:#fff; padding:12px 24px;
                border-radius:12px; font-size:14px; font-weight:600;
                box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:999999;
                display:flex; align-items:center; gap:10px;
                animation: slideUpFade 0.3s ease;
            `;
            document.body.appendChild(el);
        }
        el.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color:#f59e0b;"></i> ${msg}`;
        el.style.display = 'flex';
        clearTimeout(el._timer);
        el._timer = setTimeout(() => { el.style.display = 'none'; }, 3500);
    }

    // ── Deactivate Modal ───────────────────────────────────
    window.openDeactivateModal = (id) => {
        const modal = document.getElementById('deactivateModal');
        if (modal) { document.getElementById('targetUserId').value = id; modal.style.display = 'flex'; }
    };
    window.closeDeactivateModal = () => {
        const modal = document.getElementById('deactivateModal');
        if (modal) modal.style.display = 'none';
        document.getElementById('deactivationReason').value = '';
    };
    window.confirmDeactivate = () => {
        const id     = document.getElementById('targetUserId').value;
        const reason = document.getElementById('deactivationReason').value.trim();
        if (!reason) { showValidation('Please provide a reason for deactivation.'); return; }
        const user = users.find(u => u.id === id);
        if (user) { user.status = 'Deactivated'; user.reason = reason; applyFilters(); closeDeactivateModal(); }
    };

    // ── Reactivate Modal ───────────────────────────────────
    window.openReactivateModal = (id) => {
        const modal = document.getElementById('reactivateModal');
        if (modal) { document.getElementById('reactivateUserId').value = id; modal.style.display = 'flex'; }
    };
    window.closeReactivateModal = () => {
        const modal = document.getElementById('reactivateModal');
        if (modal) modal.style.display = 'none';
    };
    window.confirmReactivate = () => {
        const id   = document.getElementById('reactivateUserId').value;
        const user = users.find(u => u.id === id);
        if (user) { user.status = 'Active'; delete user.reason; applyFilters(); closeReactivateModal(); }
    };

    // ── Suspend Modal ──────────────────────────────────────
    window.openSuspendModal = (id) => {
        const modal = document.getElementById('suspendModal');
        if (modal) { document.getElementById('suspendUserId').value = id; modal.style.display = 'flex'; }
    };
    window.closeSuspendModal = () => {
        const modal = document.getElementById('suspendModal');
        if (modal) modal.style.display = 'none';
        document.getElementById('suspensionReason').value = '';
    };
    window.confirmSuspend = () => {
        const id     = document.getElementById('suspendUserId').value;
        const reason = document.getElementById('suspensionReason').value.trim();
        if (!reason) { showValidation('Please provide a reason for suspension.'); return; }
        const user = users.find(u => u.id === id);
        if (user) { user.status = 'Suspended'; user.reason = reason; applyFilters(); closeSuspendModal(); }
    };

    // Close modals when clicking backdrop
    ['deactivateModal','reactivateModal','suspendModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', (e) => { if (e.target === el) el.style.display = 'none'; });
    });

    // ── Event Listeners ────────────────────────────────────
    if (searchInput)   searchInput.addEventListener('input', applyFilters);
    if (accountFilter) accountFilter.addEventListener('change', applyFilters);
    if (statusFilter)  statusFilter.addEventListener('change', applyFilters);
    if (entriesDD) {
        entriesDD.addEventListener('change', (e) => {
            entriesLimit = parseInt(e.target.value);
            currentPage  = 1;
            renderTable();
        });
    }

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filtered.length / entriesLimit);
        if (currentPage < totalPages) { currentPage++; renderTable(); }
    });

    // ── Init ───────────────────────────────────────────────
    filtered = [...users];
    renderTable();
});

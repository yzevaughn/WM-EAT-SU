document.addEventListener('DOMContentLoaded', () => {

  /* ── Date Display ───────────────────────── */
  const now = new Date();
  const dateEl = document.getElementById('dashDate');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  /* ── KPI Summary Cards ───────────────────── */
  function renderSummaryCards() {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('totalCanteensValue',    12);
    set('studentVendorsValue',   48);
    set('pendingPaymentsValue',  '₱24.5K');
    set('openComplaintsValue',    5);
  }

  /* ── Top Earning Vendors ─────────────────── */
  const earnings = [
    { rank: '1',  rankClass: 'gold',   name: 'Canteen A - Main',     amount: '₱88,200', progress: 95, color: '#3b82f6' },
    { rank: '2',  rankClass: 'silver', name: 'Canteen B - Annex',    amount: '₱58,900', progress: 75, color: '#8b5cf6' },
    { rank: '3',  rankClass: 'bronze', name: 'Lani Cruz (Student)',   amount: '₱54,700', progress: 65, color: '#14b8a6' },
    { rank: '4',  rankClass: '',       name: 'Canteen C - Science',   amount: '₱44,300', progress: 55, color: '#6366f1' },
    { rank: '5',  rankClass: '',       name: 'Rex Bohol (Student)',   amount: '₱33,150', progress: 40, color: '#f59e0b' },
  ];

  function renderEarningsList() {
    const el = document.getElementById('earning-list');
    if (!el) return;
    el.innerHTML = earnings.map(item => `
      <div class="earning-item">
        <div class="earning-rank ${item.rankClass}">#${item.rank}</div>
        <div class="earning-info">
          <span class="earning-name">${item.name}</span>
          <div class="progress-container">
            <div class="progress-bar" style="width:${item.progress}%; background:${item.color}"></div>
          </div>
        </div>
        <span class="amount">${item.amount}</span>
      </div>
    `).join('');
  }

  /* ── Payment Due Tracking ────────────────── */
  let payments = [
    { id: 1, name: 'Canteen D - Engineering', due: 'Due Apr 30 · OVERDUE',     amount: '₱5,000', status: 'unclear' },
    { id: 2, name: 'Canteen A - Main',         due: 'Due May 05 · 1 day left', amount: '₱7,500', status: 'unclear' },
    { id: 3, name: 'Canteen B - Annex',        due: 'Due May 07 · 3 days left',amount: '₱6,000', status: 'unclear' },
    { id: 4, name: 'Canteen C - Science',      due: 'Due May 15 · 11 days',    amount: '₱4,500', status: 'unclear' },
    { id: 5, name: 'Canteen E - Arts',         due: 'Paid May 01 ✓',           amount: '₱3,200', status: 'clear'   },
  ];

  function renderPaymentList() {
    const el = document.getElementById('payment-list');
    if (!el) return;
    el.innerHTML = payments.map(item => `
      <div class="payment-item">
        <div class="status-dot" style="background:${item.status === 'clear' ? 'var(--green-dark)' : 'var(--rose-dark)'}"></div>
        <div class="payment-info">
          <span class="payment-name">${item.name}</span>
          <span class="payment-due">${item.due}</span>
        </div>
        <span class="payment-badge status-${item.status}">${item.status.toUpperCase()}</span>
        <button class="btn-status-toggle" onclick="togglePaymentStatus(${item.id})" title="Toggle Status">
          <i class="fa-solid fa-rotate"></i>
        </button>
      </div>
    `).join('');
  }

  window.togglePaymentStatus = (id) => {
    const p = payments.find(x => x.id === id);
    if (p) {
      p.status = p.status === 'clear' ? 'unclear' : 'clear';
      renderPaymentList();
    }
  };

  /* ── Recent Activity ─────────────────────── */
  const activities = [
    { title: 'New canteen application received', detail: 'Canteen D - Gardens is now pending review.', time: '10 mins ago' },
    { title: 'Payment overdue alert',            detail: 'Canteen A - Main has a delayed settlement.',  time: '1 hr ago'   },
    { title: 'Complaint escalated',              detail: 'Order #ORD-2026-1549 requires follow-up.',    time: '2 hrs ago'  },
    { title: 'Student vendor approved',          detail: 'Lani Cruz vendor account successfully verified.', time: 'Yesterday' },
  ];

  function renderActivityList() {
    const el = document.getElementById('activity-list');
    if (!el) return;
    el.innerHTML = activities.map(item => `
      <div class="activity-item">
        <div class="activity-meta">
          <span class="activity-title">${item.title}</span>
          <span class="activity-time">${item.time}</span>
        </div>
        <p class="activity-detail">${item.detail}</p>
      </div>
    `).join('');
  }

  /* ── Initial Render ──────────────────────── */
  renderSummaryCards();
  renderEarningsList();
  renderPaymentList();
  renderActivityList();
});

/**
 * admin-notifications-mock.js
 * Populates mock admin notifications if none exist.
 */
document.addEventListener('DOMContentLoaded', () => {
    const role = 'admin';
    const existing = getNotificationsForRole('admin');
    if (existing.length === 0) {
        // ... (existing admin mock)
        addNotification({
            role: 'admin',
            type: 'complaint_received',
            title: 'New Complaint Received ⚠️',
            desc: 'Complaint #CMP-2026-001 received: Wrong side dish received. Tap to review details.',
            icon: 'fa-circle-exclamation',
            color: 'orange',
            link: 'complaints.html'
        });
        
        addNotification({
            role: 'admin',
            type: 'new_application',
            title: 'New Canteen Application',
            desc: 'Spicy Dragon Kitchen has submitted a new vendor application for approval.',
            icon: 'fa-store',
            color: 'blue',
            link: 'canteen-applications.html'
        });

        addNotification({
            role: 'admin',
            type: 'complaint_resolved',
            title: 'Complaint Resolved ✅',
            desc: 'Complaint #CMP-2026-003 for "Gomez, Elena" has been successfully resolved.',
            icon: 'fa-check-circle',
            color: 'green',
            link: 'complaints.html'
        });
    }

    const existingSuper = getNotificationsForRole('super_admin');
    if (existingSuper.length === 0) {
        addNotification({
            role: 'super_admin',
            type: 'general',
            title: 'System Health Check 🛡️',
            desc: 'All systems are operational. Backup completed at 03:00 AM.',
            icon: 'fa-shield-halved',
            color: 'green',
            link: 'super-dashboard.html'
        });

        addNotification({
            role: 'super_admin',
            type: 'new_application',
            title: 'New Student Application',
            desc: 'A new student vendor application requires your final review.',
            icon: 'fa-user-check',
            color: 'blue',
            link: 'student-applications.html'
        });

        addNotification({
            role: 'super_admin',
            type: 'general',
            title: 'Monthly Report Ready 📊',
            desc: 'The April 2026 revenue and analytics report is now available for download.',
            icon: 'fa-chart-pie',
            color: 'orange',
            link: 'super-dashboard.html'
        });
    }
});

/**
 * super-notif.js
 * Super Admin specific notification logic.
 * Keeps notifications.js clean.
 */
(function() {
    // Override detectRole for Super Admin context
    const originalDetectRole = window.detectRole;
    window.detectRole = function() {
        const p = window.location.pathname;
        if (p.includes("/pages/super_admin/")) return "super_admin";
        return originalDetectRole ? originalDetectRole() : "student";
    };

    // Override renderNavbarNotifications to fix the footer link
    const originalRender = window.renderNavbarNotifications;
    window.renderNavbarNotifications = function(role, opts) {
        if (!originalRender) return;
        
        // Execute original
        originalRender(role, opts);
        
        // Post-render fix for Super Admin link
        if (role === "super_admin") {
            const listEl = opts?.listEl || document.querySelector(".notification-list");
            const footerLink = listEl?.closest(".notification-menu")?.querySelector(".notification-footer a");
            if (footerLink) {
                footerLink.href = "super-admin-notifications.html";
            }
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const role = detectRole();
        if (role !== "super_admin") return;

        const opts = {
            listEl: document.querySelector(".notification-list"),
            badgeEl: document.querySelector(".notification-badge"),
            markReadEl: document.querySelector(".mark-read-btn"),
        };
        
        if (opts.listEl) {
            renderNavbarNotifications(role, opts);
        }

        // Full page container check
        const superNotifContainer = document.getElementById('superAdminNotifContainer');
        if (superNotifContainer) {
            renderNotificationsPage(role, superNotifContainer);
        }
    });
})();

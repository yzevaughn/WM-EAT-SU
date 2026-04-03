document.querySelectorAll(".role-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // 1. Interactive Design: Instantly visually update the active button
    document
      .querySelectorAll(".role-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const role = btn.dataset.role;

    // 2. Wait a moment for the button animation, then switch pages
    if (role === "vendor") {
      setTimeout(() => {
        window.location.href = "../vendor-pages/vendor-dashboard.html";
      }, 500); // reduced delay to half a second
    } else if (role === "student") {
      setTimeout(() => {
        window.location.href = "student-dashboard.html";
      }, 500);
    }
  });
});
/* ═══════════════════════════════════════
       MOBILE SIDEBAR OVERLAY
       ═══════════════════════════════════════ */
document.getElementById("sidebarOverlay").onclick = function () {
  document.getElementById("menu-checkbox").checked = false;
};

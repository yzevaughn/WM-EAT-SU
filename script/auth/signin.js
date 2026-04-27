// ── Helpers ──────────────────────────────────────────────
function showGA(msg, type = "err") {
  const errEl = document.getElementById("gAlert");
  const okEl = document.getElementById("gOk");

  errEl.classList.remove("show");
  okEl.classList.remove("show");

  if (type === "ok") {
    document.getElementById("gOkMsg").textContent = msg;
    okEl.classList.add("show");
  } else {
    document.getElementById("gMsg").textContent = msg;
    errEl.classList.add("show");
  }
}

function fErr(id, msg) {
  const el = document.getElementById("ferr-" + id);
  if (!el) return;

  el.classList.add("show");
  el.querySelector("span").textContent = msg;

  const inp = document.getElementById(id);
  if (inp) inp.classList.add("err");
}

function fClr(id) {
  const el = document.getElementById("ferr-" + id);
  if (el) el.classList.remove("show");

  const inp = document.getElementById(id);
  if (inp) {
    inp.classList.remove("err");
    inp.classList.remove("ok");
  }
}

function fOk(id) {
  const inp = document.getElementById(id);
  if (inp) {
    inp.classList.remove("err");
    inp.classList.add("ok");
  }
}

function v(id) {
  return document.getElementById(id).value.trim();
}

// ── Toggle password ───────────────────────────────────────
function togglePw() {
  const inp = document.getElementById("password");
  const ico = document.getElementById("eyeIco");

  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  ico.className = "fa-solid " + (show ? "fa-eye-slash" : "fa-eye");
}

// ── Sign in logic ─────────────────────────────────────────
function signIn() {
  ["email", "password"].forEach(fClr);

  document.getElementById("gAlert").classList.remove("show");
  document.getElementById("gOk").classList.remove("show");

  const em = v("email");
  const pw = document.getElementById("password").value;

  let ok = true;

  // ✅ Email validation (basic only — allows admin123)
  if (!em || (!em.includes("@") && em !== "admin123")) {
    fErr("email", "Enter a valid email or admin ID");
    ok = false;
  } else {
    fOk("email");
  }

  // ✅ Password validation
  if (!pw) {
    fErr("password", "Password is required.");
    ok = false;
  } else if (pw.length < 6) {
    fErr("password", "Minimum 6 characters.");
    ok = false;
  } else {
    fOk("password");
  }

  if (!ok) {
    showGA("Please enter your login details to continue.");
    return;
  }

  // ── Simulate auth ──────────────────────────────────────
  const btn = document.getElementById("signInBtn");
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Signing in…';

  setTimeout(() => {
    // 🔐 ADMIN LOGIN
    if (em === "admin123" && pw === "admin123") {
      showGA("Admin signed in successfully! Redirecting…", "ok");
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Welcome Admin!';

      // optional: store session
      sessionStorage.setItem("role", "admin");

      setTimeout(() => {
        window.location.href = "../admin/admin-dashboard.html";
      }, 1000);

      return;
    }

    //  STUDENT LOGIN (any WMSU email)
    if (/@wmsu\.edu\.ph$/.test(em)) {
      showGA("Student signed in successfully! Redirecting…", "ok");
      btn.innerHTML =
        '<i class="fa-solid fa-circle-check"></i> Welcome Student!';

      // optional: store session
      sessionStorage.setItem("role", "student");
      sessionStorage.setItem("email", em);

      setTimeout(() => {
        window.location.href = "../student/student-dashboard.html";
      }, 1000);

      return;
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
    showGA("Invalid credentials. Use WMSU email.");
  }, 1200);
}

// ── Enter key support ─────────────────────────────────────
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") signIn();
});

// ── Clear errors on input ─────────────────────────────────
["email", "password"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => fClr(id));
  }
});

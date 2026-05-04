// =========================
// UI HELPERS
// =========================

function showGA(message, type = "err") {
  const el = document.getElementById("gAlert");
  const msg = document.getElementById("gMsg");

  if (!el || !msg) return;

  el.className = "alert alert-" + type + " show";
  msg.textContent = message;
}

function setError(id, message) {
  const wrapper = document.getElementById("ferr-" + id);
  const input = document.getElementById(id);

  if (!wrapper || !input) return;

  wrapper.classList.add("show");
  wrapper.querySelector("span").textContent = message;

  input.classList.add("err");
  input.classList.remove("ok");
}

function clearError(id) {
  const wrapper = document.getElementById("ferr-" + id);
  const input = document.getElementById(id);

  if (!wrapper || !input) return;

  wrapper.classList.remove("show");
  input.classList.remove("err", "ok");
}

function setOk(id) {
  const input = document.getElementById(id);
  if (!input) return;

  input.classList.remove("err");
  input.classList.add("ok");
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// =========================
// FORM SUBMISSION
// =========================

function submitOutsiderInfo() {
  let valid = true;

  // Clear all previous errors
  ["firstName", "lastName", "email", "mobile", "password", "confirmPassword"].forEach(clearError);

  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const email = getValue("email");
  const mobile = getValue("mobile");
  const password = document.getElementById("password") ? document.getElementById("password").value : "";
  const confirmPassword = document.getElementById("confirmPassword") ? document.getElementById("confirmPassword").value : "";

  // FIRST NAME
  if (!firstName) {
    setError("firstName", "First name is required.");
    valid = false;
  } else setOk("firstName");

  // LAST NAME
  if (!lastName) {
    setError("lastName", "Last name is required.");
    valid = false;
  } else setOk("lastName");

  // EMAIL
  if (!email) {
    setError("email", "Email address is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "Invalid email format.");
    valid = false;
  } else {
    setOk("email");
  }

  // MOBILE
  if (!mobile) {
    setError("mobile", "Mobile number is required.");
    valid = false;
  } else if (!/^09\d{9}$/.test(mobile.replace(/\s+/g, ""))) {
    setError("mobile", "Enter a valid 11-digit number.");
    valid = false;
  } else {
    setOk("mobile");
  }

  // PASSWORD
  if (!password) {
    setError("password", "Password is required.");
    valid = false;
  } else if (password.length < 6) {
    setError("password", "Minimum 6 characters.");
    valid = false;
  } else {
    setOk("password");
  }

  // CONFIRM PASSWORD
  if (!confirmPassword) {
    setError("confirmPassword", "Please confirm your password.");
    valid = false;
  } else if (password !== confirmPassword) {
    setError("confirmPassword", "Passwords do not match.");
    valid = false;
  } else {
    setOk("confirmPassword");
  }

  if (!valid) {
    showGA("Please fix the errors before continuing.");
    return;
  }

  // Save data
  sessionStorage.setItem("userEmail", email);
  sessionStorage.setItem("userMobile", mobile);
  sessionStorage.setItem("signup_role", "outsider");
  sessionStorage.setItem("outsider_firstName", firstName);
  sessionStorage.setItem("outsider_lastName", lastName);

  // Redirect to verification step
  window.location.href = "outsider-verify.html";
}

// =========================
// PASSWORD TOGGLE
// =========================

function togglePw(inputId, iconId) {
  const input = document.getElementById(inputId || "password");
  const icon = document.getElementById(iconId || "eyeIco");

  if (!input || !icon) return;

  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";
  icon.className = "fa-solid " + (isHidden ? "fa-eye-slash" : "fa-eye");
}

// =========================
// PASSWORD STRENGTH
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const val = this.value;

      // Reset bars
      for (let i = 1; i <= 5; i++) {
        const seg = document.getElementById("ps" + i);
        if (seg) seg.className = "pw-seg";
      }

      const label = document.getElementById("pwLbl");

      let score = 0;

      if (val.length >= 6) score++;
      if (val.length >= 8) score++;
      if (/[A-Za-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val) || val.length >= 12) score++;

      if (score > 5) score = 5;

      const labels = ["—", "Weak", "Fair", "Good", "Very Good", "Strong"];
      const colors = [
        "#9ca3af",
        "#ef4444",
        "#f97316",
        "#eab308",
        "#84cc16",
        "#22c55e",
      ];

      // Fill bars progressively
      for (let i = 1; i <= score; i++) {
        const seg = document.getElementById("ps" + i);
        if (seg) {
          seg.style.background = colors[score];
          seg.classList.add("filled"); // Optional class for styling
        }
      }

      if (label) {
        label.textContent = labels[score];
        label.style.color = colors[score];
      }
    });
  }
});

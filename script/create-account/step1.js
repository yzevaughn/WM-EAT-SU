// =========================
// UI HELPERS
// =========================

function showGA(message, type = "err") {
  const el = document.getElementById("gAlert");
  const msg = document.getElementById("gMsg");

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
  return document.getElementById(id).value.trim();
}

// =========================
// FORM SUBMISSION
// =========================

function submitStep1() {
  let valid = true;

  // Clear all previous errors
  ["firstName", "lastName", "email", "mobile", "password"].forEach(clearError);

  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const email = getValue("email");
  const mobile = getValue("mobile");
  const password = document.getElementById("password").value;

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
    setError("email", "School email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "Invalid email format.");
    valid = false;
  } else if (!/@wmsu\.edu\.ph$/.test(email)) {
    setError("email", "Must be a school email (@wmsu.edu.ph).");
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

  if (!valid) {
    showGA("Please fix the errors before continuing.");
    return;
  }

  // Save email
  sessionStorage.setItem("userEmail", email);

  // Redirect to next step
  window.location.href = "signUp-step2.html";
}

// =========================
// PASSWORD TOGGLE
// =========================

function togglePw() {
  const input = document.getElementById("password");
  const icon = document.getElementById("eyeIco");

  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";
  icon.className = "fa-solid " + (isHidden ? "fa-eye-slash" : "fa-eye");
}

// =========================
// PASSWORD STRENGTH
// =========================

const passwordInput = document.getElementById("password");

passwordInput.addEventListener("input", function () {
  const val = this.value;

  // Reset bars
  for (let i = 1; i <= 5; i++) {
    document.getElementById("ps" + i).className = "pw-seg";
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

  // Fill bars progressively (correct behavior)
  for (let i = 1; i <= score; i++) {
    document.getElementById("ps" + i).style.background = colors[score];
  }

  label.textContent = labels[score];
  label.style.color = colors[score];
});

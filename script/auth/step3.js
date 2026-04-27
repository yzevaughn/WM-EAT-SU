let cdInt = null;
const OTP = "1234";

// ==========================
// ON LOAD
// ==========================
window.onload = function () {
  const savedEmail = sessionStorage.getItem("userEmail");
  if (savedEmail) {
    const el = document.getElementById("emailDisp");
    if (el) el.textContent = savedEmail;
  }

  startCD(60);

  // focus first OTP box
  document.querySelector(".otp-in")?.focus();
};

// ==========================
// GLOBAL ALERT
// ==========================
function showGA(m, type = "err") {
  const el = document.getElementById("gAlert");
  if (el) {
    el.className = "alert alert-" + type + " show";
    const msg = document.getElementById("gMsg");
    if (msg) msg.textContent = m;
  }
}

// ==========================
// FIELD ERROR
// ==========================
function fErr(id, m) {
  const el = document.getElementById("ferr-" + id);
  if (!el) return;

  el.classList.add("show");
  el.querySelector("span").textContent = m;
}

function fClr(id) {
  const el = document.getElementById("ferr-" + id);
  if (el) el.classList.remove("show");
}

// ==========================
// VERIFY OTP
// ==========================
function verifyOTP(e) {
  if (e) e.preventDefault();

  const inps = document.querySelectorAll(".otp-in");
  const code = Array.from(inps)
    .map((i) => i.value)
    .join("");

  fClr("otp");
  const otpOk = document.getElementById("otpOk");
  if (otpOk) otpOk.classList.remove("show");

  if (code.length < 4) {
    fErr("otp", "Enter the complete 4-digit code.");
    shakeOTP();
    return;
  }

  if (code !== OTP) {
    fErr("otp", "Incorrect code. Try again or resend.");
    shakeOTP();
    return;
  }

  // ✅ SUCCESS
  if (otpOk) otpOk.classList.add("show");

  setTimeout(() => {
    window.location.href = "signup-step4.html";
  }, 800);
}

// ==========================
// SHAKE EFFECT
// ==========================
function shakeOTP() {
  const grid = document.getElementById("otpGrid");
  if (grid) {
    grid.classList.add("shake");
    setTimeout(() => {
      grid.classList.remove("shake");
    }, 300);
  }
}

// ==========================
// OTP INPUT LOGIC
// ==========================
document.querySelectorAll(".otp-in").forEach((inp, i, arr) => {
  // typing
  inp.addEventListener("input", () => {
    inp.value = inp.value.replace(/\D/, "");
    inp.classList.toggle("filled", !!inp.value);

    // move forward
    if (inp.value && i < arr.length - 1) {
      arr[i + 1].focus();
    }

    // 🔥 auto verify when all filled
    if (Array.from(arr).every((el) => el.value)) {
      verifyOTP();
    }
  });

  // backspace
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !inp.value && i > 0) {
      arr[i - 1].focus();
    }
  });

  // paste
  inp.addEventListener("paste", (e) => {
    const t = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "");

    if (t.length >= arr.length) {
      e.preventDefault();

      arr.forEach((el, j) => {
        el.value = t[j] || "";
        el.classList.toggle("filled", !!el.value);
      });

      arr[arr.length - 1].focus();
      verifyOTP();
    }
  });
});

// ==========================
// COUNTDOWN TIMER
// ==========================
function startCD(s) {
  clearInterval(cdInt);

  const btn = document.getElementById("resendBtn");
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = 'Resend in <span id="cd">' + s + "s</span>";

  let t = s;

  cdInt = setInterval(() => {
    t--;

    const el = document.getElementById("cd");
    if (el) el.textContent = t + "s";

    if (t <= 0) {
      clearInterval(cdInt);
      btn.disabled = false;
      btn.textContent = "Resend Code";
    }
  }, 1000);
}

// ==========================
// RESEND CODE
// ==========================
function resendCode() {
  document.querySelectorAll(".otp-in").forEach((i) => {
    i.value = "";
    i.classList.remove("filled");
  });

  fClr("otp");
  const otpOk = document.getElementById("otpOk");
  if (otpOk) otpOk.classList.remove("show");

  startCD(60);
  showGA("A new code has been sent to your email.", "ok");

  setTimeout(() => {
    const gAlert = document.getElementById("gAlert");
    if (gAlert) gAlert.classList.remove("show");
  }, 3500);
}

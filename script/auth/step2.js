/* ============================================================
   step2.js  —  Camera Capture for Verification Documents
   Uses getUserMedia for live camera feed, canvas for snapshot
   ============================================================ */

// ── State ────────────────────────────────────────────────────
let currentTarget = null;   // 'coe' or 'id'
let camStream     = null;   // active MediaStream
let capturedBlob  = null;   // captured image as Blob
const captured    = { coe: null, id: null }; // stored DataURLs per doc

// ── DOM refs ─────────────────────────────────────────────────
const overlay        = () => document.getElementById('camOverlay');
const video          = () => document.getElementById('camVideo');
const canvas         = () => document.getElementById('camCanvas');
const snapshot       = () => document.getElementById('camSnapshot');
const viewfinder     = () => document.getElementById('camViewfinder');
const snapshotWrap   = () => document.getElementById('camSnapshotWrap');
const camError       = () => document.getElementById('camError');
const captureBtn     = () => document.getElementById('captureBtn');
const retakeCamBtn   = () => document.getElementById('retakeCamBtn');
const confirmCamBtn  = () => document.getElementById('confirmCamBtn');
const camModalTitle  = () => document.getElementById('camModalTitle');

// ── Open Camera ───────────────────────────────────────────────
async function openCamera(target) {
  currentTarget = target;
  capturedBlob  = null;

  // Title
  const labels = { coe: 'Certificate of Enrollment', id: 'School ID' };
  camModalTitle().innerHTML = `<i class="fa-solid fa-camera"></i> ${labels[target]}`;

  // Reset modal state
  showLive();

  // Show overlay
  overlay().classList.add('active');
  document.body.style.overflow = 'hidden';

  // Start camera
  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video().srcObject = camStream;
    video().play();
  } catch (err) {
    console.error('Camera error:', err);
    showError(err.name === 'NotAllowedError'
      ? 'Camera permission denied. Please allow camera access in your browser settings, or upload a file instead.'
      : 'Could not access camera. Please try again or upload a file instead.'
    );
  }
}

// ── Capture Photo ─────────────────────────────────────────────
function capturePhoto() {
  const vid = video();
  const cvs = canvas();

  cvs.width  = vid.videoWidth  || 640;
  cvs.height = vid.videoHeight || 480;

  const ctx = cvs.getContext('2d');
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  // Freeze the feed
  stopStream();

  // Show snapshot
  const dataUrl = cvs.toDataURL('image/jpeg', 0.92);
  snapshot().src = dataUrl;
  capturedBlob = dataUrl;

  snapshotWrap().style.display = 'block';
  viewfinder().style.display   = 'none';

  captureBtn().style.display  = 'none';
  retakeCamBtn().style.display  = 'inline-flex';
  confirmCamBtn().style.display = 'inline-flex';
}

// ── Retake (inside modal) ─────────────────────────────────────
async function retakeCam() {
  capturedBlob = null;
  showLive();

  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video().srcObject = camStream;
    video().play();
  } catch (err) {
    showError('Could not restart camera.');
  }
}

// ── Confirm photo → apply to zone ────────────────────────────
function confirmPhoto() {
  if (!capturedBlob || !currentTarget) return;

  captured[currentTarget] = capturedBlob;

  // Show preview in the zone
  const imgEl  = document.getElementById(currentTarget + 'ImgTag');
  const prevEl = document.getElementById(currentTarget + 'PrevImg');
  const idleEl = document.getElementById(currentTarget + 'Idle');
  const zone   = document.getElementById(currentTarget + 'Zone');

  imgEl.src = capturedBlob;
  prevEl.style.display = 'flex';
  idleEl.style.display = 'none';
  zone.classList.add('done');

  fClr(currentTarget);
  closeCamera();
}

// ── Fallback file upload (when camera denied) ─────────────────
function fallbackFileSelected() {
  const input = document.getElementById('camFallbackInput');
  const file  = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    capturedBlob = e.target.result;
    snapshot().src = capturedBlob;
    snapshotWrap().style.display = 'block';
    camError().style.display     = 'none';
    retakeCamBtn().style.display  = 'none';
    confirmCamBtn().style.display = 'inline-flex';
    captureBtn().style.display    = 'none';
  };
  reader.readAsDataURL(file);
}

// ── Close camera overlay ──────────────────────────────────────
function closeCamera() {
  stopStream();
  overlay().classList.remove('active');
  document.body.style.overflow = '';
  currentTarget = null;
  capturedBlob  = null;
}

// ── Helpers ───────────────────────────────────────────────────
function stopStream() {
  if (camStream) {
    camStream.getTracks().forEach(t => t.stop());
    camStream = null;
  }
}

function showLive() {
  viewfinder().style.display    = 'block';
  snapshotWrap().style.display  = 'none';
  camError().style.display      = 'none';
  captureBtn().style.display    = 'inline-flex';
  retakeCamBtn().style.display  = 'none';
  confirmCamBtn().style.display = 'none';
}

function showError(msg) {
  stopStream();
  viewfinder().style.display    = 'none';
  snapshotWrap().style.display  = 'none';
  camError().style.display      = 'flex';
  captureBtn().style.display    = 'none';
  retakeCamBtn().style.display  = 'none';
  confirmCamBtn().style.display = 'none';
  document.getElementById('camErrorMsg').textContent = msg;
}

// ── Close on overlay click ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  overlay().addEventListener('click', function (e) {
    if (e.target === this) closeCamera();
  });
});

// ── Field error helpers ───────────────────────────────────────
function fErr(id, message) {
  const wrapper = document.getElementById('ferr-' + id);
  if (!wrapper) return;
  wrapper.classList.add('show');
  wrapper.querySelector('span').textContent = message;
}

function fClr(id) {
  const wrapper = document.getElementById('ferr-' + id);
  if (wrapper) wrapper.classList.remove('show');
}

// ── Global alert ──────────────────────────────────────────────
function showGA(message, type = 'err') {
  const el  = document.getElementById('gAlert');
  const msg = document.getElementById('gMsg');
  el.className = 'alert alert-' + type + ' show';
  msg.textContent = message;
}

// ── Step 2 submit ─────────────────────────────────────────────
function submitStep2() {
  fClr('coe');
  fClr('id');
  let valid = true;

  if (!captured.coe) {
    fErr('coe', 'Please take a photo of your Certificate of Enrollment.');
    valid = false;
  }
  if (!captured.id) {
    fErr('id', 'Please take a photo of your School ID.');
    valid = false;
  }
  if (!valid) {
    showGA('Please capture all required documents.');
    return;
  }

  const email = sessionStorage.getItem('userEmail');
  if (!email) {
    showGA('Session expired. Please go back to Step 1.');
    return;
  }

  window.location.href = 'signup-step3.html';
}

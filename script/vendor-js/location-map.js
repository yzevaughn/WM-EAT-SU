/**
 * Vendor Location Map Handler
 * Allows vendors to set their business location on an interactive Google Map
 * Mirrored from student-campus-map.html functionality
 */

let vendorMap;
const wmsuPos = { lat: 6.9136, lng: 122.0614 };

let vendorMarker = null;
let selectedLat = wmsuPos.lat;
let selectedLng = wmsuPos.lng;

/**
 * Initialize the Google Map for vendor location
 */
function initVendorLocationMap() {
  vendorMap = new google.maps.Map(document.getElementById("vendorMap"), {
    center: wmsuPos,
    zoom: 18,
    minZoom: 17,
    restriction: {
      latLngBounds: {
        north: 6.9165,
        south: 6.9105,
        east: 122.0665,
        west: 122.0585,
      },
      strictBounds: false,
    },
    heading: 0,
    tilt: 45,
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: [
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  // Create initial draggable marker
  vendorMarker = new google.maps.Marker({
    position: wmsuPos,
    map: vendorMap,
    title: "Your Vendor Location",
    draggable: true,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#ef4444",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 12,
    },
  });

  // Update coordinates on marker drag
  vendorMarker.addListener("dragend", function () {
    const pos = vendorMarker.getPosition();
    updateVendorCoordinates(pos.lat(), pos.lng());
    showLocationPanel();
  });

  // Update coordinates on map click
  vendorMap.addListener("click", function (e) {
    const latlng = e.latLng;
    vendorMarker.setPosition(latlng);
    updateVendorCoordinates(latlng.lat(), latlng.lng());
    showLocationPanel();
  });

  // Initialize panel and coordinates
  updateVendorCoordinates(wmsuPos.lat, wmsuPos.lng);
  setupEventListeners();
  loadSavedVendorLocation();
}

/**
 * Update the coordinate display
 */
function updateVendorCoordinates(lat, lng) {
  selectedLat = parseFloat(lat).toFixed(6);
  selectedLng = parseFloat(lng).toFixed(6);

  document.getElementById("latInput").value = selectedLat;
  document.getElementById("lngInput").value = selectedLng;
  document.getElementById("locCoords").textContent =
    selectedLat + ", " + selectedLng;
}

/**
 * Reset map view to default
 */
function resetVendorMapView() {
  vendorMap.setCenter(wmsuPos);
  vendorMap.setZoom(18);
  vendorMap.setHeading(0);
  vendorMap.setTilt(45);
  vendorMarker.setPosition(wmsuPos);
  updateVendorCoordinates(wmsuPos.lat, wmsuPos.lng);
}

/**
 * Show the location info panel
 */
function showLocationPanel() {
  document.getElementById("locationPanel").classList.add("active");
}

/**
 * Close the location info panel
 */
function closeLocationPanel() {
  document.getElementById("locationPanel").classList.remove("active");
}

/**
 * Save the vendor location
 */
function saveVendorLocation() {
  const locationData = {
    latitude: selectedLat,
    longitude: selectedLng,
    timestamp: new Date().toISOString(),
  };

  // Store in localStorage
  localStorage.setItem("vendorLocation", JSON.stringify(locationData));

  // TODO: Send to backend API
  // fetch('/api/vendor/location', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(locationData)
  // })

  showNotification("Location saved successfully!", "success");
  closeLocationPanel();
}

/**
 * Reset location to default
 */
function resetVendorLocation() {
  resetVendorMapView();
  showNotification("Location reset to default", "info");
}

/**
 * Load previously saved location
 */
function loadSavedVendorLocation() {
  const saved = localStorage.getItem("vendorLocation");
  if (saved) {
    try {
      const location = JSON.parse(saved);
      const pos = {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude),
      };
      vendorMarker.setPosition(pos);
      vendorMap.setCenter(pos);
      updateVendorCoordinates(location.latitude, location.longitude);
    } catch (e) {
      console.error("Error loading saved location:", e);
    }
  }
}

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
  const saveBtn = document.getElementById("saveLocBtn");
  const resetBtn = document.getElementById("resetLocBtn");

  if (saveBtn) saveBtn.addEventListener("click", saveVendorLocation);
  if (resetBtn) resetBtn.addEventListener("click", resetVendorLocation);
}

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
  // Simple notification - can be extended with custom notification system
  const typeClass =
    type === "success" ? "success" : type === "error" ? "error" : "info";
  const icon = {
    success: "fa-check-circle",
    error: "fa-circle-exclamation",
    info: "fa-info-circle",
  }[type];

  // You can integrate with your existing notification system here
  console.log(`[${type.toUpperCase()}] ${message}`);
}

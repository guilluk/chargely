const bays = document.querySelectorAll(".bay-marker");

const bayModal = document.getElementById("bayModal");
const closeModal = document.getElementById("closeModal");
const modalBayNumber = document.getElementById("modalBayNumber");
const modalStatus = document.getElementById("modalStatus");
const modalInfo = document.getElementById("modalInfo");
const modalAction = document.getElementById("modalAction");
const availableCount = document.getElementById("availableCount");
const chargingCount = document.getElementById("chargingCount");
const endingSoonCount = document.getElementById("endingSoonCount");
const outOfOrderCount = document.getElementById("outOfOrderCount");
const modalReport = document.getElementById("modalReport");

let selectedBay = null;

// Simulated bay data
const bayData = {
  1: {
    status: "Available",
    info: "Ready to use"
  },

  2: {
    status: "Charging",
    info: "Vehicle currently charging"
  },

  3: {
    status: "Ending Soon",
    info: "Available in approximately 12 minutes"
  },

  4: {
    status: "Out of Order",
    info: "This charging bay is currently unavailable"
  }
};

function updateStatusSummary() {

  let available = 0;
  let charging = 0;
  let endingSoon = 0;
  let outOfOrder = 0;

  bays.forEach((bay) => {

    if (bay.classList.contains("available")) {
      available++;

    } else if (bay.classList.contains("charging")) {
      charging++;

    } else if (bay.classList.contains("ending-soon")) {
      endingSoon++;

    } else if (bay.classList.contains("out-of-order")) {
      outOfOrder++;
    }

  });

  availableCount.textContent = available;
  chargingCount.textContent = charging;
  endingSoonCount.textContent = endingSoon;
  outOfOrderCount.textContent = outOfOrder;
}

updateStatusSummary();

// Open bay modal
bays.forEach((bay) => {
  bay.addEventListener("click", () => {

    const bayNumber = bay.textContent.trim();
    selectedBay = bayNumber;

    modalBayNumber.textContent = `Bay ${bayNumber}`;

    // Get simulated data or use Available as default
    const data = bayData[bayNumber] || {
      status: "Available",
      info: "Ready to use"
    };

    modalStatus.textContent = data.status;
    modalInfo.textContent = data.info;

    // Configure action button based on bay status
if (data.status === "Available") {
  modalAction.style.display = "block";
  modalAction.textContent = "Start Charging";

} else if (data.status === "Charging") {
  modalAction.style.display = "block";
  modalAction.textContent = "Finish Charging";

} else if (data.status === "Ending Soon") {
  modalAction.style.display = "block";
  modalAction.textContent = "Make Available";

} else if (data.status === "Out of Order") {

  modalAction.style.display = "block";
  modalAction.textContent = "Mark as Available";

}

// Show Report Issue only for available bays
if (data.status === "Available") {
  modalReport.style.display = "block";
} else {
  modalReport.style.display = "none";
}

    // Set status colour
    if (data.status === "Charging") {
      modalStatus.style.color = "#60a5fa";

    } else if (data.status === "Ending Soon") {
      modalStatus.style.color = "#facc15";

    } else if (data.status === "Out of Order") {
      modalStatus.style.color = "#f87171";

    } else {
      modalStatus.style.color = "#4ade80";
    }

    bayModal.classList.add("active");
  });
});

// Close with X
closeModal.addEventListener("click", () => {
  bayModal.classList.remove("active");
});

// Close when clicking outside the panel
bayModal.addEventListener("click", (event) => {
  if (event.target === bayModal) {
    bayModal.classList.remove("active");
  }
});

// Close with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    bayModal.classList.remove("active");
  }
});

// Bay action button
modalAction.addEventListener("click", () => {
  if (!selectedBay) return;

  const currentData = bayData[selectedBay] || {
    status: "Available",
    info: "Ready to use"
  };

  let newStatus;
  let newInfo;

  // Decide the next status
  if (currentData.status === "Available") {
    newStatus = "Charging";
    newInfo = "Vehicle currently charging";

  } else if (currentData.status === "Charging") {
    newStatus = "Ending Soon";
    newInfo = "Charging completed — bay will be available shortly";

  } else if (currentData.status === "Ending Soon") {
    newStatus = "Available";
    newInfo = "Ready to use";
  }

  else if (currentData.status === "Out of Order") {
  newStatus = "Available";
  newInfo = "Ready to use";
  }

  // Save the new simulated data
  bayData[selectedBay] = {
    status: newStatus,
    info: newInfo
  };

  // Find the bay on the map
  const bayElement = Array.from(bays).find(
    (bay) => bay.textContent.trim() === selectedBay
  );

  // Remove old status classes
  if (bayElement) {
    bayElement.classList.remove(
      "available",
      "charging",
      "ending-soon",
      "out-of-order"
    );

    // Add the new status class
    if (newStatus === "Charging") {
      bayElement.classList.add("charging");

    } else if (newStatus === "Ending Soon") {
      bayElement.classList.add("ending-soon");

    } else {
      bayElement.classList.add("available");
    }
  }

  updateStatusSummary();

  // Update modal text
  modalStatus.textContent = newStatus;
  modalInfo.textContent = newInfo;

  // Update modal colour and button
  if (newStatus === "Charging") {
    modalStatus.style.color = "#60a5fa";
    modalAction.textContent = "Finish Charging";

  } else if (newStatus === "Ending Soon") {
    modalStatus.style.color = "#facc15";
    modalAction.textContent = "Make Available";

  } else {
    modalStatus.style.color = "#4ade80";
    modalAction.textContent = "Start Charging";
  }
});

// Report issue
modalReport.addEventListener("click", () => {
  if (!selectedBay) return;

  // Update bay data
  bayData[selectedBay] = {
    status: "Out of Order",
    info: "This charging bay is currently unavailable"
  };

  // Find bay on map
  const bayElement = Array.from(bays).find(
    (bay) => bay.textContent.trim() === selectedBay
  );

  // Update bay colour
  if (bayElement) {
    bayElement.classList.remove(
      "available",
      "charging",
      "ending-soon"
    );

    bayElement.classList.add("out-of-order");
  }

  // Update modal
  modalStatus.textContent = "Out of Order";
  modalStatus.style.color = "#f87171";

  modalInfo.textContent = "This charging bay is currently unavailable";

  // Change main action
  modalAction.style.display = "block";
  modalAction.textContent = "Mark as Available";

  // Hide report button
  modalReport.style.display = "none";

  // Update summary
  updateStatusSummary();
});
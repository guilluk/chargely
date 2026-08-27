const bays = document.querySelectorAll(".bay-marker");

const bayModal = document.getElementById("bayModal");
const closeModal = document.getElementById("closeModal");
const modalBayNumber = document.getElementById("modalBayNumber");
const modalStatus = document.getElementById("modalStatus");
const modalInfo = document.getElementById("modalInfo");
const modalAction = document.getElementById("modalAction");

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

    // Show button only for available bays
    if (data.status === "Available") {
      modalAction.style.display = "block";
      modalAction.textContent = "Start Charging";
    } else {
      modalAction.style.display = "none";
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

// Start charging
modalAction.addEventListener("click", () => {
  if (!selectedBay) return;

  // Update simulated data
  bayData[selectedBay] = {
    status: "Charging",
    info: "Vehicle currently charging"
  };

  // Find the corresponding bay on the map
  const bayElement = Array.from(bays).find(
    (bay) => bay.textContent.trim() === selectedBay
  );

  // Update the bay colour on the map
  if (bayElement) {
    bayElement.classList.remove(
      "available",
      "ending-soon",
      "out-of-order"
    );

    bayElement.classList.add("charging");
  }

  // Update modal
  modalStatus.textContent = "Charging";
  modalStatus.style.color = "#60a5fa";
  modalInfo.textContent = "Vehicle currently charging";

  // Hide button
  modalAction.style.display = "none";
});
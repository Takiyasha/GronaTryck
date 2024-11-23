// registration.js

// Elements for Create Account Modal
const createAccountModal = document.getElementById("createAccountModal");
const closeCreateAccountModalButton = document.querySelector(
  "#createAccountModal .close"
);

// Elements for Registration Confirmation Modal
const regConfirmationModal = document.getElementById("regConfirmationModal");
const closeRegConfirmationModalButton = document.querySelector(
  "#regConfirmationModal .close"
);

// Function to open registration confirmation modal
function openRegConfirmationModal() {
  if (regConfirmationModal) {
    regConfirmationModal.style.display = "flex";
  }
}

// Function to close registration confirmation modal
function closeRegConfirmationModal() {
  if (regConfirmationModal) {
    regConfirmationModal.style.display = "none";
  }
}

// Close registration confirmation modal when clicking the close button
if (closeRegConfirmationModalButton) {
  closeRegConfirmationModalButton.addEventListener(
    "click",
    closeRegConfirmationModal
  );
}

// Close registration confirmation modal when clicking outside the modal content
if (regConfirmationModal) {
  window.addEventListener("click", function (event) {
    if (event.target === regConfirmationModal) {
      closeRegConfirmationModal();
    }
  });
}

// Handle registration form submission and open registration confirmation modal
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Send registration request to server
    fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Open registration confirmation modal after successful registration
          openRegConfirmationModal();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
}

// Show Create Account Modal
const registerLink = document.getElementById("registerLink");
if (registerLink) {
  registerLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    loginModal.style.display = "none"; // Hide login modal
    createAccountModal.style.display = "flex"; // Show create account modal
  });
}

// Close create account modal when clicking close button
if (closeCreateAccountModalButton && createAccountModal) {
  closeCreateAccountModalButton.addEventListener("click", function () {
    createAccountModal.style.display = "none"; // Hide create account modal
  });
}

// Close create account modal when clicking outside the modal content
if (createAccountModal) {
  window.addEventListener("click", function (event) {
    if (event.target === createAccountModal) {
      createAccountModal.style.display = "none"; // Hide create account modal
    }
  });
}

function closeCreateAccountModal() {
  const createAccountModal = document.getElementById("createAccountModal");
  if (createAccountModal) {
    createAccountModal.style.display = "none";
  }
}

function openLoginModal() {
  const loginModal = document.getElementById("loginModal");
  if (loginModal) {
    loginModal.style.display = "flex";
  }
}

function switchToLoginModal() {
  // Close the "Skapa ett konto" modal
  closeCreateAccountModal();

  // Delay before opening the login modal for smoother transition
  setTimeout(() => {
    openLoginModal();
  }, 100); // delay for smooth transition
}

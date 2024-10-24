document.addEventListener("DOMContentLoaded", function () {
  // Elements for Login Modal
  const loginIcon = document.getElementById("loginIcon");
  const loginModal = document.getElementById("loginModal");
  const closeModalButton = document.querySelector("#loginModal .close");

  // Elements for Create Account Modal
  const createAccountModal = document.getElementById("createAccountModal");
  const closeCreateAccountModalButton = document.querySelector(
    "#createAccountModal .close"
  );

  // Show modal when clicking login icon
  if (loginIcon && loginModal) {
    loginIcon.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link action
      loginModal.style.display = "flex"; // Show login modal
    });
  }

  if (closeModalButton && loginModal) {
    closeModalButton.addEventListener("click", function () {
      loginModal.style.display = "none"; // Hide login modal
    });
  }

  // Close login modal when clicking outside the modal content
  if (loginModal) {
    window.addEventListener("click", function (event) {
      if (event.target === loginModal) {
        loginModal.style.display = "none"; // Hide login modal
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from submitting normally

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      console.log("Attempting login with email:", email); // Debugging login attempt

      // Send login request to server
      fetch("/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response received:", data); // Log server response
          if (data.success) {
            alert("Login successful!");
            loginModal.style.display = "none"; // Close modal after successful login
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Wrong Mail or Passowrd. Please try again.");
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
});

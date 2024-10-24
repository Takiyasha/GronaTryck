document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const loginIcon = document.getElementById("loginIcon");
  const loginModal = document.getElementById("loginModal");
  const closeModalButton = document.querySelector(".close");

  // Show modal when clicking login icon
  if (loginIcon && loginModal) {
    loginIcon.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link action for login icon
      loginModal.style.display = "flex"; // Show modal
    });
  }

  // Close modal when clicking close button
  if (closeModalButton && loginModal) {
    closeModalButton.addEventListener("click", function () {
      loginModal.style.display = "none"; // Hide modal
    });
  }

  // Close modal when clicking outside the modal content
  if (loginModal) {
    window.addEventListener("click", function (event) {
      if (event.target === loginModal) {
        loginModal.style.display = "none"; // Hide modal
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from submitting normally

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      console.log("Attempting login with email:", email); // Debugging login attempt

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
          alert("An error occurred during login. Please try again.");
        });
    });
  }

  // Prevent the homepage link from opening the login modal
  const homepageLink = document.querySelector(".navbar-brand");
  if (homepageLink) {
    homepageLink.addEventListener("click", function (event) {
      // Allow default link behavior
      loginModal.style.display = "none"; // Make sure the modal is hidden
    });
  }
});

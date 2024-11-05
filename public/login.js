document.addEventListener("DOMContentLoaded", function () {
  // Elements for Login Modal
 const loginIcon = document.getElementById("loginIcon");
 const loggedInIcon = document.getElementById("loggedInIcon");
 const loginModal = document.getElementById("loginModal");
 const closeModalButton = document.querySelector("#loginModal .close");
 
 // Elements for Create Account Modal
 const createAccountModal = document.getElementById("createAccountModal");
 const closeCreateAccountModalButton = document.querySelector(
   "#createAccountModal .close"
 );
 
 // Elements for Confirmation Modal
 const confirmationModal = document.getElementById("confirmationModal");
 const closeConfirmationModalButton = document.querySelector("#confirmationModal .close");
 
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
 
 // Function to open confirmation modal
 function openConfirmationModal() {
   if (confirmationModal) {
     confirmationModal.style.display = "flex";
   }
 }
 
 // Function to close confirmation modal
 function closeConfirmationModal() {
   if (confirmationModal) {
     confirmationModal.style.display = "none";
   }
 }
 
 // Close confirmation modal when clicking the close button
 if (closeConfirmationModalButton) {
   closeConfirmationModalButton.addEventListener("click", closeConfirmationModal);
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
       credentials: "include", // Important for including session cookies in the request
     })
       .then((response) => {
         return response.json();
       })
       .then((data) => {
         console.log("Response received:", data); // Log server response
         if (data.success) {
           loginModal.style.display = "none"; // Close login modal after successful login
           openConfirmationModal(); // Open confirmation modal
           // Update the icon state based on session
           checkLoginStatus();
         } else {
           alert(data.message);
         }
       })
       .catch((error) => {
         console.error("Error:", error);
         alert("Wrong Mail or Password. Please try again.");
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

  // Function to update login icon visibility based on server session state
  function checkLoginStatus() {
    fetch("/user/session", {
      method: "GET",
      credentials: "include", // Important for including session cookies in the request
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          loginIcon.style.display = "none";
          loggedInIcon.style.display = "block";
        } else {
          loginIcon.style.display = "block";
          loggedInIcon.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });
  }

  // Correct URL in Navigation for logged-in icon
  if (loggedInIcon) {
    loggedInIcon.addEventListener("click", function () {
      window.location.href = "/mina-sidor";
    });
  }

  // Handle logout button click
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      fetch("/user/logout", {
        method: "POST",
        credentials: "include", // Important for including session cookies in the request
      })
        .then(() => {
          // Redirect to the home page after logout
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    });
  }

  // Initial icon update based on server-side session state
  checkLoginStatus();
});


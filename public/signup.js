document.addEventListener("DOMContentLoaded", function () {
  const createAccountForm = document.getElementById("createAccountForm");

  if (!createAccountForm) {
    console.error("Create account form not found in the DOM.");
    return; // Stop execution if form is not found
  }

  createAccountForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Fetching the values from form fields
    const emailField = document.getElementById("email");
    const confirmEmailField = document.getElementById("confirmEmail");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");

    if (
      !emailField ||
      !confirmEmailField ||
      !passwordField ||
      !confirmPasswordField
    ) {
      console.error("One or more input fields are missing in the DOM.");
      return; // Stop execution if any field is missing
    }

    // Get the trimmed values
    const email = emailField.value.trim().toLowerCase();
    const confirmEmail = confirmEmailField.value.trim().toLowerCase();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    // Debugging logs to see if values are being correctly fetched
    console.log("Email:", email, "Confirm Email:", confirmEmail);
    console.log("Password:", password, "Confirm Password:", confirmPassword);

    // Email and password match validation
    if (email === "" || confirmEmail === "") {
      alert("Email fields cannot be empty!");
      return;
    }

    if (email !== confirmEmail) {
      alert("Emails do not match!");
      return;
    }

    if (password === "" || confirmPassword === "") {
      alert("Password fields cannot be empty!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare new user data
    const newUser = {
      email,
      confirmEmail,
      password,
      confirmPassword,
      name: document.getElementById("name").value.trim(),
      address: document.getElementById("address").value.trim(),
      postalCode: document.getElementById("postalCode").value.trim(),
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
    };

    console.log("New user data:", newUser); // Debugging: New user data before sending

    // Send data to the backend
    fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
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
          alert("Account created successfully!");
          createAccountForm.reset(); // Reset the form after successful registration
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("E-postadress already exist.");
      });
  });
});

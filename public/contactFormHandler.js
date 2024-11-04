document.addEventListener("DOMContentLoaded", function () {
  // Get the form and button elements
  const contactForm = document.getElementById("contactForm");
  const contactSendFormButton = document.getElementById("contactSendForm");

  // Event listener for form submission
  contactSendFormButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Collect form data
    const email = document.getElementById("contactEmail").value;
    const name = document.getElementById("contactName").value;
    const phone = document.getElementById("contactPhone").value;
    const message = document.getElementById("contactMessage").value;

    // Create an object with the form data
    const formData = {
      email: email,
      name: name,
      phone: phone,
      message: message,
    };

    // Send form data to the server using fetch
    fetch("/contact/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Meddelandet har sparats!");
          contactForm.reset(); // Reset the form
        } else {
          alert("Något gick fel, försök igen.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Kunde inte skicka meddelandet.");
      });
  });
});

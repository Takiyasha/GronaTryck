document.addEventListener("DOMContentLoaded", () => {
  console.log("offert_submit.js loaded");

  const submitButton = document.getElementById("submit-offert-btn");

  if (!submitButton) {
    console.error("Submit button not found in the DOM.");
    return;
  }

  console.log("Submit button found in the DOM.");

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Skicka button clicked");

    const email = document.getElementById("checkoutEmail")?.value.trim();
    const name = document.getElementById("checkoutName")?.value.trim();
    const contact = document.getElementById("checkoutContact")?.value.trim();
    const phone = document.getElementById("checkoutPhone")?.value.trim();
    const message = document.getElementById("checkoutMessage")?.value.trim();
    const cartItems = JSON.parse(sessionStorage.getItem("checkoutItems")) || [];

    console.log("Collected Form Data:", {
      email,
      name,
      contact,
      phone,
      message,
      cartItems,
    });

    if (!email || !name || !contact || !phone || cartItems.length === 0) {
      console.error("Validation failed. Missing fields or empty cart.");
      alert("Please fill in all fields before submitting.");
      return;
    }

    console.log("Validation passed. Sending data to the server...");

    try {
      const response = await fetch("/api/submit-offert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          contact,
          phone,
          message,
          cartItems,
        }),
      });

      if (!response.ok) {
        console.error("Server responded with an error:", response.statusText);
        alert("Failed to submit the offert. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.success) {
        alert("Offert successfully submitted! Tack😁");

        // Clear the cart data
        await clearAllCartData();

        // Clear sessionStorage
        sessionStorage.removeItem("checkoutItems");

        // Redirect to homepage or success page
        window.location.href = "/";
      } else {
        console.error("Submission failed:", result.message);
        alert("Failed to submit the offert. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting offert:", error);
      alert("An error occurred while submitting the offert.");
    }
  });
});

// Function to clear cart data // not working :((( T-T why indexedb
async function clearAllCartData() {
  try {
    // Clear localStorage cart data
    localStorage.removeItem("shoppingCart");

    // Clear backend orders.json data
    const response = await fetch("/api/clear-cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Failed to clear cart from backend:", response.statusText);
      return;
    }

    const result = await response.json();
    if (result.success) {
      console.log("Cart cleared successfully from backend.");
    } else {
      console.error("Failed to clear backend cart:", result.message);
    }
  } catch (error) {
    console.error("Error clearing cart data:", error);
  }

  // Update the cart badge
  document.dispatchEvent(new Event("cartUpdated"));
}

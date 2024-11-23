document.addEventListener("DOMContentLoaded", () => {
  initializeCart();

  // Add to Cart Elements
  const addToOrderBtn = document.getElementById("addToOrderBtn");

  if (addToOrderBtn) {
    addToOrderBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      // Gather Product Information
      try {
        const productName = document.querySelector(".heading-l").innerText;
        const artikelnummer = document
          .querySelector(".alt-text-s")
          .innerText.split(": ")[1];
        const quantityInput = document.getElementById("quantityInput");
        const quantity = parseInt(quantityInput.value, 10);
        const selectedColor =
          document.getElementById("selectedColor").innerText || "Ej vald";
        const productImage = document.querySelector(
          ".product-model-image img"
        ).src;

        console.log("Product Information Collected: ", {
          productName,
          artikelnummer,
          quantity,
          selectedColor,
          productImage,
        });

        if (isNaN(quantity) || quantity < 10) {
          alert("Minimum kvantitet är 10 enheter.");
          return;
        }

        // Calculate Price (based on quantity)
        let pricePerUnit = 460; // Example price, replace with actual logic if needed
        const estimatedPriceElement =
          document.getElementById("priceEstimation");
        if (estimatedPriceElement) {
          const estimatedPriceText = estimatedPriceElement.innerText;
          const priceMatch = estimatedPriceText.match(/\d+/g);
          if (priceMatch) {
            pricePerUnit = parseInt(priceMatch.join(""), 10) / quantity;
          }
        }
        const price = quantity * pricePerUnit;

        // Construct Order Data
        const orderData = {
          name: productName,
          artikelnummer: artikelnummer,
          color: selectedColor,
          quantity: quantity,
          image: productImage,
          price: price,
        };

        console.log("Order Data Constructed: ", orderData);

        // Add Order to Backend (orders.json)
        addOrderToBackend(orderData)
          .then((success) => {
            if (success) {
              console.log("Order added to server successfully.");
              // Add to LocalStorage to manage the UI without reloading
              addProductToLocalStorage(orderData);
              // Refresh the cart UI after adding product
              renderCartItems(getCartItemsFromLocalStorage());
            }
          })
          .catch((error) => {
            console.error("Error while adding product to backend: ", error);
          });
      } catch (error) {
        console.error("Error while adding product to cart: ", error);
      }
    });
  }

  // Event listener for "Gå till offertförfrågan" button
  const checkoutButton = document.getElementById("checkoutButton");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Get the current cart items from local storage
      const cartItems = getCartItemsFromLocalStorage();

      if (cartItems.length === 0) {
        alert("Din offertförfrågan är tom.");
        return;
      }

      // Save cart items to session storage to use on the "Offertförfrågan" page
      sessionStorage.setItem("checkoutItems", JSON.stringify(cartItems));

      // Redirect to the "Offertförfrågan" page
      window.location.href = "/offertforfragan";
    });
  }
});

async function addOrderToBackend(orderData) {
  try {
    const response = await fetch("/order/add-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(
        "Failed to save order to server. Status: " + response.status
      );
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error saving order to server:", error);
    return false;
  }
}

function initializeCart() {
  const cartIcon = document.getElementById("cartIcon");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartPanel = document.getElementById("closeCartPanel");
  const loginModal = document.getElementById("loginModal");

  if (cartIcon && cartPanel && closeCartPanel) {
    // Add Event Listeners for Opening/Closing Cart
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (loginModal) loginModal.style.display = "none"; // Close login modal if open
      cartPanel.classList.toggle("show");
      if (cartPanel.classList.contains("show")) {
        renderCartItems(getCartItemsFromLocalStorage());
      }
    });

    closeCartPanel.addEventListener("click", (e) => {
      e.stopPropagation();
      cartPanel.classList.remove("show");
    });

    window.addEventListener("click", (e) => {
      if (
        !e.target.closest("#cartIcon") &&
        !e.target.closest("#cartPanel") &&
        !e.target.closest(".delete-btn")
      ) {
        cartPanel.classList.remove("show");
      }
    });
  }
}

function addProductToLocalStorage(product) {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  // Check if product already exists
  const existingProductIndex = cart.findIndex(
    (item) =>
      item.artikelnummer === product.artikelnummer &&
      item.color === product.color
  );

  if (existingProductIndex > -1) {
    // Update the existing product quantity and price
    cart[existingProductIndex].quantity += product.quantity;
    cart[existingProductIndex].price += product.price;
  } else {
    // Add new product
    cart.push(product);
  }

  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function getCartItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

function renderCartItems(orders) {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const totalPriceElement = document.getElementById("cartTotalPrice");
  const vatAmountElement = document.getElementById("cartVatAmount");
  const sumPriceElement = document.getElementById("cartSumPrice");

  if (orders.length === 0) {
    cartItemsContainer.innerHTML = "<p>Din offertförfrågan är tom.</p>";
    totalPriceElement.innerText = "Varukostnad: 0 kr";
    vatAmountElement.innerText = "Moms från: 0 kr";
    sumPriceElement.innerText = "0 kr";
    return;
  }

  let itemsHTML = "";
  let totalPrice = 0;

  orders.forEach((item, index) => {
    const itemTotalPrice = item.price;

    itemsHTML += `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
          <p><strong>${item.name}</strong></p>
          <p>Art.nr: ${item.artikelnummer}</p>
          <p>Färg: ${item.color}</p>
          <p>Antal: <span class="item-quantity">${item.quantity}</span></p>
          <p>Pris: ${itemTotalPrice.toLocaleString()} kr</p>
        </div>
        <div class="cart-item-actions">
          <button class="delete-btn" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" class="trashcan-icon">
              <path d="M700 50H500c0-27.6-22.4-50-50-50H350c-27.6 0-50 22.4-50 50H100c-27.6 0-50 22.4-50 50v62.5c0 6.9 5.6 12.5 12.5 12.5h675c6.9 0 12.5-5.6 12.5-12.5V100c0-27.6-22.4-50-50-50ZM250 300c-6.9 0-12.5 5.6-12.5 12.5v325c0 6.9 5.6 12.5 12.5 12.5s12.5-5.6 12.5-12.5v-325c0-6.9-5.6-12.5-12.5-12.5Zm150 0c-6.9 0-12.5 5.6-12.5 12.5v325c0 6.9 5.6 12.5 12.5 12.5s12.5-5.6 12.5-12.5v-325c0-6.9-5.6-12.5-12.5-12.5Zm150 0c-6.9 0-12.5 5.6-12.5 12.5v325c0 6.9 5.6 12.5 12.5 12.5s12.5-5.6 12.5-12.5v-325c0-6.9-5.6-12.5-12.5-12.5ZM112.5 200h-20c-2.8 0-5 2.2-5 5v545c0 27.6 22.4 50 50 50h525c27.6 0 50-22.4 50-50V205c0-2.8-2.2-5-5-5h-595Zm175 437.5c0 20.7-16.8 37.5-37.5 37.5s-37.5-16.8-37.5-37.5v-325c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5v325Zm150 0c0 20.7-16.8 37.5-37.5 37.5s-37.5-16.8-37.5-37.5v-325c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5v325Zm150 0c0 20.7-16.8 37.5-37.5 37.5s-37.5-16.8-37.5-37.5v-325c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5v325Z" style="fill:#052900"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    totalPrice += itemTotalPrice;
  });

  cartItemsContainer.innerHTML = itemsHTML;

  const vatAmount = Math.round(totalPrice * 0.25); // Calculate VAT (25%)
  const totalSum = totalPrice + vatAmount;

  totalPriceElement.innerText = `Varukostnad: ${totalPrice.toLocaleString()} kr`;
  vatAmountElement.innerText = `Moms från: ${vatAmount.toLocaleString()} kr`;
  sumPriceElement.innerText = `${totalSum.toLocaleString()} kr`;

  // Attach delete event listeners after rendering
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent cart from auto-closing when clicking delete
      const index = e.target.closest(".delete-btn").dataset.index;
      const item = orders[index];
      removeCartItem(index, item.artikelnummer, item.color);
      renderCartItems(getCartItemsFromLocalStorage()); // Refresh cart UI after removing an item
    });
  });
}

function removeCartItem(index, artikelnummer, color) {
  // Remove from local storage
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  cart.splice(index, 1); // Remove item from the cart array
  localStorage.setItem("shoppingCart", JSON.stringify(cart));

  // Remove from backend
  fetch(`/order/delete-order`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artikelnummer, color }), // Send product details to delete from backend
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.error("Failed to delete order from server.");
      } else {
        console.log("Order deleted from server successfully.");
      }
    })
    .catch((error) => {
      console.error("Error deleting order from server:", error);
    });
}
// Cart badge indicator.
function addProductToLocalStorage(product) {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  // Check if product already exists
  const existingProductIndex = cart.findIndex(
    (item) =>
      item.artikelnummer === product.artikelnummer &&
      item.color === product.color
  );

  if (existingProductIndex > -1) {
    // Update the existing product quantity and price
    cart[existingProductIndex].quantity += product.quantity;
    cart[existingProductIndex].price += product.price;
  } else {
    // Add new product
    cart.push(product);
  }

  localStorage.setItem("shoppingCart", JSON.stringify(cart));

  // Dispatch event to update cart badge
  document.dispatchEvent(new Event("cartUpdated"));
}

function removeCartItem(index, artikelnummer, color) {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  cart.splice(index, 1); // Remove item from the cart array
  localStorage.setItem("shoppingCart", JSON.stringify(cart));

  // Dispatch event to update cart badge
  document.dispatchEvent(new Event("cartUpdated"));

  // Remove from backend
  fetch(`/order/delete-order`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artikelnummer, color }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.error("Failed to delete order from server.");
      } else {
        console.log("Order deleted from server successfully.");
      }
    })
    .catch((error) => {
      console.error("Error deleting order from server:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Update badge on page load
  updateCartBadge();

  // Listen for custom events to update the badge
  document.addEventListener("cartUpdated", updateCartBadge);
});

// Function to update the cart badge
function updateCartBadge() {
  const cartBadge = document.getElementById("cartBadge");
  const cartItems = getCartItemsFromLocalStorage();

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    cartBadge.textContent = totalQuantity; // Set total quantity
    cartBadge.style.display = "flex"; // Show badge
  } else {
    cartBadge.style.display = "none"; // Hide badge if no items
  }
}

// Utility function to fetch cart items from localStorage
function getCartItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

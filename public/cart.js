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

  if (cartIcon && cartPanel && closeCartPanel) {
    // Add Event Listeners for Opening/Closing Cart
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
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
  cart.push(product);
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function getCartItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

function renderCartItems(orders) {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const totalPriceElement = document.getElementById("totalPrice");
  const sumPriceElement = document.getElementById("sumPrice");

  if (orders.length === 0) {
    cartItemsContainer.innerHTML = "<p>Din offertförfrågan är tom.</p>";
    totalPriceElement.innerText = "Varukostnad: 0 kr";
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
          <button class="delete-btn" data-index="${index}">&times;</button>
        </div>
      </div>
    `;

    totalPrice += itemTotalPrice;
  });

  cartItemsContainer.innerHTML = itemsHTML;
  totalPriceElement.innerText = `Varukostnad: ${totalPrice.toLocaleString()} kr`;
  const totalSum = totalPrice + 1500; // Add shipping cost
  sumPriceElement.innerText = `${totalSum.toLocaleString()} kr`;

  // Attach delete event listeners after rendering
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent cart from auto-closing when clicking delete
      const index = e.target.dataset.index;
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

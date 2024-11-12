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
          document.getElementById("selectedColor").innerText;
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
        fetch("/order/add-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                "Failed to save order to server. Status: " + response.status
              );
            }
            return response.json();
          })
          .then((data) => {
            if (!data.success) {
              console.error(
                "Failed to save order to server. Server response:",
                data
              );
            } else {
              console.log("Order added to server successfully.");
              // Refresh the Cart UI after order is added to the backend
              initializeCart();
            }
          })
          .catch((error) => {
            console.error("Error saving order to server:", error);
          });
      } catch (error) {
        console.error("Error while adding product to cart: ", error);
      }
    });
  }
});

// Reinitialize the cart after adding or removing an item
function initializeCart() {
  const cartIcon = document.getElementById("cartIcon");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartPanel = document.getElementById("closeCartPanel");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const totalPriceElement = document.getElementById("totalPrice");
  const sumPriceElement = document.getElementById("sumPrice");

  if (cartIcon && cartPanel && closeCartPanel) {
    // Add Event Listeners for Opening/Closing Cart
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      cartPanel.classList.toggle("show");
    });

    closeCartPanel.addEventListener("click", (e) => {
      e.stopPropagation();
      cartPanel.classList.remove("show");
    });

    window.addEventListener("click", (e) => {
      if (!e.target.closest("#cartIcon") && !e.target.closest("#cartPanel")) {
        cartPanel.classList.remove("show");
      }
    });
  }

  // Fetch and Render Cart Items
  fetchCartItems();

  function fetchCartItems() {
    fetch("/order/get-orders")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          renderCartItems(data.orders);
        } else {
          console.error("Failed to fetch orders from server.");
        }
      })
      .catch((error) => {
        console.error("Error fetching orders from server:", error);
      });
  }

  function renderCartItems(orders) {
    if (orders.length === 0) {
      cartItemsContainer.innerHTML = "<p>Din offertförfrågan är tom.</p>";
      totalPriceElement.innerText = "Varukostnad: 0 kr";
      sumPriceElement.innerText = "0 kr";
      return;
    }

    let itemsHTML = "";
    let totalPrice = 0;

    orders.forEach((item) => {
      // Here, we assume item.price is already the price for the quantity selected
      const itemTotalPrice = item.price;

      itemsHTML += `
        <div class="cart-item" data-artikelnummer="${
          item.artikelnummer
        }" data-color="${item.color}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <p><strong>${item.name}</strong></p>
            <p>Art.nr: ${item.artikelnummer}</p>
            <p>Färg: ${item.color}</p>
            <p>Antal: <span class="item-quantity">${item.quantity}</span></p>
            <p>Pris: ${itemTotalPrice.toLocaleString()} kr</p> <!-- Fixed price display for individual product -->
          </div>
          <div class="cart-item-actions">
            <button class="delete-btn">&times;</button>
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
        const cartItemElement = e.target.closest(".cart-item");
        const artikelnummer = cartItemElement.dataset.artikelnummer;
        const color = cartItemElement.dataset.color;
        removeCartItem(artikelnummer, color);
      });
    });
  }

  function removeCartItem(artikelnummer, color) {
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
          console.log("Order deleted from server successfully!");
          // Refresh the cart UI after order is deleted
          initializeCart();
        }
      })
      .catch((error) => {
        console.error("Error deleting order from server:", error);
      });
  }
}

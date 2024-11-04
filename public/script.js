document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  const addToOrderBtn = document.getElementById("addToOrderBtn");
  const cartIcon = document.getElementById("cartIcon");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartPanel = document.getElementById("closeCartPanel");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const totalPriceElement = document.getElementById("totalPrice");
  const sumPriceElement = document.getElementById("sumPrice");
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  // Load initial cart data from the server
  loadCartDataFromServer();

  // Handle Add to Cart Button Click
  if (addToOrderBtn) {
    addToOrderBtn.addEventListener("click", async function (event) {
      event.stopPropagation(); // Prevent click event from propagating

      // Get product details
      const artikelnummer = document
        .querySelector(".alt-text-s")
        .innerText.split(": ")[1];
      const quantity = parseInt(
        document.getElementById("quantityInput").value,
        10
      );
      const selectedColor = document.getElementById("selectedColor").innerText;

      if (isNaN(quantity) || quantity < 10) {
        alert("Minimum kvantitet är 10 enheter.");
        return;
      }

      try {
        // Fetch product details to get the correct price and other product data
        const response = await fetch(`/products/get-product/${artikelnummer}`);
        const data = await response.json();

        if (!data.success) {
          console.error("Failed to fetch product details: ", data.message);
          return;
        }

        const product = data.product;
        let pricePerUnit = 0;

        // Determine price per unit based on quantity
        for (let tier of product.price_tiers) {
          const [minRange, maxRange] = tier.range.includes("+")
            ? [parseInt(tier.range.split("+")[0]), Infinity]
            : tier.range.split("-").map(Number);
          if (
            quantity >= minRange &&
            (maxRange === undefined || quantity <= maxRange)
          ) {
            pricePerUnit = tier.price_per_unit;
            break;
          }
        }

        // Construct order data
        const orderData = {
          name: product.name,
          artikelnummer,
          color: selectedColor,
          quantity,
          image: product.model_image.image,
          price: (pricePerUnit * quantity).toLocaleString() + " kr",
        };

        // Save order to orders.json using fetch API
        console.log("Sending data to server: ", JSON.stringify(orderData));
        const addOrderResponse = await fetch("/order/add-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const addOrderData = await addOrderResponse.json();
        if (!addOrderData.success) {
          console.error(
            "Failed to save order to server: ",
            addOrderData.message
          );
          return;
        }

        console.log("Order saved to server successfully!");

        // Add to cart
        const existingProductIndex = cart.findIndex(
          (item) =>
            item.artikelnummer === orderData.artikelnummer &&
            item.color === orderData.color
        );

        if (existingProductIndex !== -1) {
          // Update quantity if product already exists in the cart
          cart[existingProductIndex].quantity += quantity;
        } else {
          // Add new product to cart
          cart.push(orderData);
        }

        // Save updated cart to localStorage
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        renderCartItems(); // Refresh cart items

        // Load updated cart data from the server
        loadCartDataFromServer();
      } catch (error) {
        console.error("Error processing order:", error);
      }
    });
  }

  // Function to load cart data from the server
  function loadCartDataFromServer() {
    fetch("/order/get-orders")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.orders) {
          cart = data.orders;
          localStorage.setItem("shoppingCart", JSON.stringify(cart));
          renderCartItems();
        } else {
          console.error("Failed to load orders from server.");
        }
      })
      .catch((error) => {
        console.error("Error loading orders from server:", error);
      });
  }

  // Render Cart Items without affecting the panel visibility
  function renderCartItems() {
    cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Din offertförfrågan är tom.</p>";
      totalPriceElement.innerText = "Varukostnad: 0 kr";
      sumPriceElement.innerText = "0 kr";
      return;
    }

    let itemsHTML = "";
    let totalPrice = 0;

    cart.forEach((item) => {
      itemsHTML += `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <p><strong>${item.name}</strong></p>
            <p>Art.nr: ${item.artikelnummer}</p>
            <p>Färg: ${item.color}</p>
            <p>Antal: <span class="item-quantity">${item.quantity}</span></p>
          </div>
          <div class="cart-item-actions">
            <button class="delete-btn" onclick="removeCartItem('${item.artikelnummer}', '${item.color}', event)">&times;</button>
          </div>
        </div>
      `;
      totalPrice +=
        parseFloat(item.price.replace(" kr", "").replace(",", "")) *
        item.quantity;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    totalPriceElement.innerText = `Varukostnad: ${totalPrice.toLocaleString()} kr`;
    sumPriceElement.innerText = `${totalPrice.toLocaleString()} kr`;
  }

  // Remove item from cart function
  window.removeCartItem = async function (artikelnummer, color, event) {
    event.stopPropagation();

    // Update cart data
    cart = cart.filter(
      (item) => !(item.artikelnummer === artikelnummer && item.color === color)
    );

    // Update localStorage and re-render cart items
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    renderCartItems();

    // Remove item from orders.json using fetch API
    try {
      const response = await fetch(`/order/delete-order`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artikelnummer, color }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Order deleted from server successfully!");
      } else {
        console.error("Failed to delete order from server.");
      }
    } catch (error) {
      console.error("Error deleting order from server:", error);
    }
  };

  // Show Cart Panel on Cart Icon Click
  cartIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    cartPanel.classList.toggle("show");
  });

  // Close Cart Panel
  closeCartPanel.addEventListener("click", function (event) {
    event.stopPropagation();
    cartPanel.classList.remove("show");
  });

  // Close the cart panel if clicked outside of it
  window.addEventListener("click", function (event) {
    if (
      !event.target.closest("#cartIcon") &&
      !event.target.closest("#cartPanel")
    ) {
      cartPanel.classList.remove("show");
    }
  });

  // Initially render cart items on page load
  renderCartItems();
});

////////////////////////////////////////////////////////////////

// Quantity input and price estimation calculation
document.addEventListener("DOMContentLoaded", function () {
  const loadMoreButton = document.getElementById("loadMoreButton");
  const productsContainer = document.getElementById("productsContainer");
  const productCards = productsContainer.getElementsByClassName("gt-product");
  const ITEMS_PER_LOAD = 8; // Startar with 8 visible products

  // Initially display only the first 8 items
  let visibleCount = ITEMS_PER_LOAD;
  for (let i = 0; i < productCards.length; i++) {
    if (i >= ITEMS_PER_LOAD) {
      productCards[i].style.display = "none";
    }
  }

  // Event listener for the "Visa mer" button
  loadMoreButton.addEventListener("click", function () {
    let count = 0;

    // Reveal the next batch of products
    for (let i = visibleCount; i < productCards.length; i++) {
      if (count < ITEMS_PER_LOAD) {
        productCards[i].style.display = "block";
        count++;
      }
    }

    visibleCount += ITEMS_PER_LOAD;

    // Hide the "Visa mer" button if all items are visible
    if (visibleCount >= productCards.length) {
      loadMoreButton.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("quantityInput");
  const priceEstimationElement = document.getElementById("priceEstimation");

  const priceTiers = [
    { min: 10, max: 49, price: 360 },
    { min: 50, max: 99, price: 324 },
    { min: 100, max: 249, price: 306 },
    { min: 250, max: 499, price: 297 },
    { min: 500, max: Infinity, price: 288 },
  ];

  quantityInput.addEventListener("input", function () {
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 10) {
      priceEstimationElement.innerText = "-kr";
      return;
    }

    // Determine the price per unit based on the quantity
    let pricePerUnit = 0;
    for (const tier of priceTiers) {
      if (quantity >= tier.min && quantity <= tier.max) {
        pricePerUnit = tier.price;
        break;
      }
    }

    // Calculate and display the estimated price
    const estimatedPrice = quantity * pricePerUnit;
    priceEstimationElement.innerText = estimatedPrice.toLocaleString() + " kr";
  });
});

// Script to handle product color selection on the product page

document.addEventListener("DOMContentLoaded", function () {
  // Function to handle color selection
  function selectColor(selectedElement) {
    // Remove 'selected' class from all color images
    const colorImages = document.querySelectorAll(".product-color-img");
    colorImages.forEach((img) => {
      img.classList.remove("selected");
    });

    // Add 'selected' class to the clicked image
    selectedElement.classList.add("selected");

    // Update the color name in the color label
    const selectedColorName = selectedElement.getAttribute("data-color-name");
    const selectedColorElement = document.getElementById("selectedColor");
    if (selectedColorElement) {
      selectedColorElement.innerText = selectedColorName;
    } else {
      console.error("Element with id 'selectedColor' not found.");
    }
  }

  // Attach click event listeners to all color images
  const colorImages = document.querySelectorAll(".product-color-img");
  if (colorImages.length > 0) {
    console.log(`Found ${colorImages.length} color images.`);
    colorImages.forEach((img) => {
      img.addEventListener("click", function () {
        console.log(
          `Image with color ${img.getAttribute("data-color-name")} clicked.`
        );
        selectColor(this);
      });
    });
  } else {
    console.error("No elements with class 'product-color-img' found.");
  }

  // Add CSS to highlight the selected color
  const style = document.createElement("style");
  style.innerHTML = `
    .product-color-img {
      cursor: pointer;
      border: 2px solid transparent;
      padding: 5px;
    }
    .product-color-img.selected {
      border: 2px solid green;
    }
  `;
  document.head.appendChild(style);
});

// Swiper configurations
var productSwiper = new Swiper(".product-swiper", {
  slidesPerView: 4, // Standardvärde
  spaceBetween: 30, // Avstånd mellan slides
  loop: true, // Loop-funktion
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    // Definiera olika värden beroende på skärmbredd
    320: {
      // Vid skärmar ≥ 320px
      slidesPerView: 1, // Visa 1 slide
      spaceBetween: 10, // Avstånd mellan slides minskat till 10px
    },
    768: {
      // Vid skärmar ≥ 640px
      slidesPerView: 2, // Visa 2 slides
      spaceBetween: 20, // Avstånd mellan slides
    },
    1280: {
      // Vid skärmar ≥ 1024px
      slidesPerView: 3, // Visa 3 slides
      spaceBetween: 30, // Avstånd mellan slides
    },
    1920: {
      // Vid skärmar ≥ 1440px
      slidesPerView: 4, // Visa 4 slides (eller mer beroende på ditt standardvärde)
      spaceBetween: 30, // Samma avstånd som standard
    },
  },
});

var swiper = new Swiper(".colab-swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 5,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: false,
  },
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1440: {
      slidesPerView: 4,
    },
  },
});

/* Accordion */
document.querySelectorAll(".hallbarhet-accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", !expanded);
  });
});

/* Mina sidor */
function showContent(contentNumber) {
  // Hide all content and reset buttons
  var contents = document.getElementsByClassName("ms-content");
  var buttons = document.getElementsByClassName("ms-accordion-button");
  var msGe = document.querySelector(".ms-ge");

  for (var i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
    buttons[i].classList.remove("active");
  }

  // Show the selected content and activate the button
  document.getElementById("content" + contentNumber).classList.add("active");
  event.target.classList.add("active");

  // Hide ms-ge
  msGe.classList.remove("active");
}

function checkAllContentsClosed() {
  var contents = document.getElementsByClassName("ms-content");
  var msGe = document.querySelector(".ms-ge");
  var allClosed = true;

  for (var i = 0; i < contents.length; i++) {
    if (contents[i].classList.contains("active")) {
      allClosed = false;
      break;
    }
  }

  if (allClosed) {
    msGe.classList.add("active");
  }
}

// Add click event listeners to all buttons
var buttons = document.getElementsByClassName("ms-accordion-button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    setTimeout(checkAllContentsClosed, 0);
  });
}

// Initial check to show ms-ge if no content is active
checkAllContentsClosed();

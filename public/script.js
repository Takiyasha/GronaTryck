document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle) {
    console.error("menuToggle element not found");
    return;
  }

  if (!navLinks) {
    console.error("navLinks element not found");
    return;
  }

  menuToggle.addEventListener("click", function (e) {
    console.log("Menu toggle clicked");
    e.stopPropagation(); // Prevent the click from bubbling up
    navLinks.classList.toggle("show");
    console.log("show class toggled", navLinks.classList.contains("show"));
  });

  // Close the menu when clicking on a link
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("show");
      console.log("Menu closed by link click");
    }
  });

  // Close the menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("show");
      console.log("Menu closed by outside click");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const addToOrderBtn = document.getElementById("addToOrderBtn");
  const cartDropdown = document.getElementById("cartDropdown");
  const cartIcon = document.getElementById("cartIcon");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartPanel = document.getElementById("closeCartPanel");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const totalPriceElement = document.getElementById("totalPrice");
  const sumPriceElement = document.getElementById("sumPrice");
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  // Handle Add to Cart Button Click
  if (addToOrderBtn) {
    addToOrderBtn.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent click event from propagating
      // Get product details
      const productName = document.querySelector(".heading-l").innerText;
      const artikelnummer = document
        .querySelector(".alt-text-s")
        .innerText.split(": ")[1];
      const quantity = parseInt(
        document.getElementById("quantityInput").value,
        10
      );
      const selectedColor = document.getElementById("selectedColor").innerText;
      const productImage = document.querySelector(".product-image").src; // Assuming there's an element with class 'product-image'

      if (isNaN(quantity) || quantity < 10) {
        alert("Minimum kvantitet är 10 enheter.");
        return;
      }

      // Construct order data
      const orderData = {
        name: productName,
        artikelnummer: artikelnummer,
        color: selectedColor,
        quantity: quantity,
        image: productImage,
      };

      // Check if product is already in the cart
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
      renderCartItems(); // Refresh cart items only (not the whole cart panel)

      // Save order to orders.json using fetch API
      fetch("/order/add-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Order saved to server successfully!");
          } else {
            console.error("Failed to save order to server.");
          }
        })
        .catch((error) => {
          console.error("Error saving order to server:", error);
        });
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

    // Use DocumentFragment for batch DOM update
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
      const pricePerUnit = 360; // Example price, replace with actual logic
      totalPrice += item.quantity * pricePerUnit;
    });

    // Set the inner HTML of cartItemsContainer in one go
    cartItemsContainer.innerHTML = itemsHTML;

    // Update total price in one go
    totalPriceElement.innerText = `Varukostnad: ${totalPrice.toLocaleString()} kr`;
    sumPriceElement.innerText = `${totalPrice.toLocaleString()} kr`;
  }

  // Remove item from cart
  window.removeCartItem = function (artikelnummer, color, event) {
    event.stopPropagation(); // Prevent click event from propagating to the window click listener

    // Update cart data
    cart = cart.filter(
      (item) => !(item.artikelnummer === artikelnummer && item.color === color)
    );

    // Update localStorage and re-render cart items
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    renderCartItems();

    // Remove item from orders.json using fetch API
    fetch(`/order/delete-order`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artikelnummer, color }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Order deleted from server successfully!");
        } else {
          console.error("Failed to delete order from server.");
        }
      })
      .catch((error) => {
        console.error("Error deleting order from server:", error);
      });
  };

  // Show Cart Panel on Cart Icon Click
  cartIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click from propagating to the window click listener
    cartPanel.classList.toggle("show");
  });

  // Close Cart Panel
  closeCartPanel.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click from propagating to the window click listener
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

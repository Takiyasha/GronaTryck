document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");
  const productList = document.getElementById("product-list");
  const productItems = productList.getElementsByClassName("product-item");

  // Search function
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    filterProducts(searchTerm, filterSelect.value);
  });

  // Filter function
  filterSelect.addEventListener("change", function () {
    const searchTerm = searchInput.value.toLowerCase();
    filterProducts(searchTerm, filterSelect.value);
  });

  function filterProducts(searchTerm, category) {
    Array.from(productItems).forEach(function (item) {
      const productName = item.getAttribute("data-name").toLowerCase();
      const productCategory = item.getAttribute("data-category");

      const matchesSearch = productName.includes(searchTerm);
      const matchesCategory =
        category === "all" || productCategory === category;

      if (matchesSearch && matchesCategory) {
        item.style.display = ""; // Show product
      } else {
        item.style.display = "none"; // Hide product
      }
    });
  }
});

// quantity and total price updates
document.addEventListener("DOMContentLoaded", function () {
  const basePrice = parseFloat(
    document.getElementById("base-price").textContent
  );
  const quantityInput = document.getElementById("quantity");
  const quantityDisplay = document.getElementById("quantity-display");
  const totalPriceElement = document.getElementById("total-price");
  const totalPriceFinalElement = document.getElementById("total-price-final"); // For TOTAL row
  const increaseQuantityButton = document.getElementById("increase-quantity");
  const decreaseQuantityButton = document.getElementById("decrease-quantity");

  // Function to format price with comma as decimal separator (sv-SE locale)
  function formatPrice(price) {
    return price.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Function to update total price and quantity display in the table
  function updateTotalPrice() {
    const quantity = parseInt(quantityInput.value);
    const totalPrice = basePrice * quantity;

    // Update total price in both table cells
    totalPriceElement.textContent = formatPrice(totalPrice) + " kr";
    totalPriceFinalElement.textContent = formatPrice(totalPrice) + " kr";

    // Update quantity display in the table
    quantityDisplay.textContent = quantity;
  }

  // Increase quantity
  increaseQuantityButton.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value);

    // Increment quantity by 1
    quantity += 1;
    quantityInput.value = quantity;

    // Update displayed values
    updateTotalPrice();
  });

  // Decrease quantity (minimum 1)
  decreaseQuantityButton.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value);

    // Decrease quantity by 1 if it's greater than 1
    if (quantity > 1) {
      quantity -= 1;
      quantityInput.value = quantity;
    }

    // Update displayed values
    updateTotalPrice();
  });

  // Listen for manual changes to quantity input
  quantityInput.addEventListener("input", function () {
    let quantity = parseInt(quantityInput.value);

    // Ensure the quantity is at least 1
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
      quantityInput.value = quantity;
    }

    // Update displayed values
    updateTotalPrice();
  });

  // Initialize the total price when the page loads
  updateTotalPrice();
});

// login button function
function toggleLogin() {
  const loginContainer = document.getElementById("loginContainer");
  if (
    loginContainer.style.display === "none" ||
    loginContainer.style.display === ""
  ) {
    loginContainer.style.display = "flex";
  } else {
    loginContainer.style.display = "none";
  }
}
//closing buttons
function closeLogin() {
  const loginContainer = document.getElementById("loginContainer");
  const blurredOverlay = document.getElementById("blurredOverlay");

  loginContainer.style.display = "none"; // Hide the login popup
  blurredOverlay.style.display = "none"; // Hide the blurred overlay
}

// login blur effect function
function showLogin() {
  const loginContainer = document.getElementById("loginContainer");
  const blurredOverlay = document.getElementById("blurredOverlay");

  loginContainer.style.display = "flex";
  blurredOverlay.style.display = "block";
}

var heroSwiper = new Swiper(".heroSwiper", {
  slidesPerView: 1,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

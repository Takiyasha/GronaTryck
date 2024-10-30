document.addEventListener("DOMContentLoaded", function () {
  const addToOrderBtn = document.getElementById("addToOrderBtn");
  const quantityInput = document.getElementById("quantityInput");

  if (addToOrderBtn) {
    addToOrderBtn.addEventListener("click", function () {
      // Get product details
      const artikelnummer = document
        .querySelector(".alt-text-s")
        .innerText.split(": ")[1]
        .trim();
      const selectedColor = document.getElementById("selectedColor").innerText;
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity < 10) {
        alert("Please enter a valid quantity of at least 10.");
        return;
      }

      // Construct the order data to send
      const newOrder = {
        artikelnummer,
        quantity,
        selectedColor,
      };

      // Send the order to the server
      fetch("/order/add-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Order added successfully!");
          } else {
            alert("Failed to add order. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to add order. Please try again.");
        });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Quantity input and price estimation calculation
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
    delay: 2500,
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
    640: {
      // Vid skärmar ≥ 640px
      slidesPerView: 2, // Visa 2 slides
      spaceBetween: 20, // Avstånd mellan slides
    },
    1024: {
      // Vid skärmar ≥ 1024px
      slidesPerView: 3, // Visa 3 slides
      spaceBetween: 30, // Avstånd mellan slides
    },
    1440: {
      // Vid skärmar ≥ 1440px
      slidesPerView: 4, // Visa 4 slides (eller mer beroende på ditt standardvärde)
      spaceBetween: 30, // Samma avstånd som standard
    },
  },
});

var heroSwiper = new Swiper(".hero-swiper", {
  slidesPerView: 1,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
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
    const expanded = header.getAttribute("aria-expanded") === "true" || false;
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

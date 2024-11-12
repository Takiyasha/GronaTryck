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

let contactMessages = [];

document
  .getElementById("contactSendForm")
  .addEventListener("click", function (e) {
    e.preventDefault();

    const email = document.getElementById("contactEmail").value;
    const name = document.getElementById("contactName").value;
    const phone = document.getElementById("contactPhone").value;
    const message = document.getElementById("contactMessage").value;

    const formData = {
      email: email,
      name: name,
      phone: phone,
      message: message,
    };

    contactMessages.push(formData);

    const jsonData = JSON.stringify(contactMessages, null, 2);

    // Simulera att data sparas i en fil
    console.log("Data sparad i contactMessages.json:", jsonData);

    // Återställ formuläret
    document.getElementById("contactForm").reset();

    alert("Meddelandet har sparats i contactMessages!");
  });

document.getElementById("attachFile").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Funktionen för att bifoga fil är inte implementerad i detta exempel.");
});

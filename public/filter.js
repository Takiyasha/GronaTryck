document.addEventListener("DOMContentLoaded", function () {
  // Get the elements
  const filterIcon = document.querySelector(".store-container-filtering svg");
  const filterSidebar = document.getElementById("filterSidebar");
  const closeFilterButton = document.getElementById("closeFilterSidebar");
  const storeContainer = document.querySelector(".store-container");

  // Function to toggle the filter sidebar
  function toggleFilterSidebar() {
    if (filterSidebar) {
      filterSidebar.classList.toggle("show");
      storeContainer.classList.toggle("push-right");
    }
  }

  // Add click event listeners for opening and closing filter sidebar
  if (filterIcon) {
    filterIcon.addEventListener("click", toggleFilterSidebar);
  }
  if (closeFilterButton) {
    closeFilterButton.addEventListener("click", toggleFilterSidebar);
  }

  // Elements for filters
  const colorButtons = document.querySelectorAll(".color-swatch");
  const priceInputs = document.querySelectorAll(".price-inputs input");
  const fitCheckboxes = document.querySelectorAll(".fit-option input");
  const productsContainer = document.getElementById("productsContainer");

  // Original products data for reference
  const productsDataElement = document.getElementById("productsData");
  if (productsDataElement) {
    try {
      console.log(
        "productsDataElement content:",
        productsDataElement.textContent
      );
      products = JSON.parse(productsDataElement.textContent);
      console.log("Products successfully parsed:", products);
    } catch (error) {
      console.error("Failed to parse products data:", error);
      return;
    }
  }

  // Apply filters function
  function applyFilters() {
    console.log("Applying filters...");

    let filteredProducts = [...products];

    // Color Filter Logic
    const selectedColorButton = document.querySelector(
      ".color-swatch.selected"
    );
    if (selectedColorButton) {
      const selectedColor = selectedColorButton
        .getAttribute("data-color")
        .toLowerCase();
      console.log("Selected color:", selectedColor);

      filteredProducts = filteredProducts.filter((product) =>
        product.products_images.some(
          (img) => img.simplified_color.toLowerCase() === selectedColor
        )
      );
    } else {
      console.log("No color selected.");
    }

    // Price Filter Logic
    const minPrice = parseInt(priceInputs[0].value) || 0;
    const maxPrice = parseInt(priceInputs[1].value) || Infinity;
    console.log("Price range selected:", minPrice, "-", maxPrice);

    filteredProducts = filteredProducts.filter((product) => {
      const lowestPrice = Math.min(
        ...product.price_tiers.map((tier) => tier.price_per_unit)
      );
      return lowestPrice >= minPrice && lowestPrice <= maxPrice;
    });

    // Fit Type Filter Logic
    const selectedFits = Array.from(fitCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value.toLowerCase());

    if (selectedFits.length > 0) {
      console.log("Selected fits:", selectedFits);
      filteredProducts = filteredProducts.filter((product) =>
        selectedFits.includes(product.fit.toLowerCase())
      );
    } else {
      console.log("No fits selected.");
    }

    console.log("Filtered products count:", filteredProducts.length);
    renderProducts(filteredProducts);
  }

  // Render products function
  function renderProducts(products) {
    if (productsContainer) {
      productsContainer.innerHTML = "";

      if (products.length === 0) {
        productsContainer.innerHTML = "<p>Inga produkter hittades.</p>";
        return;
      }

      products.forEach((product) => {
        const productHTML = `
          <div class="gt-product">
            <div class="gt-product-image">
                        <a href="/produktsidan/${product.id}">
                            <picture class="gt-product-image">
                                <source srcset="${
                                  product.model_image_webp.image
                                }" type="image/webp">
                                <img
                                    src="${product.model_image_jpg.image}"
                                    alt="${product.name}"
                                    class="gt-product-img"
                                />
                            </picture>
                        </a>
                    </div>
            <div class="gt-product-info">
              <p class="gt-product-price heading-s">
                ${
                  product.price_tiers.length > 0
                    ? `${
                        product.price_tiers[product.price_tiers.length - 1]
                          .price_per_unit
                      } kr - ${product.price_tiers[0].price_per_unit} kr`
                    : "Price unavailable"
                }
              </p>
              <p class="gt-product-name body-text">${product.name}</p>
            </div>
            <div class="gt-product-extra-info">
              <p class="body-text">${product.fit}</p>
              <p class="body-text">Minimum: ${product.minimum}</p>
              <p class="body-text">${product.egenskaper_info[2]}</p>
              <p class="body-text">Färger: ${product.products_images.length}</p>
            </div>
          </div>
        `;
        productsContainer.insertAdjacentHTML("beforeend", productHTML);
      });
    }
  }

  // Event listeners for color swatches
  colorButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (button.classList.contains("selected")) {
        button.classList.remove("selected");
      } else {
        colorButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      }
      console.log(`Color button clicked: ${button.getAttribute("data-color")}`);
      applyFilters();
    });
  });

  priceInputs.forEach((input) => {
    input.addEventListener("input", function () {
      console.log("Price input changed:", input.value);
      applyFilters();
    });
  });

  fitCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      console.log(
        `Fit checkbox changed: ${checkbox.value}, Checked: ${checkbox.checked}`
      );
      applyFilters();
    });
  });

  // Initial render to show all products
  renderProducts(products);
});


//Sort button

const sortButton = document.getElementById('sortButton');
        const clearSortLink = document.getElementById('clearSort');

        function sortProducts(order) {
            if (order === 'cheapest') {
                sortButton.textContent = 'Billigast';
            } else if (order === 'expensive') {
                sortButton.textContent = 'Dyrast';
            }
            
            clearSortLink.style.display = 'block';
            
        }

        function clearSort() {
          sortButton.textContent = 'Sortera efter';
          clearSortLink.style.display = 'none';
        
          // Återställ original ordning
          renderProducts(products);
        }
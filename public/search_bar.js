document.addEventListener("DOMContentLoaded", function () {
  const searchToggle = document.getElementById("searchToggle");
  const closeSearch = document.getElementById("closeSearch");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  let products = [];

  // Fetch products data from products.json file
  fetch("/data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      products = data; // Store the products for use in search
    })
    .catch((error) => console.error("Error fetching products:", error));

  // Function to toggle the search dropdown
  function toggleSearch() {
    searchDropdown.classList.toggle("active");
    if (searchDropdown.classList.contains("active")) {
      searchInput.focus();
    }
  }

  // Function to close the search dropdown
  function closeSearchDropdown() {
    searchDropdown.classList.remove("active");
    searchResults.innerHTML = ""; // Clear search results when closing the dropdown
  }

  // Event listeners for opening and closing the search bar
  searchToggle.addEventListener("click", toggleSearch);
  closeSearch.addEventListener("click", closeSearchDropdown);

  // Close search when pressing the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && searchDropdown.classList.contains("active")) {
      closeSearchDropdown();
    }
  });

  // Close search when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      searchDropdown.contains(event.target) ||
      searchToggle.contains(event.target);
    if (!isClickInside && searchDropdown.classList.contains("active")) {
      closeSearchDropdown();
    }
  });

  // Function to filter products based on the category typed into the search bar
  function searchProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
      // If search is empty, clear search results
      searchResults.innerHTML = "";
      return;
    }

    // Filter products based on the category or name
    const filteredProducts = products.filter((product) => {
      return (
        product.category.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm)
      );
    });

    renderProducts(filteredProducts);
  }

  // Add event listener to the search input field for real-time search
  searchInput.addEventListener("input", searchProducts);

  // Function to render the filtered products below the search bar
  function renderProducts(products) {
    searchResults.innerHTML = "";

    if (products.length === 0) {
      searchResults.innerHTML = "<p class='body-text'>Inga produkter hittades.</p>";
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
          </div>
        `;
      searchResults.insertAdjacentHTML("beforeend", productHTML);
    });
  }
});

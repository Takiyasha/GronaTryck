document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("quantityInput");
  const priceEstimationElement = document.getElementById("priceEstimation");
  const productId = document.getElementById("productId").value;

  console.log("Product ID:", productId); // Debugging log

  if (quantityInput && priceEstimationElement && productId) {
    // Fetch products data from products.json file
    fetch("/data/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((products) => {
        console.log("Products fetched successfully:", products); // Debugging log

        // Find the product with the matching ID
        const product = products.find(
          (product) => product.id === parseInt(productId)
        );

        if (!product) {
          console.error("Product not found");
          return;
        }

        console.log("Selected Product:", product); // Debugging log

        // Function to calculate and display the price based on the quantity
        const calculatePrice = () => {
          const quantity = parseInt(quantityInput.value);
          console.log("Quantity input value:", quantity); // Debugging log

          if (isNaN(quantity) || quantity < product.minimum) {
            priceEstimationElement.innerText = "-kr";
            console.log("Invalid quantity or less than minimum required."); // Debugging log
            return;
          }

          // Determine the price per unit based on the quantity
          let pricePerUnit = 0;
          for (const tier of product.price_tiers) {
            const [min, max] = tier.range.split("-").map((v) => {
              return v === "+" ? Infinity : parseInt(v);
            });

            if (quantity >= min && quantity <= (max || Infinity)) {
              pricePerUnit = tier.price_per_unit;
              break;
            }
          }

          console.log("Price per unit:", pricePerUnit); // Debugging log

          // Calculate and display the estimated price
          if (pricePerUnit > 0) {
            const estimatedPrice = quantity * pricePerUnit;
            priceEstimationElement.innerText =
              estimatedPrice.toLocaleString() + " kr";
          } else {
            priceEstimationElement.innerText = "-kr";
          }
        };

        // Add event listener to the quantity input field to update price on change
        quantityInput.addEventListener("input", calculatePrice);

        // Initial calculation to set default value
        calculatePrice();
      })
      .catch((error) => console.error("Error fetching products:", error));
  }
});

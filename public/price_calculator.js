// Price calculation function that can be reused in different scripts
function calculatePrice(quantity, priceTiers, minimumQuantity) {
  if (isNaN(quantity) || quantity < minimumQuantity) {
    return null;
  }

  let pricePerUnit = 0;
  for (const tier of priceTiers) {
    const [min, max] = tier.range.includes("+")
      ? [parseInt(tier.range.split("+")[0]), Infinity]
      : tier.range.split("-").map((v) => parseInt(v));

    if (quantity >= min && quantity <= (max || Infinity)) {
      pricePerUnit = tier.price_per_unit;
      break;
    }
  }

  if (pricePerUnit > 0) {
    return quantity * pricePerUnit;
  } else {
    return null;
  }
}

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
        const calculateAndDisplayPrice = () => {
          const quantity = parseInt(quantityInput.value);
          console.log("Quantity input value:", quantity); // Debugging log

          const estimatedPrice = calculatePrice(
            quantity,
            product.price_tiers,
            product.minimum
          );

          if (estimatedPrice !== null) {
            priceEstimationElement.innerText =
              estimatedPrice.toLocaleString() + " kr";
          } else {
            priceEstimationElement.innerText = "-kr";
            console.log("Invalid quantity or less than minimum required."); // Debugging log
          }
        };

        // Add event listener to the quantity input field to update price on change
        quantityInput.addEventListener("input", calculateAndDisplayPrice);

        // Initial calculation to set default value
        calculateAndDisplayPrice();
      })
      .catch((error) => console.error("Error fetching products:", error));
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("quantityInput");
  const priceEstimationElement = document.getElementById("priceEstimation");

  if (quantityInput && priceEstimationElement) {
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
      priceEstimationElement.innerText =
        estimatedPrice.toLocaleString() + " kr";
    });
  }
});

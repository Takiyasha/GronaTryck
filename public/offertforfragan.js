document.addEventListener("DOMContentLoaded", () => {
  console.log("offertforfragan.js loaded");

  // Retrieve checkout items from session storage
  const checkoutItems =
    JSON.parse(sessionStorage.getItem("checkoutItems")) || [];
  console.log("Checkout Items:", checkoutItems);

  // Get references to the HTML elements (use distinct IDs for "Offertförfrågan" page)
  const productList = document.getElementById("product-list");
  const totalPriceElement = document.getElementById("offertTotalPrice");
  const momsPriceElement = document.getElementById("offertVatAmount");
  const sumPriceElement = document.getElementById("offertSumPrice");

  // Check if elements exist
  if (
    !productList ||
    !totalPriceElement ||
    !momsPriceElement ||
    !sumPriceElement
  ) {
    console.error("One or more required HTML elements are missing");
    return;
  }

  // Check if there are any items to display
  if (checkoutItems.length === 0) {
    productList.innerHTML = "<p>Din offertförfrågan är tom.</p>";
    totalPriceElement.innerText = "Varukostnad: 0 kr";
    momsPriceElement.innerText = "Moms från: 0 kr";
    sumPriceElement.innerText = "0 kr";
    return;
  }

  // Populate product list and calculate totals
  let itemsHTML = "";
  let totalPrice = 0;

  checkoutItems.forEach((item) => {
    const itemTotalPrice = item.price;

    itemsHTML += `
        <div class="checkout-item">
          <div class="checkout-item-image">
            <img src="${item.image}" alt="${item.name}">
            <p class="body-text"><strong>Färg: ${item.color}</strong></p>
          </div>
            <p class="body-text"><strong>${item.quantity}</strong></p>
            <p class="body-text"><strong>${itemTotalPrice.toLocaleString()} kr</strong></p>
        </div>
      `;

    totalPrice += itemTotalPrice;
  });

  productList.innerHTML = itemsHTML;

  // Calculate moms (VAT) and sum price
  const momsPrice = Math.round(totalPrice * 0.25);
  const sumPrice = totalPrice + momsPrice;

  // Update the values in the HTML
  totalPriceElement.innerText = `Varukostnad: ${totalPrice.toLocaleString()} kr`;
  momsPriceElement.innerText = `Moms från: ${momsPrice.toLocaleString()} kr`;
  sumPriceElement.innerText = `Summa: ${sumPrice.toLocaleString()} kr`;

  console.log("Total Price Calculated:", totalPrice);
  console.log("Moms Price Calculated:", momsPrice);
  console.log("Sum Price Calculated:", sumPrice);
  console.log("Updated HTML with calculated values.");
});

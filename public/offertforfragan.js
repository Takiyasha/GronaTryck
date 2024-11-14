document.addEventListener("DOMContentLoaded", () => {
  console.log("offertforfragan.js loaded"); // Check if script is loaded

  // Retrieve checkout items from session storage
  const checkoutItems =
    JSON.parse(sessionStorage.getItem("checkoutItems")) || [];
  console.log("Checkout Items:", checkoutItems); // Debugging output

  // Get references to the HTML elements
  const productList = document.getElementById("product-list");
  const totalPriceElement = document.getElementById("totalPrice");
  const momsPriceElement = document.getElementById("momsPrice");
  const sumPriceElement = document.getElementById("sumPrice");

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
    totalPriceElement.innerText = "0 kr";
    momsPriceElement.innerText = "0 kr";
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
              <p>${item.name} (Art.nr: ${item.artikelnummer})</p>
              <p>${item.quantity}</p>
              <p>${itemTotalPrice.toLocaleString()} kr</p>
            </div>
          `;

    totalPrice += itemTotalPrice;
  });

  // Render the product list
  productList.innerHTML = itemsHTML;

  // Calculate moms (VAT) and sum price
  const momsPrice = Math.round(totalPrice * 0.25);
  const sumPrice = totalPrice + momsPrice;

  // Update the values in the HTML
  totalPriceElement.innerText = `${totalPrice.toLocaleString()} kr`;
  momsPriceElement.innerText = `${momsPrice.toLocaleString()} kr`;
  sumPriceElement.innerText = `${sumPrice.toLocaleString()} kr`;

  console.log("Total Price:", totalPrice);
  console.log("Moms Price:", momsPrice);
  console.log("Sum Price:", sumPrice);
});

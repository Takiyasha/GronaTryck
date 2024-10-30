const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Paths to JSON files
const ordersFilePath = path.join(__dirname, "../data/orders.json");
const productsFilePath = path.join(__dirname, "../data/products.json");

// Route to handle new orders
router.post("/add-order", (req, res) => {
  const { artikelnummer, quantity, selectedColor } = req.body;

  // Read products from products.json to find the product
  fs.readFile(productsFilePath, "utf8", (err, productsData) => {
    if (err) {
      console.error("Error reading products file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let products = [];
    if (productsData) {
      products = JSON.parse(productsData);
    }

    // Find the product by artikelnummer
    const product = products.find((p) => p.artikelnummer == artikelnummer);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    // Calculate price
    let pricePerUnit;
    for (let tier of product.price_tiers) {
      const [minRange] = tier.range.split("-").map((val) => parseInt(val));
      if (quantity >= minRange) {
        pricePerUnit = tier.price_per_unit;
      }
    }

    if (!pricePerUnit) {
      pricePerUnit =
        product.price_tiers[product.price_tiers.length - 1].price_per_unit;
    }

    const totalPrice = pricePerUnit * quantity;

    // Format the price with commas for thousands separation
    const formattedPrice = `${totalPrice
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kr`;

    // Construct order object
    const newOrder = {
      name: product.name,
      artikelnummer: product.artikelnummer,
      color: selectedColor,
      quantity: quantity,
      price: formattedPrice,
      fit: product.fit,
    };

    // Read existing orders
    fs.readFile(ordersFilePath, "utf8", (err, ordersData) => {
      if (err) {
        console.error("Error reading orders file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      let orders = [];
      if (ordersData) {
        orders = JSON.parse(ordersData);
      }

      // Add the new order to orders
      orders.push(newOrder);

      // Write the updated orders to orders.json
      fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
        if (err) {
          console.error("Error writing to orders file:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        res.json({ success: true, message: "Order added successfully!" });
      });
    });
  });
});

module.exports = router;

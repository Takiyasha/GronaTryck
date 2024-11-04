const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Paths to JSON files
const ordersFilePath = path.join(__dirname, "../data/orders.json");
const productsFilePath = path.join(__dirname, "../data/products.json");

// Route to handle new orders
router.post("/add-order", (req, res) => {
  console.log("Received order data: ", req.body); // Log incoming data
  const { artikelnummer, quantity, color } = req.body;

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

    // Calculate the price based on quantity and price tiers
    const price = calculatePrice(quantity, product.price_tiers);

    // Construct order object
    const newOrder = {
      name: product.name,
      artikelnummer: product.artikelnummer,
      color: color,
      quantity: quantity,
      price: price.toLocaleString() + " kr", // Formatted price
      fit: product.fit,
      image: product.model_image.image,
    };

    console.log("New order data to be saved: ", newOrder); // Log order to be saved

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

      // Check if order already exists to update it
      const existingOrderIndex = orders.findIndex(
        (order) =>
          order.artikelnummer === newOrder.artikelnummer &&
          order.color === newOrder.color
      );

      if (existingOrderIndex !== -1) {
        // If order exists, update the quantity
        orders[existingOrderIndex].quantity += quantity;
        orders[existingOrderIndex].price =
          calculatePrice(
            orders[existingOrderIndex].quantity,
            product.price_tiers
          ).toLocaleString() + " kr";
      } else {
        // Add the new order to orders
        orders.push(newOrder);
      }

      // Write the updated orders to orders.json
      fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
        if (err) {
          console.error("Error writing to orders file:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        console.log("Order added successfully to orders.json"); // Log successful write
        res.json({ success: true, message: "Order added successfully!" });
      });
    });
  });
});

// Route to get all orders
router.get("/get-orders", (req, res) => {
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

    res.json({ success: true, orders: orders });
  });
});

// Route to handle deleting an order
router.delete("/delete-order", (req, res) => {
  const { artikelnummer, color } = req.body;

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

    // Filter out the order to be deleted
    const updatedOrders = orders.filter(
      (order) =>
        !(order.artikelnummer === artikelnummer && order.color === color)
    );

    // Write updated orders to orders.json
    fs.writeFile(
      ordersFilePath,
      JSON.stringify(updatedOrders, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to orders file:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        console.log("Order deleted successfully from orders.json"); // Log successful delete
        res.json({ success: true, message: "Order deleted successfully!" });
      }
    );
  });
});

// Function to calculate price based on quantity
function calculatePrice(quantity, priceTiers) {
  let pricePerUnit = 0;

  // Iterate through price tiers to determine the correct price per unit
  for (let tier of priceTiers) {
    const [minRange, maxRange] = tier.range.includes("+")
      ? [parseInt(tier.range.split("+")[0]), Infinity]
      : tier.range.split("-").map(Number);

    if (
      quantity >= minRange &&
      (maxRange === undefined || quantity <= maxRange)
    ) {
      pricePerUnit = tier.price_per_unit;
      break;
    }
  }

  if (pricePerUnit === 0) {
    pricePerUnit = priceTiers[priceTiers.length - 1].price_per_unit;
  }

  return pricePerUnit * quantity;
}

module.exports = router;

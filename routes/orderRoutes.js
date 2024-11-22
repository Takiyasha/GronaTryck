const express = require("express");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const router = express.Router();

// Promisify fs methods for better readability with async/await
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Paths to JSON files
const ordersFilePath = path.join(__dirname, "../data/orders.json");

// Middleware to parse JSON request bodies
router.use(express.json());

router.delete("/clear-cart", (req, res) => {
  fs.writeFile(ordersFilePath, "[]", (err) => {
    if (err) {
      console.error("Error clearing orders:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to clear orders." });
    }

    console.log("Orders cleared successfully.");
    res.json({ success: true, message: "Orders cleared successfully." });
  });
});

// Route to clear the cart
router.delete("/clear-cart", (req, res) => {
  fs.writeFile(cartFilePath, "[]", (err) => {
    if (err) {
      console.error("Error clearing cart:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to clear cart." });
    }

    console.log("Cart cleared successfully.");
    res.json({ success: true, message: "Cart cleared successfully." });
  });
});

// Route to handle new orders
router.post("/add-order", async (req, res) => {
  const { artikelnummer, quantity, color, name, price, image } = req.body;

  // Check for missing fields
  if (!artikelnummer || !quantity || !color || !name || !price || !image) {
    console.error("Missing input data:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Missing input data for order." });
  }

  try {
    // Read current orders
    const ordersData = await readFileAsync(ordersFilePath, "utf8");
    const orders = ordersData ? JSON.parse(ordersData) : [];

    // Construct new order
    const newOrder = { artikelnummer, quantity, color, name, price, image };

    // Add new order to the orders array
    orders.push(newOrder);

    // Write the updated orders to orders.json
    await writeFileAsync(ordersFilePath, JSON.stringify(orders, null, 2));
    console.log("Order added successfully to orders.json");

    res.json({ success: true, message: "Order added successfully!" });
  } catch (error) {
    console.error("Error processing add-order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to get all orders
router.get("/get-orders", async (req, res) => {
  try {
    const ordersData = await readFileAsync(ordersFilePath, "utf8");
    const orders = ordersData ? JSON.parse(ordersData) : [];

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error reading orders file:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to handle deleting an order
router.delete("/delete-order", async (req, res) => {
  const { artikelnummer, color } = req.body;

  if (!artikelnummer || !color) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data." });
  }

  try {
    const ordersData = await readFileAsync(ordersFilePath, "utf8");
    const orders = ordersData ? JSON.parse(ordersData) : [];

    // Filter out the order to be deleted
    const updatedOrders = orders.filter(
      (order) =>
        !(order.artikelnummer === artikelnummer && order.color === color)
    );

    // Write the updated orders to orders.json
    await writeFileAsync(
      ordersFilePath,
      JSON.stringify(updatedOrders, null, 2)
    );
    console.log("Order deleted successfully from orders.json");

    res.json({ success: true, message: "Order deleted successfully!" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

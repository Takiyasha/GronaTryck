const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Paths to JSON files
const ordersFilePath = path.join(__dirname, "../data/orders.json");

// Route to handle new orders
router.post("/add-order", (req, res) => {
  const { artikelnummer, quantity, color, name, price, image } = req.body;

  // Check for missing fields
  if (!artikelnummer || !quantity || !color || !name || !price || !image) {
    console.error("Missing input data:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Missing input data for order." });
  }

  // Proceed with adding the order if all required fields are present
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

    // Construct new order
    const newOrder = {
      artikelnummer,
      quantity,
      color,
      name,
      price,
      image,
    };

    // Add new order to the orders array
    orders.push(newOrder);

    // Write the updated orders to orders.json
    fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        console.error("Error writing to orders file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      console.log("Order added successfully to orders.json");
      res.json({ success: true, message: "Order added successfully!" });
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
      try {
        orders = JSON.parse(ordersData);
      } catch (parseError) {
        console.error("Error parsing orders file:", parseError);
        return res
          .status(500)
          .json({ success: false, message: "Invalid orders data" });
      }
    }

    res.json({ success: true, orders: orders });
  });
});

// Route to handle deleting an order
router.delete("/delete-order", (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const { artikelnummer, color } = JSON.parse(body);

      if (!artikelnummer || !color) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid input data." });
      }

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

            console.log("Order deleted successfully from orders.json");
            res.json({ success: true, message: "Order deleted successfully!" });
          }
        );
      });
    } catch (error) {
      console.error("Error parsing request body:", error);
      res
        .status(400)
        .json({ success: false, message: "Invalid JSON in request body." });
    }
  });
});

module.exports = router;

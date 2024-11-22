const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const ordersFilePath = path.join(__dirname, "../data/orders.json");
const offertFilePath = path.join(__dirname, "../data/offert.json");

// Clear all orders in `orders.json`
router.delete("/clear-cart", (req, res) => {
  console.log("Received request to clear all orders.");

  try {
    // Write an empty array to `orders.json`
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2), "utf8");
    console.log("Orders.json has been cleared.");
    res.json({ success: true, message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Error clearing orders.json:", error);
    res.status(500).json({ success: false, message: "Failed to clear cart." });
  }
});

// Submit offert
router.post("/submit-offert", (req, res) => {
  console.log("Received data:", req.body);

  const newOffert = {
    ...req.body,
    submittedAt: new Date().toISOString(),
  };

  // Read current offert data
  fs.readFile(offertFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading offert.json:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    let offertData = [];
    if (data) {
      try {
        offertData = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing offert.json:", parseErr);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
    }

    // Add new offert to data
    offertData.push(newOffert);

    // Save updated offert data
    fs.writeFile(
      offertFilePath,
      JSON.stringify(offertData, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to offert.json:", writeErr);
          return res
            .status(500)
            .json({ success: false, message: "Server error" });
        }

        console.log("New offert saved:", newOffert);

        // Clear orders.json after saving the offert
        fs.writeFile(
          ordersFilePath,
          JSON.stringify([], null, 2),
          (clearErr) => {
            if (clearErr) {
              console.error("Error clearing orders.json:", clearErr);
              return res
                .status(500)
                .json({ success: false, message: "Failed to clear orders." });
            }
            console.log("Orders.json cleared after submitting the offert.");
            res.json({
              success: true,
              message: "Offert successfully submitted!",
            });
          }
        );
      }
    );
  });
});

module.exports = router;

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Path to JSON file where messages are stored
const messagesFilePath = path.join(__dirname, "../data/contactMessages.json");

// Route to handle contact form submissions
router.post("/send-message", (req, res) => {
  const { email, name, phone, message } = req.body;

  // Construct new message object
  const newMessage = {
    email,
    name,
    phone,
    message,
    timestamp: new Date().toISOString(),
  };

  // Read existing messages
  fs.readFile(messagesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading contact messages file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let messages = [];
    if (data) {
      try {
        messages = JSON.parse(data);
      } catch (err) {
        console.error("Error parsing contact messages file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }

    // Add the new message to the array
    messages.push(newMessage);

    // Write updated messages to the JSON file
    fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        console.error("Error writing to contact messages file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      // Respond with success
      res.json({
        success: true,
        message: "Contact message saved successfully!",
      });
    });
  });
});

module.exports = router;

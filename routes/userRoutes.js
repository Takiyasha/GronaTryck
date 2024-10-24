// userRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Path to the JSON file where users are stored
const usersFilePath = path.join(__dirname, "../data/users.json");

// Route for user login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  // Read existing users from the JSON file
  fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    // Check if user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found!" });
    }

    // Validate password
    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });
    }

    // Success response
    return res
      .status(200)
      .json({ success: true, message: "Login successful!" });
  });
});

module.exports = router;

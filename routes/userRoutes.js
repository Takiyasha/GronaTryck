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

    // Save user session
    req.session.user = { email: user.email, name: user.name };
    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Session save failed" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Login successful!" });
    });
  });
});

// Route to check user session
router.get("/session", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route for user logout
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Logout failed" });
      } else {
        return res.json({ success: true, message: "Logout successful" });
      }
    });
  } else {
    return res.json({ success: true, message: "Logout successful" });
  }
});

module.exports = router;

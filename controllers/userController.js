const fs = require("fs");
const path = require("path");

// Path to the JSON file where users are stored
const usersFilePath = path.join(__dirname, "../data/users.json");

exports.createUser = (req, res) => {
  const newUser = req.body;

  // Basic validation to check if fields are provided
  if (
    !newUser.email ||
    !newUser.confirmEmail ||
    newUser.email !== newUser.confirmEmail
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Emails do not match!" });
  }
  if (
    !newUser.password ||
    !newUser.confirmPassword ||
    newUser.password !== newUser.confirmPassword
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match!" });
  }

  // Load existing users
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (err) {
      console.error("Error parsing users file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === newUser.email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    // Add new user and save
    users.push({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      address: newUser.address,
      postalCode: newUser.postalCode,
      phoneNumber: newUser.phoneNumber,
    });

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error writing users file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      res.json({ success: true, message: "Account created successfully!" });
    });
  });
};

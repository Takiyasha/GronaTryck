const fs = require("fs");
const path = require("path");

// Path to the JSON file where users are stored
const usersFilePath = path.join(__dirname, "../data/users.json");

// Create user account
exports.createUser = (req, res) => {
  const newUser = req.body;

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

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let users = data ? JSON.parse(data) : [];

    if (users.find((user) => user.email === newUser.email)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    users.push({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
    });
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
      res.json({ success: true, message: "Account created successfully!" });
    });
  });
};

// User login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    const users = data ? JSON.parse(data) : [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Save user session
      req.session.user = { email: user.email, name: user.name };
      req.session.save((err) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Session save failed" });
        }
        console.log("Session after login:", req.session);
        return res.json({ success: true, message: "Login successful!" });
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or password" });
    }
  });
};

// Check user session
exports.checkSession = (req, res) => {
  console.log("Checking session:", req.session);
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

// User logout
exports.logoutUser = (req, res) => {
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
    res.json({ success: true, message: "Logout successful" });
  }
};

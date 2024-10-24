const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Enable live reload by injecting the livereload script
app.use(connectLivereload());

// Serve static files like CSS, JS, and images from the 'public' directory
app.use("/static", express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/", productRoutes);
app.use("/user", userRoutes);

// Create the livereload server
const liveReloadServer = livereload.createServer({
  exts: ["js", "css", "ejs"], // Watch specific file extensions
  debug: true, // Enable logging
});
liveReloadServer.watch([
  path.join(__dirname, "public"),
  path.join(__dirname, "views"),
]);

// Notify livereload server when files change
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Handle user registration and save it to users.json
app.post("/user/register", (req, res) => {
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
  const usersFilePath = path.join(__dirname, "data", "users.json");
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
});

// Routes for other pages
app.get("/index", (req, res) => {
  res.redirect("/"); // Redirect to the root route
});

app.get("/butik", (req, res) => {
  res.render("butik");
});

app.get("/stanleyStella", (req, res) => {
  res.render("stanleyStella");
});

app.get("/hallbarhet", (req, res) => {
  res.render("hallbarhet");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/kontakt", (req, res) => {
  res.render("kontakt");
});

app.get("/gots", (req, res) => {
  res.render("gots");
});

app.get("/miljo", (req, res) => {
  res.render("miljo");
});

app.get("/villkor", (req, res) => {
  res.render("villkor");
});

app.get("/tryck", (req, res) => {
  res.render("tryck");
});

// Start the express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

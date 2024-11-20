const express = require("express");
const session = require("express-session");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Set up sessions before the routes
app.use(
  session({
    secret: "your-secret-key", // Use a long, random string for security
    resave: false, // Don't save session if it wasn't modified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      secure: false, // Set to `true` if using HTTPS, otherwise `false`
      httpOnly: true, // Helps prevent cross-site scripting attacks
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration (e.g., 1 day)
    },
  })
);

// Enable live reload by injecting the livereload script
app.use(connectLivereload());

// Serve static files like CSS, JS, and images from the 'public' directory
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Import user and product routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const offertRoutes = require("./routes/offertRoutes");

// Use routes
app.use("/", productRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/api", offertRoutes);

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

  // Check if file exists and ensure directory is correct
  if (!fs.existsSync(usersFilePath)) {
    console.log("Creating users.json file because it does not exist.");
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    let users = [];
    try {
      users = data ? JSON.parse(data) : [];
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

    console.log("Attempting to write to users.json...");

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error writing users file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      console.log("User successfully added to users.json");
      res.json({ success: true, message: "Account created successfully!" });
    });
  });
});

// Link to the product page
app.get("/produktsidan/:id", (req, res) => {
  const productId = req.params.id;

  // Load products from products.json file
  fs.readFile(
    path.join(__dirname, "data/products.json"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.error("Error reading products file:", err);
        return res.status(500).send("Internal Server Error");
      }

      const products = JSON.parse(data);
      const product = products.find((p) => p.id == productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Render the produktsidan view and pass the individual product as well as all products for the slider
      res.render("produktsidan", { product, products });
    }
  );
});

// Serve the products.json file at /data/products.json
app.get("/data/products.json", (req, res) => {
  const productsFilePath = path.join(__dirname, "data", "products.json");
  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading products file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

//Loading products in klader
app.get("/klader", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data/products.json"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.error("Error reading products file:", err);
        return res.status(500).send("Internal Server Error");
      }

      const products = JSON.parse(data);
      res.render("klader", { products });
    }
  );
});

app.post("/api/submit-offert", (req, res) => {
  console.log("Received POST request:", req.body);
  res.json({ success: true, message: "Offert received!" });
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

app.get("/faq", (req, res) => {
  res.render("faq");
});

app.get("/offertforfragan", (req, res) => {
  res.render("offertforfragan");
});

app.get("/installning-sidan/mina-sidor", (req, res) => {
  res.render("installning-sidan/mina-sidor");
});

// Start the express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

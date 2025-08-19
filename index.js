const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Static + views
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Tiny request logger (once)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Healthcheck (once)
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---------- TEMP: prove "/" responds (remove after debugging) ----------
app.get("/", (req, res) => {
  res.type("text/plain").send("Home route OK");
});

// ---------- Routes ----------
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const offertRoutes = require("./routes/offertRoutes");

app.use("/", productRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/api", offertRoutes);

// ---------- Custom endpoints (yours, untouched) ----------
app.post("/user/register", (req, res) => {
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

  const usersFilePath = path.join(__dirname, "data", "users.json");

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

    const existingUser = users.find((user) => user.email === newUser.email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

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

// Product detail (kept)
app.get("/produktsidan/:id", (req, res) => {
  const productId = req.params.id;

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

      res.render("produktsidan", { product, products });
    }
  );
});

// JSON endpoint
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

// “Klader” page
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

// Other pages
app.get("/index", (req, res) => res.redirect("/"));
app.get("/butik", (req, res) => res.render("butik"));
app.get("/stanleyStella", (req, res) => res.render("stanleyStella"));
app.get("/hallbarhet", (req, res) => res.render("hallbarhet"));
app.get("/about", (req, res) => res.render("about"));
app.get("/kontakt", (req, res) => res.render("kontakt"));
app.get("/gots", (req, res) => res.render("gots"));
app.get("/miljo", (req, res) => res.render("miljo"));
app.get("/villkor", (req, res) => res.render("villkor"));
app.get("/tryck", (req, res) => res.render("tryck"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/offertforfragan", (req, res) => res.render("offertforfragan"));
app.get("/installning-sidan/mina-sidor", (req, res) =>
  res.render("installning-sidan/mina-sidor")
);

// ---------- Error handler (last) ----------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

// ---------- Local dev only ----------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

// routes/productRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Resolve once at boot (works on Vercel: /var/task is CWD)
const productsPath = path.join(process.cwd(), "data", "products.json");

router.get("/", (req, res, next) => {
  try {
    console.time("load-products");
    const raw = fs.readFileSync(productsPath, "utf8"); // sync read is fine for small JSON
    const products = JSON.parse(raw);
    console.timeEnd("load-products");
    return res.render("index", { products });
  } catch (err) {
    console.error("Failed to load products:", err);
    return next(err); // triggers express error handler below
  }
});

module.exports = router;

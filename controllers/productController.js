// controllers/productController.js
const fs = require("fs");
const path = require("path");

const productsPath = path.join(process.cwd(), "data", "products.json");

exports.getAllProducts = (req, res, next) => {
  try {
    const raw = fs.readFileSync(productsPath, "utf8");
    const products = JSON.parse(raw);

    // IMPORTANT: use callback so we always respond or error
    res.render("index", { products }, (err, html) => {
      if (err) {
        console.error("EJS render failed (index):", err);
        return next(err);
      }
      res.type("html").send(html);
    });
  } catch (err) {
    console.error("getAllProducts failed:", err);
    next(err);
  }
};

exports.getProductById = (req, res, next) => {
  try {
    const raw = fs.readFileSync(productsPath, "utf8");
    const products = JSON.parse(raw);
    const product = products.find(
      (p) => String(p.id) === String(req.params.id)
    );
    if (!product) return res.status(404).send("Product not found");

    res.render("produktsidan", { product, products }, (err, html) => {
      if (err) {
        console.error("EJS render failed (produktsidan):", err);
        return next(err);
      }
      res.type("html").send(html);
    });
  } catch (err) {
    console.error("getProductById failed:", err);
    next(err);
  }
};

// keep the write routes disabled on serverless for now
exports.createProduct = (_req, res) =>
  res.status(501).send("Not implemented on serverless");
exports.updateProduct = (_req, res) =>
  res.status(501).send("Not implemented on serverless");
exports.deleteProduct = (_req, res) =>
  res.status(501).send("Not implemented on serverless");

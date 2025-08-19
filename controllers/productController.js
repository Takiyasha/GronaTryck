const fs = require("fs");
const path = require("path");
const productsPath = path.join(process.cwd(), "data", "products.json");

exports.getAllProducts = (req, res, next) => {
  try {
    console.time("load-products");
    const raw = fs.readFileSync(productsPath, "utf8"); // small file => OK
    console.timeEnd("load-products");
    const products = JSON.parse(raw);
    return res.render("index", { products }); // ensure views/index.ejs exists
  } catch (err) {
    console.error("getAllProducts failed:", err);
    return next(err); // will send 500 via error handler
  }
};

exports.getProductById = (req, res, next) => {
  try {
    const products = readProducts();
    const product = products.find(
      (p) => String(p.id) === String(req.params.id)
    );
    if (!product) return res.status(404).send("Product not found");
    // If your template is named "product.ejs", change "produktsidan" to "product"
    return res.render("produktsidan", { product, products });
  } catch (err) {
    console.error("getProductById failed:", err);
    return next(err);
  }
};

// On Vercel, writing to the repo filesystem won't persist and often fails.
// Return 501 so these routes don't hang/crash in production.
exports.createProduct = (req, res) =>
  res.status(501).send("Not implemented on serverless");
exports.updateProduct = (req, res) =>
  res.status(501).send("Not implemented on serverless");
exports.deleteProduct = (req, res) =>
  res.status(501).send("Not implemented on serverless");

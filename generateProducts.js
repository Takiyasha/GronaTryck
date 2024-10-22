const fs = require("fs");
const path = require("path");

// Define the folder where your images are stored
// Adjust this path to match the actual location of the images folder
const imagesFolderPath = path.join(__dirname, "public", "images", "StSt AW24");

fs.readdir(imagesFolderPath, (err, files) => {
  if (err) {
    console.error("Error reading the folder:", err);
    return;
  }

  // Generate products data
  const products = files.map((file, index) => ({
    id: index + 1,
    name: path.basename(file, path.extname(file)), // Use the filename as the name
    price: Math.floor(Math.random() * 1000) + 100, // Random price for example
    image: `/static/images/StSt AW24/${file}`, // Adjusted to match the correct static path
  }));

  // Save the products data to a JSON file
  fs.writeFile(
    path.join(__dirname, "data", "products.json"),
    JSON.stringify(products, null, 2),
    (writeErr) => {
      if (writeErr) {
        console.error("Error writing products.json:", writeErr);
        return;
      }
      console.log("products.json has been successfully generated.");
    }
  );
});

//use the node generateProducts.js to write to the server files(json)

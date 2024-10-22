//////////IMPORTANT/////////////// use the "node generateProducts.js" in Terminal to write to the server files(json)////////////IMPORTANT//////////
const fs = require("fs");
const path = require("path");

// Adjust this path to match the actual location of the images folder
const imagesFolderPath = path.join(__dirname, "public", "images", "StSt AW24");

// Predefined data for attributes
const predefinedAttributes = {
  "Bomber 2.0": {
    colors: ["Black", "Blue", "Green"],
    fit: ["Unisex"],
  },
  Brooker: {
    colors: ["Green", "Black", "White"],
    fit: ["Unisex"],
  },
  "Changer 2.0": {
    colors: ["Blue", "White", "Red", "Green"],
    fit: ["Unisex"],
  },
  "Connector 2.0": {
    colors: ["Black", "Blue", "Red", "White"],
    fit: ["Unisex"],
  },
  Crafter: {
    colors: ["Blue", "Red", "Black", "White"],
    fit: ["Herr"],
  },
  "Creator 2.0": {
    colors: ["Blue", "Red", "White", "Green"],
    fit: ["Unisex"],
  },
  "Cruiser 2.0": {
    colors: ["Blue", "White", "Green", "Red"],
    fit: ["Unisex"],
  },
  "Drummer 2.0": {
    colors: ["Blue", "White", "Red"],
    fit: ["Unisex"],
  },
  Freestyler: {
    colors: ["Blue", "White", "Red", "Green", "Black", "Yellow"],
    fit: ["Unisex"],
  },
  Knoxer: {
    colors: ["Blue", "White", "Black", "Red"],
    fit: ["Unisex"],
  },
  Liner: {
    colors: ["Black", "White"],
    fit: ["Unisex"],
  },
  Mixer: {
    colors: ["Blue", "White", "Green", "Red", "Pink", "Black"],
    fit: ["Unisex"],
  },
  "Prepster 2.0": {
    colors: ["Blue", "White", "Red", "Green", "Yellow", "Pink", "Black"],
    fit: ["Unisex"],
  },
  Puffer: {
    colors: ["Blue", "Black"],
    fit: ["Unisex"],
  },
  "Radder 2.0": {
    colors: ["Blue", "White", "Black", "Green", "Red", "Yellow"],
    fit: ["Unisex"],
  },
  Roller: {
    colors: ["Blue", "Red", "Yellow"],
    fit: ["Unisex"],
  },
  "Slammer 2.0": {
    colors: ["Blue", "White", "Black", "Green", "Red", "Yellow"],
    fit: ["Unisex"],
  },
  "Sparker 2.0": {
    colors: ["Blue", "Red"],
    fit: ["Unisex"],
  },
  Stanley: {
    colors: ["Blue", "Black", "Red", "Yellow", "White", "Green"],
    fit: ["Herr"],
  },
  Stella: {
    colors: ["Blue", "White", "Black", "Green", "Red", "Yellow", "Pink"],
    fit: ["Dam"],
  },
  Striker: {
    colors: ["Blue", "White", "Black", "Red"],
    fit: ["Unisex"],
  },
  Trekker: {
    colors: ["Blue", "Yellow", "Black"],
    fit: ["Unisex"],
  },
  "Trucker 2.0": {
    colors: ["Blue", "Yellow", "Black", "White", "Red", "Green"],
    fit: ["Unisex"],
  },

  // Add more products as needed
};

fs.readdir(imagesFolderPath, (err, files) => {
  if (err) {
    console.error("Error reading the folder:", err);
    return;
  }

  // Generate products data
  const products = files.map((file, index) => {
    const fullName = path.basename(file, path.extname(file));

    // Try to match a base name with the predefined attributes
    const baseName =
      Object.keys(predefinedAttributes).find((name) =>
        fullName.includes(name)
      ) || fullName.split("_")[0];

    // Get the attributes for the matched base name
    const attributes = predefinedAttributes[baseName] || {
      colors: [],
      fit: [],
    };

    return {
      id: index + 1,
      name: baseName,
      price: Math.floor(Math.random() * 1000) + 100, // Random price for example
      image: `/static/images/StSt AW24/${file}`, // Adjusted to match the correct static path
      colors: attributes.colors,
      fit: attributes.fit,
    };
  });

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

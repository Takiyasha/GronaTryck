//////////IMPORTANT/////////////// use the "node generateProducts.js" in Terminal to write to the server files(json)////////////IMPORTANT//////////
const fs = require("fs");
const path = require("path");

// Adjust this path to match the actual location of the images folder
const imagesFolderPath = path.join(__dirname, "public", "images", "StSt AW24");

// Predefined data for attributes
const predefinedAttributes = {
  "Bomber 2.0": {
    category: "Sweater",
    price_tiers: [
      { range: "10-49", price_per_unit: 360 },
      { range: "50-99", price_per_unit: 324 },
      { range: "100-249", price_per_unit: 306 },
      { range: "250-499", price_per_unit: 297 },
      { range: "500+", price_per_unit: 288 },
    ],
    material_info: [
      "85% ekologisk rättvisemärkt, ringspunnen och kammad bomull",
      "15% återvunnen PET",
    ],
    egenskaper_info: [
      "Borstad fleece-insida",
      "1×1 Ribbade muddar",
      "Storlekar från XXS-5XL",
    ],
    fit: "Unisex",
    minimum: 10,
  },
  // Add more products as needed
};

function getRandomArtikelnummer() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
}

function normalizeProductName(name) {
  // Remove unnecessary descriptors like "Long Sleeve"
  return name
    .replace(/long sleeve/gi, "") // Remove "Long Sleeve" (case insensitive)
    .trim(); // Remove leading/trailing whitespace
}

fs.readdir(imagesFolderPath, (err, files) => {
  if (err) {
    console.error("Error reading the folder:", err);
    return;
  }

  // Group images by simplified product name
  const groupedImages = files.reduce((acc, file) => {
    // Extract the product name part and clean it up
    const [productName] = file.split("_");
    const cleanedProductName = normalizeProductName(productName);

    if (!acc[cleanedProductName]) {
      acc[cleanedProductName] = [];
    }
    acc[cleanedProductName].push(file);
    return acc;
  }, {});

  // Generate products data
  const products = Object.keys(groupedImages).map((productName, index) => {
    const attributes = predefinedAttributes[productName] || {
      category: "Default Category",
      price_tiers: [
        { range: "10-49", price_per_unit: 360 },
        { range: "50-99", price_per_unit: 324 },
        { range: "100-249", price_per_unit: 306 },
        { range: "250-499", price_per_unit: 297 },
        { range: "500+", price_per_unit: 288 },
      ],
      material_info: [
        "85% ekologisk rättvisemärkt, ringspunnen och kammad bomull",
        "15% återvunnen PET",
      ],
      egenskaper_info: [
        "Borstad fleece-insida",
        "1×1 Ribbade muddar",
        "Storlekar från XXS-5XL",
      ],
      fit: "Unisex",
      minimum: 10,
    };

    const productImages = groupedImages[productName].map((file) => {
      const colorName = file.split("_")[1] || "Unknown";
      const simplifiedColor = colorName.replace(/[^a-zA-Z ]/g, ""); // Simplify color name

      return {
        image: `/static/images/StSt AW24/${file}`,
        simplified_color: simplifiedColor,
        color_name: colorName,
      };
    });

    return {
      id: index + 1,
      artikelnummer: getRandomArtikelnummer(),
      name: productName,
      category: attributes.category,
      price_tiers: attributes.price_tiers,
      model_image: {
        image: `/static/images/StSt AW24/${groupedImages[productName][0]}`,
        simplified_color: productImages[0]?.simplified_color || "Unknown",
      },
      products_images: productImages,
      material_info: attributes.material_info,
      egenskaper_info: attributes.egenskaper_info,
      fit: attributes.fit,
      minimum: attributes.minimum,
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

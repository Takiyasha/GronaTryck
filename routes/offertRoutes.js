const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const offertFilePath = path.join(__dirname, "../data/offert.json");

// Route to handle "submit-offert" POST requests
router.post("/submit-offert", (req, res) => {
  console.log("Received Data:", req.body); // Debugging

  const newOffert = {
    ...req.body,
    submittedAt: new Date().toISOString(),
  };

  // Read the current data from the JSON file
  fs.readFile(offertFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading offert file:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    let offertData = [];
    if (data) {
      try {
        offertData = JSON.parse(data); // Parse existing data if not empty
      } catch (parseErr) {
        console.error("Error parsing offert file:", parseErr);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }

    // Add the new offert data
    offertData.push(newOffert);

    // Write updated data back to the JSON file
    fs.writeFile(
      offertFilePath,
      JSON.stringify(offertData, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to offert file:", writeErr);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        console.log("New offert saved:", newOffert);
        res.json({ success: true, message: "Offert successfully saved!" });
      }
    );
  });
});

// Export the router
module.exports = router;

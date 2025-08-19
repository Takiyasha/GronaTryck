// api/index.js
const serverless = require("serverless-http");
const app = require("../index"); // Import the Express app you already wrote

module.exports = (req, res) => serverless(app)(req, res);

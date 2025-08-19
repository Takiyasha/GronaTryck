// api/index.js
const app = require("../index");
const serverless = require("serverless-http");

// Export a (req, res) handler
module.exports = serverless(app);

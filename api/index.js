// api/index.js
const serverless = require("serverless-http");
const app = require("../index");

// Export the wrapped handler directly (more reliable)
module.exports = serverless(app);

const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const cors = require("cors");

const app = express();

// Enable live reload by injecting the livereload script
app.use(connectLivereload());

// Serve static files like CSS, JS, and images from the 'public' directory
app.use("/static", express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/", productRoutes);
app.use("/user", userRoutes);

// Start the express server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// Create the livereload server
const liveReloadServer = livereload.createServer({
  exts: ["js", "css", "ejs"], // Watch specific file extensions
  debug: true, // Enable logging
});
liveReloadServer.watch([
  path.join(__dirname, "public"),
  path.join(__dirname, "views"),
]);

// Notify livereload server when files change
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

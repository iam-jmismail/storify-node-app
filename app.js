require("dotenv").config();
const express = require("express");
const app = express();

// Connect to DB
require("./src/lib/mongoose");

const appRoutes = require("./src/routes");
const { errorHandler } = require("./src/helpers/error-handler");
const responseHandler = require("./src/helpers/response-handler");
const assetController = require("./src/controllers/asset");

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Accepts Request Body

// Response Handlers
app.use(responseHandler);

// Routes
app.use("/api", appRoutes);
app.use("/web/:key_name", assetController.getWebAsset);

app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});

// Error Handler
app.use(errorHandler);

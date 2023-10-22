const express = require("express");
const router = express.Router();

const itemRoutes = require("./items");
const authRoutes = require("./auth");

router.use("/item", itemRoutes);
router.use("/auth", authRoutes);

module.exports = router;

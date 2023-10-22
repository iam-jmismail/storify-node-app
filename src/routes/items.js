const express = require("express");
const router = express.Router();

const itemsController = require("../controllers/items");

router.get("/", itemsController.getAllItems);

module.exports = router;

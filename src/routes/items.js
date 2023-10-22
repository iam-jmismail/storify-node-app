const express = require("express");
const router = express.Router();

const itemController = require("../controllers/items");
const itemValidator = require("../validators/item");

// Middlewares
const validator = require("../middlewares/validator");
const authenticate = require("../middlewares/authenticate");
const uploadFile = require("../middlewares/file-upload");

router.post(
  "/create",
  authenticate,
  uploadFile.fields([{ name: "pictures", maxCount: 4 }]),
  validator(itemValidator.create),
  itemController.createItem
);

router.get(
  "/list",
  authenticate,
  validator(itemValidator.list),
  itemController.getItems
);
router.get(
  "/by-batch/:batch_no",
  authenticate,
  validator(itemValidator.byBatch),
  itemController.getItemsByBatch
);

module.exports = router;

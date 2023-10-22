const { check, param, body } = require("express-validator");

// Validation chains array
module.exports = {
  create: [
    body("title")
      .isString()
      .withMessage("Title must be a string")
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("description")
      .isString()
      .withMessage("Description must be a string")
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("price")
      .isString()
      .withMessage("Price must be a string")
      .notEmpty()
      .withMessage("Price cannot be empty"),

    body("keywords")
      .isString()
      .withMessage("Keywords must be a string")
      .notEmpty()
      .withMessage("Keywords cannot be empty"),
  ],
  list: [
    check("page").optional().isNumeric().withMessage("Page should be a number"),
  ],
  byBatch: [
    param("batch_no").isNumeric().withMessage("Batch number must be a number"),
  ],
};

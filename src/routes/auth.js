const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const authValidator = require("../validators/auth");

// Middlewares
const validator = require("../middlewares/validator");

router.post(
  "/register",
  validator(authValidator.signUp),
  authController.signUp
);

router.post("/login", validator(authValidator.login), authController.login);

module.exports = router;

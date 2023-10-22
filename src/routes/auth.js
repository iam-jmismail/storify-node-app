const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const authValidator = require("../validators/auth");

// Middlewares
const validator = require("../middlewares/validator");
const authenticator = require("../middlewares/authenticate");

router.post(
  "/register",
  validator(authValidator.signUp),
  authController.signUp
);

router.post("/login", validator(authValidator.login), authController.login);
router.get("/update-batch", authenticator, authController.updateBatch);
router.get("/profile", authenticator, authController.getProfile);
router.get("/dashboard", authenticator, authController.getDashboardDetails);

module.exports = router;

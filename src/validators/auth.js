const { check } = require("express-validator");

// Validation chains array
module.exports = {
  signUp: [
    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Invalid email"),
    check("shop_name", "Shop name is required").notEmpty(),
    check("city", "City is required").notEmpty(),
    check("state", "State is required").notEmpty(),
    check("country", "Country is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ],
  login: [
    check("email").isEmail().withMessage("Invalid email"),
    check("password", "Password is required").notEmpty(),
  ],
};

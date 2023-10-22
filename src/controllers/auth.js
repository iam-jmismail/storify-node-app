const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  NotFoundError,
  ResourceConflictError,
  ForbiddenError,
} = require("../helpers/error-handler");
const { CONFIG } = require("../config/constants");

// Model
const UserModel = require("../models/user");

module.exports = {
  /**
   * @Desc Sign Up Customer
   * @returns Tokens
   */
  signUp: async (req, res, next) => {
    const {
      body: {
        first_name,
        last_name,
        email,
        shop_name,
        city,
        state,
        country,
        password,
      },
    } = req;

    try {
      // Check Email Exists
      const email_exists = await UserModel.findOne({ email }).select("email");
      if (email_exists) throw new ResourceConflictError("Email already exists");

      // Encrypt Password
      const encrypted_password = await bcrypt.hash(
        password,
        CONFIG.BCRYPT_SALT_ROUNDS
      );

      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        shop_name,
        city,
        state,
        country,
        password: encrypted_password,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await user.save();

      const payload = {
        session: user._id,
      };

      const auth_token = jwt.sign(payload, CONFIG.JWT_SECRET_KEY, {
        expiresIn: "10h",
      });

      return res.sendSuccessResponse({ token: auth_token });
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @Desc Login Customer
   * @returns Token
   */
  login: async (req, res, next) => {
    const {
      body: { email, password },
    } = req;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw new NotFoundError(`User not found`);

      const valid_password = await bcrypt.compare(password, user.password);
      if (!valid_password) throw new ForbiddenError("Invalid password");

      const payload = {
        session: user._id,
      };

      const auth_token = jwt.sign(payload, CONFIG.JWT_SECRET_KEY, {
        expiresIn: "10h",
      });

      return res.sendSuccessResponse({ token: auth_token });
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @Desc Get Customer Profile
   * @returns Profile of Customer
   */
  getProfile: () => {
    return {};
  },
};

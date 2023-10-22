const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Error Classes
const {
  NotFoundError,
  ResourceConflictError,
  ForbiddenError,
} = require("../helpers/error-handler");

// Config
const { CONFIG } = require("../config/constants");
const {
  SUBSCRIPTIONS,
  ITEMS_SUBSCRIPTIONS,
} = require("../config/subscriptions");

// Model
const UserModel = require("../models/user");
const { default: mongoose } = require("mongoose");

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

      if (user.is_deleted) throw new ForbiddenError("User is removed");

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
  getProfile: async (req, res, next) => {
    try {
      const {
        user: { user_id },
      } = req;

      const user = await UserModel.findOne({
        _id: new mongoose.mongo.ObjectId(user_id),
        is_deleted: false,
      }).select(
        "first_name last_name email shop_name created_at updated_at batch_count subscription"
      );

      if (!user) throw new NotFoundError("User not found");

      return res.sendSuccessResponse(user, "Successfully retrieved");
    } catch (error) {
      return next(error);
    }
  },
  updateBatch: async (req, res, next) => {
    try {
      const {
        user: { user_id },
      } = req;

      const user = await UserModel.findOne({
        _id: new mongoose.mongo.ObjectId(user_id),
        is_deleted: false,
      });

      if (!user) throw new NotFoundError("User not found");

      // Update user batch count
      await UserModel.updateOne(
        {
          _id: new mongoose.mongo.ObjectId(user_id),
        },
        {
          $inc: {
            batch_count: 1,
          },
        }
      );

      return res.sendNoContentResponse();
    } catch (error) {
      return next(error);
    }
  },
  getDashboardDetails: async (req, res, next) => {
    try {
      const {
        user: { user_id },
      } = req;

      const user = await UserModel.findOne({
        _id: new mongoose.mongo.ObjectId(user_id),
        is_deleted: false,
      }).select("batch_count subscription item_count");

      if (!user) throw new NotFoundError("User not found or deleted");

      const total_batches_limit = SUBSCRIPTIONS[user.subscription];
      const total_items_limit = ITEMS_SUBSCRIPTIONS[user.subscription];
      const batches_used = user?.batch_count || 0;
      const items_used = user?.item_count || 0;

      const dashboard_details = {
        plan_name: user.subscription,
        total_batches_limit,
        batches_used,
        batches_percentage: Math.round(
          (batches_used / total_batches_limit) * 100
        ),
        total_items_limit,
        items_used,
        items_percentage: Math.round((items_used / total_items_limit) * 100),
      };

      return res.sendSuccessResponse(
        dashboard_details,
        "Successfully retrieved"
      );
    } catch (error) {
      return next(error);
    }
  },
};

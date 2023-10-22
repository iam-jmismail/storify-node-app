const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  shop_name: {
    type: String,
    required: true,
  },
  location: {
    city: String,
    state: String,
    country: String,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: Date,
  updated_at: Date,
  batch_count: {
    type: Number,
    default: 1,
    required: true,
  },
  item_count: {
    type: Number,
    default: 0,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["BASIC", "SILVER", "GOLD", "PALTINUM"],
    required: true,
    default: "BASIC",
  },
});

module.exports = mongoose.model("User", UserSchema);

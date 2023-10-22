const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ObjectId = Schema.ObjectId;

const ItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: [String],
  price: {
    type: Number,
  },
  images: [String],
  batch: {
    type: Number,
    required: true,
  },
  created_at: Date,
  updated_at: Date,
  user_id: {
    type: ObjectId,
    required: true,
    ref: "users",
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("Item", ItemSchema);

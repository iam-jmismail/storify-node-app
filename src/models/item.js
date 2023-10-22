const mongoose = require("mongoose");
const ObjectId = Schema.ObjectId;

const ItemSchema = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date,
});

export const ItemModel = mongoose.model("Items", ItemSchema);

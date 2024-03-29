const mongoose = require("mongoose");

const uri =
  "mongodb+srv://storifyapp:vQxrueaUGRA44kDM@master-cluster.s8g4alz.mongodb.net/uat?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
const session = mongoose.startSession;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = db;

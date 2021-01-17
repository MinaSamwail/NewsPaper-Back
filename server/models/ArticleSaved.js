const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSavedSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  image_url: String,
  description: String,
  link: String,
  author: String,
});
const ArticleSaved = mongoose.model("ArticleSaved", ArticleSavedSchema);

module.exports = ArticleSaved;

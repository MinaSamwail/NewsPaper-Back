const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSavedSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: "User" },
  data: {},
});
const ArticleSaved = mongoose.model("ArticleSaved", ArticleSavedSchema);

module.exports = ArticleSaved;

const mongoose = require("mongoose");
const { array } = require("../config/coudinary");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  articleId: [String],
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

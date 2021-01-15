const mongoose = require("mongoose");
const { array } = require("../config/coudinary");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  booksId: Array,
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

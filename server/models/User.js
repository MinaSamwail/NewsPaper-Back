const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

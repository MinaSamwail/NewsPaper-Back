const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  profileImg: {
    type: String,
    default:
      "https://cdn3.iconfinder.com/data/icons/ballicons-reloaded-free/512/icon-70-512.png",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

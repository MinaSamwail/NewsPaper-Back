var express = require("express");
const User = require("../models/User");
var router = express.Router();

/* GET users listing. */
router.get("/me", async function (req, res, next) {
  try {
    const allUser = await User.find();
    res.json(allUser);
  } catch (err) {
    next(err);
  }
});
router.patch("/me", async function (req, res, next) {
  try {
    const paramUser = req.session.currentUser;
    const userContent = req.body;
    const updateUser = await User.findByIdAndUpdate(paramUser, userContent);
    res.json(updateUser);
  } catch (err) {
    next(err);
  }
});
module.exports = router;

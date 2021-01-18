var express = require("express");
const User = require("../models/User");
var router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const bcrypt = require("bcrypt");
const upload = require("../config/coudinary");

const salt = 10;

/* GET users listing. */
router.get("/me", requireAuth, (req, res, next) => {
  User.findById(req.session.currentuser)
    .select("-password") //remove the password field from the document
    .then((userDocument) => {
      console.log(userDocument);
      return res.status(200).json(userDocument);
    })
    .catch(next);
});

router.patch(
  "/me",
  requireAuth,
  upload.single("profileImg"),
  async function (req, res, next) {
    try {
      if (req.file) {
        req.body.profileImg = req.file.path; //add profile imgage key to req.body
      }
      const userId = req.session.currentUser;
      const { password, ...userContent } = req.body; // descruture password de req.body
      const hashedPassword = bcrypt.hashSync(password, salt);
      userContent.password = hashedPassword;
      const updateUser = await User.findByIdAndUpdate(userId, userContent, {
        new: true,
      });
      res.json(updateUser);
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/article/:id", async (req, res, next) => {
  const userId = req.session.currentUser;
  const articleId = req.params.id;
  try {
    await User.findByIdAndUpdate(userId, { $push: { articleId: articleId } });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard", async (req, res, next) => {
  const userId = req.session.currentUser;
  try {
    const getTheData = await User.findById(userId).populate("articleId");

    console.log("this my data", getTheData);
    console.log("this my data from the article", getTheData.articleId);

    let promises = [];

    // for (let i = 0; i < getTheData.articleId.length; i++) {

    //   promises.push(
    //     axios.get(
    //       `https://api.currentsapi.services/v1/search?keywords=${searchNews}&apiKey=vUAL2v06nYO7IMpRBTeP31MLtxRms900C_Q1CiUo-bWM1st9`
    //     )
    //   );
    // }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

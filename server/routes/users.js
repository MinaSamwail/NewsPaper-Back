var express = require("express");
const User = require("../models/User");
var router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const bcrypt = require("bcrypt");
const upload = require("../config/coudinary");
const { response } = require("express");

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

router.patch(`/article`, async (req, res, next) => {
  const userId = req.session.currentUser;
  const totalarticle = req.body;
  console.log(req.body);
  try {
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $push: { totalarticle: totalarticle },
    });
    res.json(userUpdate);
  } catch (error) {
    next(error);
  }
});

//ICI
router.get("/dashboard", requireAuth, async (req, res, next) => {
  const userId = req.session.currentUser;

  try {
    // await res.json({ test: 123 });
    const user = await User.findById(userId);
    res.status(200).json(user.totalarticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch("/dashboard/:id", async (req, res, next) => {
  const userId = req.session.currentUser;
  try {
    const user = await User.findById(userId);

    const userArticle = user.totalarticle;

    userArticle
      .findByIdAndUpdate(req.body, { new: true })
      .then((updatedDocument) => {
        return res.status(200).json(updatedDocument);
      });
    // res.status(200).json(user.totalarticle);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

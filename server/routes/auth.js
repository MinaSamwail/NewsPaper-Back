const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

const salt = 10;

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((userDocument) => {
      if (!userDocument) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isValidPassword = bcrypt.compareSync(
        password,
        userDocument.password
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      req.session.currentUser = userDocument._id;
      const userObj = userDocument.toObject();
      delete userObj.password;
      res.status(200).json(userObj);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
router.post("/signup", (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  User.findOne({ email })
    .then((userDocument) => {
      if (userDocument) {
        return res.status(400).json({ message: "Email already taken" });
      }

      try {
        // hashSync can fail, we have to wrap the hashing in a try/catch block.
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
          email,
          lastName,
          firstName,
          password: hashedPassword,
        };

        User.create(newUser).then((newUserDocument) => {
          /** Down below this logs the user on signup.
           *  If you do not want this behaviour you could just send a 201 status
           * to the frontend as a response. and then redirect the user to the login page (frontend) ?
           */

          req.session.currentUser = newUserDocument._id; // only store the user's id in the session.
          // this is a security measure in case the cookie get's compromised the attacker can't read any
          // personal information about the user.

          const userObj = newUserDocument.toObject();
          delete userObj.password; // Remove the password before sending it to the frontend.
          res.status(201).json(userObj);
        });
      } catch (error) {
        res.status(500).json(error);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
router.get("/isLoggedIn", (req, res, next) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser)
      .select("-password")
      .then((userDocument) => {
        res.status(200).json(userDocument);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
router.get("/logout", (req, res, next) => {
  if (req.session.currentUser) {
    req.session.destroy((err) => {
      if (err) res.status(500).json(err);
      res.sendStatus(204);
    });
  } else {
    res.status(400).json({ message: "no session" });
  }
});
module.exports = router;

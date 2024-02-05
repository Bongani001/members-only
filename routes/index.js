const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
});

router.post("/sign-up", [
  body("firstName", "First Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const userExists = await User.findOne({
      username: req.body.username,
    }).exec();
    const errors = validationResult(req);

    if (!userExists === null) {
      const usernameError = "Username already exists";
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      };
      res.render("sign-up", { title: "Sign Up", errors: usernameError, user });
    }

    if (!errors.isEmpty()) {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      };
      res.render("sign-up", { title: "Sign Up", user, errors: errors.array() });
    }

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) {
          next(err);
        }
        // otherwise, store hashedPassword in DB
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
        });
        await user.save();
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  }),
]);

module.exports = router;

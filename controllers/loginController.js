const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Sin-Up Page
exports.signup_get = asyncHandler((req, res) => {
  res.render("sign-up", { title: "Sign Up" });
});

// Register User on Sign-Up
exports.signup_post = [
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

    if (userExists !== null) {
      const usernameError = { msg: "Username already exists" };
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      };
      res.render("sign-up", {
        title: "Sign Up",
        errors: [usernameError],
        user,
      });
      return;
    }

    if (!errors.isEmpty()) {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      };
      res.render("sign-up", { title: "Sign Up", user, errors: errors.array() });
      return;
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
          member: false,
          isAdmin: req.body.isAdmin === "on",
        });
        await user.save();
        req.login(user, (err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    } catch (error) {
      next(error);
    }
  }),
];

// Membership Sign-Up Page
exports.membership_signup_get = asyncHandler((req, res, next) => {
  res.render("membership-signup");
});

// Membership Sign-Up
exports.membership_signup_post = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.user.username }).exec();
  console.log(req.body.secretPasscode.toLowerCase());
  if (req.body.secretPasscode.toLowerCase() === "messi" || "lionel messi") {
    const updatedUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin,
      member: true,
      _id: user.id,
    });
    await User.findByIdAndUpdate(user.id, updatedUser);
    res.redirect("/");
  } else {
    res.render("membership-signup", {
      secretValue: req.body.secretPasscode,
      error: "Try again.",
    });
  }
});

exports.login_get = asyncHandler((req, res) => {
  res.render("login-form", { title: "Login" });
});

exports.login_post = asyncHandler(
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Message Board", user: req.user });
});

// Display Sign-Up Page
router.get("/sign-up", loginController.signup_get);

// Register User on Sign-Up
router.post("/sign-up", loginController.signup_post);

// Display Membership Sign-Up Page
router.get("/membership-signup", loginController.membership_signup_get);

// Membership Sign-Up
router.post("/membership-signup", loginController.membership_signup_post);

// Display the Login Form
router.get("/login", loginController.login_get);

// Login the User
router.post("/login", loginController.login_post);

// Loguot the User
router.get("/logout", loginController.logout);

module.exports = router;

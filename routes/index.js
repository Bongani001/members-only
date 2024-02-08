const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController")

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Message Board", user: req.user });
});

// Display Sign-Up Page
router.get("/sign-up", signupController.signup_get )

// Register User on Sign-Up
router.post("/sign-up", signupController.signup_post )

// Display Membership Sign-Up Page
router.get("/membership-signup", signupController.membership_signup_get)

module.exports = router;

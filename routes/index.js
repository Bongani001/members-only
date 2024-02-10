const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const loginController = require("../controllers/loginController");
const Message = require("../models/Message");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find().exec();
    res.render("index", { title: "Message Board", user: req.user,messages });
  })
);

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

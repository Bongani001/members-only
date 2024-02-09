const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// Display Sign-Up Page
router.get("/sign-up", loginController.signup_get);

// Register User on Sign-Up
router.post("/sign-up", loginController.signup_post);

// Display Membership Sign-Up Page
router.get("/membership-signup", loginController.membership_signup_get);

// Membership Sign-Up
router.post("/membership-signup", loginController.membership_signup_post);

module.exports = router;

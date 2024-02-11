const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const isAuth = require("../middlewares/auth").isAuth;

// Display Message Form
router.get("/create", messageController.message_get);

// Create a new Message
router.post("/create", messageController.message_post);

// Delete a message
router.get("/delete/:id", isAuth, messageController.message_delete_get);

module.exports = router;

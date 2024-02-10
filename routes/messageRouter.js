const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Display Message Form
router.get("/message-create", messageController.message_get);

// Create a new Message
router.post("/message-create", messageController.message_post);

module.exports = router;

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/Message");

// GET Message Form
exports.message_get = asyncHandler((req, res) => {
  res.render("message-form", { title: "Create" });
});

// Create a new Message
exports.message_post = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: req.user._id,
      created: Date.now(),
    });

    if (!errors.isEmpty()) {
      // there are errors, render again
      return res.render("message-form", {
        title: "Create",
        errors: errors.array(),
        message: { title: req.body.title, text: req.body.text },
      });
      return;
    } else {
      await message.save();
      return res.redirect("/");
    }
  }),
];

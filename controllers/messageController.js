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
      title: req.body.title.replace(/&#x27;/g, "'"),
      text: req.body.text.replace(/&#x27;/g, "'"),
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

exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    // If there is no message return an error
    const error = new Error("Message Not Found.");
    error.status = 404;
    next(error);
    return;
  }
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

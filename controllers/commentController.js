const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');

// Handle Comment create on POST.
exports.comment_create_post = [
  // Validate and sanitize fields
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content area must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Post content max. characters is 100.')
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Comment object with escaped and trimmed data.
    var comment = new Comment({
      text: req.body.text,
      createTime: new Date(),
      author: req.body.author, // UPDATE THIS LATER TO: res.locals.user._id
      fatherPost: req.params.id,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save comment and update post's comments
      comment.save(function (err) {
        if (err) {
          return res.status(404).json({
            err,
          });
        }
        Post.findByIdAndUpdate(
          req.params.id,
          { $push: { comments: comment._id } }, // comment._id is created when comment object is too (line 25)
          { safe: true },
          function (err) {
            if (err) {
              return res.status(404).json({
                err,
              });
            }
          }
        );
        //successful - redirect to home with 303 code (Redirect - See other) to change POST to GET
        res.redirect(303, '/post/' + req.params.id);
      });
    }
  },
];

// Handle Comment delete on POST.
exports.comment_delete_post = function (req, res, next) {
  // commentID will be a hidden value in the frontend
  Comment.findById(req.body.commentID).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('Comment not found!');
      err.status = 404;
      console.error('Error - Comment not found!');
      return next(err);
    }
    // Success
    // Delete object and redirect to home.
    Comment.findByIdAndRemove(req.body.commentID, function deleteComment(err) {
      if (err) {
        return next(err);
      }
      Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { comments: { $in: req.body.commentID } } },
        function (err) {
          if (err) {
            return next(err);
          }
        }
      );
      res.redirect(303, '/post/' + req.params.id);
    });
  });
};

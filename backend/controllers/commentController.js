const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');

// Handle Comment create on post POST.
exports.comment_on_post_post = [
  // Validate and sanitize fields
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content area must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Comment content max. characters is 100.')
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
      fatherPost: req.body.fatherPost,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      Post.findByIdAndUpdate(
        req.body.fatherPost,
        { $push: { comments: comment._id } }, // comment._id is created when comment object is too (line 25)
        {
          safe: true,
        },
        function (err, postResults) {
          if (err || postResults == null) {
            return res.status(404).json({
              err,
            });
          }
          comment.save(function (err, newComment) {
            if (err || newComment == null) {
              return res.status(404).json({
                err,
              });
            }
            newComment.populate('author', function (err, populatedNewComment) {
              // Success
              res.status(201).json({
                status: 'OK',
                data: populatedNewComment,
              });
            });
          });
        }
      );
    }
  },
];

// Handle Comment create on comment POST.
exports.comment_on_comment_post = [
  // First, check if father comment exists
  (req, res, next) => {
    Comment.findById(req.body.fatherComment).exec(function (err, results) {
      if (err || results == null) {
        var err = new Error('Post not found!');
        err.status = 404;
        console.error('Error - Post not found!');
        return next(err);
      }
    });
    next();
  },
  // Validate and sanitize fields
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content area must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Comment content max. characters is 100.')
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
      fatherPost: req.body.fatherPost,
      fatherComment: req.body.fatherComment,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid
      Comment.findByIdAndUpdate(
        req.body.fatherComment,
        { $push: { comments: comment._id } }, // comment._id is created when comment object is too (line 25)
        { safe: true },
        function (err, results) {
          if (err || results == null) {
            return res.status(404).json({
              err,
            });
          }
          comment.save(function (err, results) {
            if (err || results == null) {
              return res.status(404).json({
                err,
              });
            }
            // Success
            res.status(201).json({
              status: 'OK',
              data: results,
            });
          });
        }
      );
    }
  },
];

// Handle Comment delete on DELETE.
exports.comment_delete_delete = function (req, res, next) {
  // commentID will be a hidden value in the frontend
  Comment.findById(req.params.id).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('Comment not found!');
      err.status = 404;
      console.error('Error - Comment not found!');
      return next(err);
    }
    // Success
    // Mark as deleted and redirect to post.

    Comment.findByIdAndUpdate(
      req.params.id,
      { text: '', isDeleted: true },

      function (err) {
        if (err) {
          return next(err);
        }
      }
    );
    res.redirect(303, '/');
  });
};

// Handle Comment edit on GET
exports.comment_edit_get = function (req, res, next) {
  Comment.findById(req.body.commentID, 'text').exec(function (err, results) {
    // req.body.commentID will be a hidden value in the frontend
    if (err || results == null) {
      var err = new Error('Comment not found!');
      err.status = 404;
      console.error('Error - Comment not found!');
      return next(err);
    }
    res.json({
      title: 'Comment editing',
      data: results,
    });
  });
};

// Handle Comment edit on PUT
exports.comment_edit_put = [
  // Validate and sanitize fields
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content area must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Comment content max. characters is 100.')
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Comment object with escaped and trimmed data.
    var comment = new Comment({
      text: req.body.text,
      editTime: new Date(),
      _id: req.params.id, // This is required, or a new ID will be assigned! -> This is not necessary if $set is used when findByIdAndUpdate
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save comment.
      Comment.findByIdAndUpdate(
        req.params.id,
        {
          // Must use $set, otherwise would delete comments array
          // (post object would replace the found object with the params id's comment)
          $set: {
            text: comment.text,
            editTime: comment.editTime,
          },
        },
        {},
        function (err, results) {
          if (err || results == null) {
            return res.status(404).json({
              err,
            });
          }
          // Sucess
          res.status(200).json({
            status: 'OK',
            data: results,
          });
        }
      );
    }
  },
];

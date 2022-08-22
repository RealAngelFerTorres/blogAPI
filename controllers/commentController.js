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
      timestamp: new Date(),
      author: req.body.author, // UPDATE THIS LATER TO: res.locals.user._id
      fatherPost: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save comment and update post's comments
      comment.save(function (err) {
        if (err) {
          return next(err);
        }
        Post.findByIdAndUpdate(
          req.params.id,
          { $push: { comments: comment._id } }, // comment._id is created when comment object is too (line 25)
          { safe: true },
          function (err) {
            if (err) {
              return next(err);
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
    if (err) {
      return next(err);
    }
    if (results == null) {
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

/*
// Index home page
exports.index = function (req, res) {
  async.parallel(
    {
      users: function (callback) {
        User.find({}, callback);
      },
      usersCount: function (callback) {
        User.countDocuments({}, callback);
      },
      messages: function (callback) {
        Message.find({}, callback).populate('made_by');
      },
      messagesCount: function (callback) {
        Message.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Members only Home',
        error: err,
        data: results,
      });
    }
  );
};

// Display Message create form on GET.
exports.message_create_get = function (req, res, next) {
  res.render('message_form', {
    title: 'Create new Message',
  });
};

// Handle Message create on POST.
exports.message_create_post = [
  // Validate and sanitize fields.
  body('title')
    .trim()
    .isLength({ max: 15 })
    .withMessage('Title max. characters is 15.')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message must not be empty.')
    .isLength({ max: 140 })
    .withMessage('Message max. characters is 140.')
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Message object with escaped and trimmed data.
    var message = new Message({
      title: req.body.title,
      timestamp: new Date(),
      text: req.body.text,
      made_by: res.locals.user._id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('message_form', {
        title: 'Create Message',
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save message.
      message.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to home.
        res.redirect('/');
      });
    }
  },
];

// Display Message delete form on GET.
exports.message_delete_get = function (req, res, next) {
  async.parallel(
    {
      message: function (callback) {
        Message.findById(req.params.id).populate('made_by').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.message == null) {
        // No results.
        res.redirect('/');
      }
      // Successful, so render.
      res.render('message_delete', {
        title: 'Delete Message',
        message: results.message,
      });
    }
  );
};

// Handle Message delete on POST.
exports.message_delete_post = function (req, res, next) {
  async.parallel(
    {
      message: function (callback) {
        Message.findById(req.body.messageID).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success

      // Delete object and redirect to home.
      Message.findByIdAndRemove(
        req.body.messageID,
        function deleteMessage(err) {
          if (err) {
            return next(err);
          }
          // Success - go to home
          res.redirect('/');
        }
      );
    }
  );
};
*/

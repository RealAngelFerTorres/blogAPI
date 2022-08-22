const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');

// Display Post create form on GET
exports.post_create_get = function (req, res, next) {
  res.json({
    title: 'Post creation',
  });
};

// Handle Post create on POST.
exports.post_create_post = [
  // Validate and sanitize fields
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must not be empty.')
    .isLength({ max: 50 })
    .withMessage('Title max. characters is 50.')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Post content area must not be empty.')
    .isLength({ max: 300 })
    .withMessage('Post content max. characters is 300.')
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Post object with escaped and trimmed data.
    var post = new Post({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      author: req.body.author, // UPDATE THIS LATER TO: res.locals.user._id
      published: req.body.published,
    });
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save post.
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to home with 303 code (Redirect - See other) to change POST to GET
        res.redirect(303, '/');
      });
    }
  },
];

// Handle Post detail on GET.
exports.post_detail_get = function (req, res, next) {
  Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('comments')
    .exec(function (err, results) {
      if (err || results == null) {
        var err = new Error('Post not found!');
        err.status = 404;
        console.error('Error - Post not found!');
        // Another way: return res.status(404).send('Error - Post not found!');
        return next(err);
      }
      res.json({
        title: 'Post detail',
        data: results,
      });
    });
};

// Handle Post delete on POST.
exports.post_delete = function (req, res, next) {
  Post.findById(req.params.id).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('Post not found!');
      err.status = 404;
      console.error('Error - Post not found!');
      return next(err);
    }
    // Success
    // Delete object and redirect to home.
    Post.findByIdAndRemove(req.params.id, function deletePost(err) {
      // Successful - redirect to home with 303 code (Redirect - See other) to change POST to GET
      res.redirect(303, '/');
    });
  });
};

// Handle Post edit on GET
exports.post_edit_get = function (req, res, next) {
  Post.findById(req.params.id).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('Post not found!');
      err.status = 404;
      console.error('Error - Post not found!');
      // Another way: return res.status(404).send('Error - Post not found!');
      return next(err);
    }
    res.json({
      title: 'Post editing',
      data: results,
    });
  });
};
/*
// Handle Post detail on POST
exports.post_edit_post = function (req, res, next) {
  Post.findById(req.params.id)
    .populate('author', 'username')
    .exec(function (err, results) {
      if (err || results == null) {
        var err = new Error('Post not found!');
        err.status = 404;
        console.error('Error - Post not found!');
        // Another way: return res.status(404).send('Error - Post not found!');
        return next(err);
      }
      res.json({
        title: 'Post detail',
        data: results,
      });
    });
};
*/

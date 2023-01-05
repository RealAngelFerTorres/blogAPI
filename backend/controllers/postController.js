const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');
const { parse } = require('dotenv');
const e = require('express');

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
      createTime: new Date(),
      author: req.body.author,
      published: req.body.published,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save post.
      post.save(function (err, newPost) {
        if (err) {
          return next(err);
        }
        // Successful - Send url
        res.json({
          url: newPost.url,
        });
      });
    }
  },
];

// Handle Post detail on GET.
exports.post_detail_get = function (req, res, next) {
  Post.findById(req.params.id)
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: [
        { path: 'author' },
        {
          path: 'comments',
          populate: [
            { path: 'author' },
            {
              path: 'comments',
              populate: [
                { path: 'author' },
                {
                  path: 'comments',
                  populate: [
                    { path: 'author' },
                    {
                      path: 'comments',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    .exec(function (err, results) {
      if (err || results == null) {
        var err = new Error('Post not found!');
        err.status = 404;
        console.error('Error - Post not found!');
        // Another way: return res.status(404).send('Error - Post not found!');
        return next(err);
      }

      // Get comment quantity and append them to results
      Comment.countDocuments({
        fatherPost: req.params.id,
        isDeleted: false,
      }).exec(function (err, commentQuantity) {
        if (err || commentQuantity == null) {
          var err = new Error('No comments found!');
          err.status = 404;
          console.error('Error - Comments not found');
          return next(err);
        }
        // ._doc because the results from countDocuments are hydrated
        // more info: https://mongoosejs.com/docs/tutorials/lean.html
        results._doc = {
          ...results._doc,
          commentQuantity: commentQuantity,
        };
        res.json({
          data: results,
        });
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

    // Recursion function to delete comments and its children
    function recursion(commentsArray) {
      commentsArray.map((comment) => {
        Comment.findById(comment).exec(function (err, results) {
          if (err || results == null) {
            var err = new Error('Comment not found!');
            err.status = 404;
            console.error('Error - Comment not found!');
            return next(err);
          }
          if (results.comments.length >= 1) {
            recursion(results.comments);
          }
          // Delete comment
          Comment.findByIdAndRemove(results.id).exec(function (err, results) {
            if (err || results == null) {
              var err = new Error('Comment not found!');
              err.status = 404;
              console.error('Error - Comment not found!');
              return next(err);
            }
          });
        });
      });
    }
    if (results.comments.length >= 1) {
      recursion(results.comments);
    }
    // Success. Delete post and redirect to home.
    Post.findByIdAndRemove(req.params.id, function deletePost(err) {
      res.redirect(303, '/');
    });
  });
};

// Handle Post edit on GET - D E L E T E    T H I S     L A T E R if a new page is not loaded
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

// Handle Post edit on PUT
exports.post_edit_put = [
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
      editTime: new Date(),
      published: req.body.published,
      _id: req.params.id, // This is required, or a new ID will be assigned! -> This is not necessary if $set is used when findByIdAndUpdate
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save post.
      Post.findByIdAndUpdate(
        req.params.id,
        {
          // Must use $set, otherwise would delete comments array
          // (post object would replace the found object with the params id's post)
          $set: {
            title: post.title,
            text: post.text,
            editTime: post.editTime,
            published: post.published,
            _id: post.id,
          },
        },
        {},
        function (err, results) {
          if (err || results == null) {
            return res.status(404).json({
              err,
            });
          }
          // Successful - redirect to home with 303 code (Redirect - See other) to change POST to GET
          res.redirect(303, '/post/' + req.params.id);
        }
      );
    }
  },
];

// Handle Post vote on POST
exports.post_vote_post = function (req, res, next) {
  User.findById(req.body.userID).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('User not found!');
      err.status = 404;
      console.error('Error - User not found!');
      return next(err);
    }

    const foundVote = results.votedPosts.find(
      (e) => e.postID.valueOf() === req.body.postID
    );
    // Checks if user already voted the post
    if (foundVote) {
      // Checks if the found vote is the same as user input
      if (foundVote.voteType === parseInt(req.body.voteType)) {
        // The same: it has to delete (pull) saved vote from user's votedPosts array
        User.findByIdAndUpdate(
          req.body.userID,
          { $pull: { votedPosts: { postID: foundVote.postID } } },
          function (err, results) {
            if (err || results == null) {
              return res.status(404).json({
                err,
              });
            }
          }
        );
      } else {
        // Different: it has to change the upvoteType from user's votedPosts array
        User.updateOne(
          { _id: req.body.userID, 'votedPosts.postID': foundVote.postID },
          { $set: { 'votedPosts.$.voteType': parseInt(req.body.voteType) } },
          function (err, results) {
            if (err || results == null) {
              return res.status(404).json({
                err,
              });
            }
          }
        );
      }
    } else {
      // User didn't vote the post: Add voted post ID to user's voted post array
      User.findByIdAndUpdate(
        req.body.userID,
        {
          $push: {
            votedPosts: {
              postID: req.body.postID,
              voteType: req.body.voteType,
            },
          },
        },
        { safe: true },
        function (err, results) {
          if (err || results == null) {
            return res.status(404).json({
              err,
            });
          }
        }
      );
    }

    // Update post votes quantity based on user input
    let updateType = foundVote
      ? foundVote.voteType === parseInt(req.body.voteType)
        ? req.body.voteType === '1'
          ? { upvotes: -1 }
          : { downvotes: -1 }
        : req.body.voteType === '1'
        ? { upvotes: 1, downvotes: -1 }
        : { upvotes: -1, downvotes: 1 }
      : req.body.voteType === '1'
      ? { upvotes: 1 }
      : { downvotes: 1 };

    Post.findByIdAndUpdate(req.params.id, {
      $inc: updateType,
    }).exec(function (err, results) {
      if (err || results == null) {
        var err = new Error('Post not found!');
        err.status = 404;
        console.error('Error - Post not found!');
        return next(err);
      }
      res.json({
        data: req.body,
      });
    });
  });
};

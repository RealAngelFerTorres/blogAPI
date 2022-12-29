const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');

// Home page
exports.home_get = function (req, res) {
  Post.find({})
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: { path: 'comments', populate: { path: 'comments' } },
    })
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }

      // Get comment quantity for each post and append them to results
      let newResults = [];
      const promises = results.map(async function (post) {
        const commentQuantity = await Comment.countDocuments({
          fatherPost: post.id,
          isDeleted: false,
        });
        post._doc = {
          ...post._doc,
          commentQuantity: commentQuantity,
        };
        newResults.push(post);
      });
      Promise.all(promises).then(function () {
        res.json({ data: newResults });
      });
    });
};

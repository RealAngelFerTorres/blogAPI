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
      res.json({
        data: results,
      });
    });
};

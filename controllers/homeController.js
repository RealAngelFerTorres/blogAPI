const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');

// Home page
exports.home_get = function (req, res) {
  async.parallel(
    {
      posts: function (callback) {
        Post.find({}, callback)
          .populate('author', 'username')
          .populate('comments');
      },
    },
    function (err, results) {
      res.json({
        title: 'Blog home',
        error: err + '', // Had to put that '' for error debug
        data: results,
      });
    }
  );
};

const { body, validationResult } = require('express-validator');
var async = require('async');
const jwt = require('jsonwebtoken');

var Post = require('../models/post');

// Index home page
exports.home_get = function (req, res) {
  async.parallel(
    {
      posts: function (callback) {
        Post.find({}, callback).populate('author').populate('comments');
      },
    },
    function (err, results) {
      res.json({
        title: 'Blog home',
        error: err,
        data: results,
      });
    }
  );
};

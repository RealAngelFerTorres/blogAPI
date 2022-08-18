var Post = require('../models/post');

var async = require('async');
const { body, validationResult } = require('express-validator');

// Index home page
exports.home_get = function (req, res) {
  async.parallel(
    {
      posts: function (callback) {
        Post.find({}, callback).populate('author').populate('comments');
      },
    },
    function (err, results) {
      res.send('index', {
        title: 'Blog home',
        error: err,
        data: results,
      });
    }
  );
};

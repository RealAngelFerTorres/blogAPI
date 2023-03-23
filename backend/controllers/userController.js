const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

var Post = require('../models/post');
var User = require('../models/user');
var SESSION_SECRET = process.env.SESSION_SECRET;

const passport = require('../services/auth');
const jwt = require('jsonwebtoken');

// Handle User detail on GET.
exports.user_detail_get = function (req, res, next) {
  User.findById(
    req.params.id,
    'username createTime membershipStatus karmaComments karmaPosts votedPosts'
  ).exec(function (err, results) {
    if (err || results == null) {
      var err = new Error('User not found!');
      err.status = 404;
      console.error('Error - User not found!');
      return next(err);
    }
    res.json({
      status: 'OK',
      data: results,
    });
  });
};

// Handle User drafts on GET.
exports.user_drafts_get = function (req, res, next) {
  Post.find({ author: req.params.id, published: false }).exec(function (
    err,
    results
  ) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ status: 'OK', data: results });
  });
};

// Handle User signup on POST.
exports.user_signup_post = [
  // Validate and sanitize fields.
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username must not be empty.')
    .isLength({ max: 40 })
    .withMessage('Username max. characters is 40.')
    .isAlphanumeric()
    .withMessage(
      `Username can only have alphanumeric characters (numbers and letters only).`
    )
    .custom(async (value) => {
      const results = await User.find({
        username: { $regex: value, $options: 'i' }, // i = case insensitive
      });
      if (results.length > 0) {
        return Promise.reject();
      }
    })
    .withMessage('Username already exists.')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please input a valid email.')
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage('Email max. characters is 50.')
    .custom(async (value) => {
      const results = await User.find({
        email: { $regex: value, $options: 'i' }, // i = case insensitive
      });
      if (results.length > 0) {
        return Promise.reject();
      }
    })
    .withMessage('Email already in use.')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password must be at least 1 character.')
    .isLength({ max: 100 })
    .withMessage('Password max. characters is 100.')
    .escape(),
  body(
    'confirmPassword',
    'Password confirmation field must have the same value as the password field.'
  )
    .trim()
    .exists()
    // Custom validator to check password and password confirmation.
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      // Create a User object with escaped and trimmed data.
      var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        createTime: new Date(),
      });

      if (!errors.isEmpty()) {
        // There are errors.
        res.status(400).json({
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save user.
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          // Success.
          res.status(201).json({ status: 'OK' });
        });
      }
    });
  },
];

// Handle User login form on POST.
exports.user_login_post = function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Invalid username and/or password.',
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // Generate a signed son web token with the contents of user object and return it in the response.
      const token = jwt.sign(user.toJSON(), SESSION_SECRET, {
        expiresIn: '6d',
      });
      return res.json({ user, token });
    });
  })(req, res);
};

// Authentication middleware (checks if token is ok).
exports.user_authentication = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'You must be logged-in to see this page...',
        user: user,
      });
    }
    res.locals.user = user;
    next();
  })(req, res, next);
};

// After authentication middleware, response with user data.
exports.user_is_auth = function (req, res) {
  return res.json({ user: res.locals.user });
};

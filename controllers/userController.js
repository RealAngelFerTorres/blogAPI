/*
var User = require('../models/user');
var Message = require('../models/message');

const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
var async = require('async');
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const user = require('../models/user');
// PassportJS Local strategy
passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect e-mail' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

// PassportJS serialization
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Display User create form on GET.
exports.user_create_get = function (req, res, next) {
  res.render('user_form', {
    title: 'Create new User',
  });
};

// Handle User create on POST.
exports.user_create_post = [
  // Validate and sanitize fields.
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name must not be empty.')
    .isLength({ max: 15 })
    .withMessage('First name max. characters is 15.')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name must not be empty.')
    .isLength({ max: 15 })
    .withMessage('Last name max. characters is 15.')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please input a valid e-mail.')
    .isLength({ max: 50 })
    .withMessage('E-mail max. characters is 50.')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .isLength({ max: 50 })
    .withMessage('Password max. characters is 50.')
    .escape(),
  body(
    'confirmPassword',
    'Password confirmation field must have the same value as the password field'
  )
    .trim()
    .exists()
    // Custom validator for check password and password confirmation
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
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
      });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        res.render('user_form', {
          title: 'Create User',
          user: user,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid. Save user.
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          //successful - redirect to home.
          res.redirect('/user/login');
        });
      }
    });
  },
];

// Display User login form on GET.
exports.user_login_get = function (req, res, next) {
  res.render('user_login', {
    title: 'Login',
  });
};

// Handle User login form on POST.
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/messages',
  failureRedirect: '/user/login',
});

// Handle User logout form on GET.
exports.user_logout_get = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

// Display secret form on GET.
exports.user_club_get = function (req, res, next) {
  res.render('secret_form', {
    title: 'Exclusive members only registration',
  });
};

// Handle secret form on POST.
exports.user_club_post = [
  // Validate and sanitize fields.
  body('secret').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    var secret;
    if (req.body.secret === 'igotthepower') {
      secret = 'Admin';
    } else if (req.body.secret === 'givemeaccess') {
      secret = 'Premium';
    } else if (req.body.secret === 'normalsizeplease') {
      secret = 'Normal';
    } else {
      res.render('secret_form', {
        title: 'Exclusive members only registration',
        errors: errors.array(),
      });
      return;
    }
    // All ok, update User status
    var user = new User({
      membership_status: secret,
      _id: res.locals.user._id, //This is required, or a new ID will be assigned!
    });

    User.findByIdAndUpdate(res.locals.user._id, user, {}, function (err) {
      if (err) {
        return next(err);
      }
      // Successful - redirect to home page.
      res.redirect('/');
    });
  },
];
*/

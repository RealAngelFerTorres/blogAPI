const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
var async = require('async');
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var User = require('../models/user');

const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var SESSION_SECRET = process.env.SESSION_SECRET;

// PassportJS Local strategy
passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user, { message: 'Logged in successfully' });
        } else {
          // passwords do not match!
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

// PassportJS JWS strategy
passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: SESSION_SECRET,
    },
    function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload._id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
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

// Display User signup form on GET.
exports.user_signup_get = function (req, res, next) {
  res.json({
    title: 'Sign up form',
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
    .custom(async (value) => {
      const results = await User.find({ username: value });
      if (results.length > 0) {
        return Promise.reject();
      }
    })
    .withMessage('Username already exists.')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please input a valid e-mail.')
    .isLength({ max: 50 })
    .withMessage('E-mail max. characters is 50.')
    .custom(async (value) => {
      const results = await User.find({ email: value });
      if (results.length > 0) {
        return Promise.reject();
      }
    })
    .withMessage('E-mail already in use.')
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
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        createTime: new Date(),
      });

      if (!errors.isEmpty()) {
        // There are errors.
        return res.status(400).json({
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save user.
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          //successful - redirect to home.
          res.redirect(303, '/user/login');
        });
      }
    });
  },
];

// Display User login form on GET.
exports.user_login_get = function (req, res, next) {
  res.json({
    title: 'User login screen',
  });
};

// Handle User login form on POST.
/*
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
});
*/
exports.user_login_post = function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user.toJSON(), SESSION_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
};

// Handle User profile on GET.
exports.user_admin_get = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'You must be logged-in to see this page...',
        user: user,
      });
    }
    return res.status(200).send('YAY! this is a protected ADMIN Route'); // TODO: Change this for a token response
  })(req, res);
};

/*
// Handle User logout form on GET.
exports.user_logout_get = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
*/

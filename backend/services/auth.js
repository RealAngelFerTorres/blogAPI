const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var User = require('../models/user');
var SESSION_SECRET = process.env.SESSION_SECRET;

// PassportJS Local strategy
passport.use(
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
          // Removes sensitive data before returning the json
          user.password = undefined;
          user.email = undefined;
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
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: SESSION_SECRET,
    },
    async function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        const user = await User.findById(
          jwtPayload._id,
          'username createTime membershipStatus karmaComments karmaPosts votedPosts'
        );
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

module.exports = passport;

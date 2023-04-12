require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const helmet = require('helmet');
var indexRouter = require('./routes/index');

// Set up mongoose connection.
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

app.use(logger('dev'));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add helmet for security headers. Options allow to load tinyMCE
app.use(
  helmet({
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", '*.tinymce.com', '*.tiny.cloud'],
      },
    },
  })
);

// Cors.
app.use(cors({ origin: true, credentials: true }));

app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'build'))); // Change to 'public' when in dev; 'build' to deploy.

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler.
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page.
  res.status(err.status || 500);
  res.json({
    status: 'ERROR',
    message: 'There is a kind of problem right here...',
  });
});

module.exports = app;

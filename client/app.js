const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const winstonLogger = require('./config/logger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
const faqsRouter = require('./routes/faqs');

const app = express();

// Set up EJS view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Use express-ejs-layouts for layout support
app.use(expressLayouts);
app.set('layout', 'layout'); // Set the default layout

// Use morgan for HTTP request logging
app.use(morgan('dev', {
  skip: function (req, res) {
    // Skip logging for successful requests and static assets
    return res.statusCode < 400
        || req.url.includes('/bootstrap/')
        || req.url.includes('/jquery/')
        || req.url.includes('/popper/');
  },
  stream: {
    write: function (message) {
      // Log messages using winston
      winstonLogger.info(message.trim());
    }
  }
}));

// Middleware to parse JSON and URL data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

// Set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/faqs', faqsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const createError = require('http-errors');
  next(createError(404));
});

// Error handler middleware
/**
 * Middleware function to handle errors.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
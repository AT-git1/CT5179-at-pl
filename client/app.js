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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Default layout

// Use morgan for HTTP request logging
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
        || req.url.includes('/bootstrap/')
        || req.url.includes('/jquery/')
        || req.url.includes('/popper/');
  },
  stream: {
    write: function (message) {
      winstonLogger.info(message.trim());
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files before setting up the routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/faqs', faqsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const createError = require('http-errors');
  next(createError(404));
});

// error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
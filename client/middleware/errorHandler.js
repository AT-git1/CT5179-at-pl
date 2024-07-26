const winstonLogger = require('../config/logger');

module.exports = function (err, req, res, next) {
  // Determine the status code
  const statusCode = err.status || err.statusCode || 500;

  // Log the error details
  winstonLogger.error({
    message: `${statusCode} - ${err.message}`,
    meta: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user ? req.user.id : 'anonymous',
      stack: err.stack
    }
  });

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error response
  res.status(statusCode);
  
  // Check if the request expects JSON
  if (req.accepts('json')) {
    res.json({
      error: {
        message: err.message,
        status: statusCode
      }
    });
  } else {
    // Render the error page with layout
    res.render('error', {
      title: 'Error',
      error: err
    });
  }
};
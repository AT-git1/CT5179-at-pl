const winstonLogger = require('../config/logger');

module.exports = function (err, req, res, next) {
  // Log the error details
  winstonLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page with layout
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    error: err
  });
};
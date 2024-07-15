const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const moment = require('moment');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  format: combine(
      colorize(),
      timestamp({ format: () => moment().format('YYYY-MM-DD HH:mm:ss') }),
      customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

module.exports = logger;

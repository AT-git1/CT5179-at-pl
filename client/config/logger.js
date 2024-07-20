const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const moment = require('moment');
const path = require('path');
const fs = require('fs');

/**
 * This module sets up a logger using the `winston` library. It configures the logger to output logs to both the console and files,
 * ensuring that logs are formatted with timestamps and colorized levels. It also handles exceptions and promise rejections by logging them to separate files.
 * 
 * Dependencies:
 * - winston: A versatile logging library for Node.js.
 * - moment: A library for parsing, validating, manipulating, and formatting dates.
 * - path: A Node.js module for handling and transforming file paths.
 * - fs: A Node.js module for interacting with the file system.
 */
// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
// custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// logger configuration
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

'use strict';

const winston = require('winston');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new (winston.Logger)({
  exitOnError: false,
  transports: [
    // Log to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),

    // Log to a file. A new file is created daily with a timestamp prepended to its name
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-logs.log`,
      timestamp: tsFormat,
      json: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

logger.info('Logger initialized');

module.exports = logger;

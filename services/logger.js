'use strict';

const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

// Format of the timestamp in the log file name
const tsFormat = () => (new Date()).toLocaleTimeString();

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let logger;

if (env === 'test') {
  // While testing, log only to file and database but not console
  logger = new (winston.Logger)({
    exitOnError: false,
    emitErrs: false,
    transports: [
      new (winston.transports.File)({
        filename: `${logDir}/test-logs.log`,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        timestamp: tsFormat,
        json: false,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        level: 'debug',
        maxsize: 1048576
      }),

      new (require('../lib/winston-postgresql').PostgreSQL)({
        tableName: 'log_messages',
        level: 'error'
      })
    ]
  });
} else {
  // In other environments, log to file, database and console
  logger = new (winston.Logger)({
    exitOnError: false,
    emitErrs: false,
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: env === 'development' ? 'debug' : 'info'
      }),

      // A new file is created daily with a timestamp prepended to its name
      new (require('winston-daily-rotate-file'))({
        filename: `${logDir}/-logs.log`,
        timestamp: tsFormat,
        json: false,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        level: env === 'development' ? 'debug' : 'info',
        maxsize: 1048576
      }),

      new (require('../lib/winston-postgresql').PostgreSQL)({
        tableName: 'log_messages',
        level: 'error'
      })
    ]
  });
}

module.exports = logger;

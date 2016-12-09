'use strict';

const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const connectionObj = require('../knexfile')[env].connection;

// Format of the timestamp in the log file name
const tsFormat = () => (new Date()).toLocaleTimeString();

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let logger;

if (env === 'test') {
  // While testing, log only to a file
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        filename: `${logDir}/test-logs.log`,
        timestamp: tsFormat,
        json: false,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        level: 'debug'
      })
    ]
  });
} else {
  logger = new (winston.Logger)({
    exitOnError: false,
    transports: [
      // Log to the console
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: env === 'development' ? 'debug' : 'info'
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
      }),

      new (require('winston-postgresql').PostgreSQL)({
        connString: connectionObj,
        tableName: 'log_messages',
        level: 'error'
      }),
    ]
  });
}

module.exports = logger;

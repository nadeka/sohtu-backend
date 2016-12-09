'use strict';

const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const connectionObj = require('../knexfile')[env].connection;

// Format of the timestamp in the log file name
const tsFormat = () => (new Date()).toLocaleTimeString();

const logDir = 'logs';

console.log(connectionObj);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let logger;

if (env === 'test') {
  // While testing, log only to file and database but not console
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
      }),

      new (require('winston-postgresql').PostgreSQL)({
        connString: connectionObj,
        tableName: 'log_messages',
        level: 'error'
      })
    ]
  });
} else {
  // In other environments, log to file, database and console
  logger = new (winston.Logger)({
    exitOnError: false,
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
        level: env === 'development' ? 'debug' : 'info'
      }),

      new (require('winston-postgresql').PostgreSQL)({
        connString: connectionObj,
        tableName: 'log_messages',
        level: 'error'
      })
    ]
  });
}

module.exports = logger;

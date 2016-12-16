let bookshelf = require('../config/bookshelf');
let util = require('util');
let winston = require('winston');

// Custom PostgreSQL transport for Winston
let PostgreSQL = exports.PostgreSQL = winston.transports.PostgreSQL = function(options) {

  options = options || {};

  this.name = "PostgreSQL";
  this.level = options.level || "info";

  if (options.tableName) {
    this.tableName = options.tableName;
  } else {
    throw new Error("PostgreSQL transport requires \"tableName\".");
  }
};

util.inherits(PostgreSQL, winston.Transport);

PostgreSQL.prototype.log = function(level, msg, meta, callback) {
  let self = this;

  let newLogMessage = {
    level: level,
    msg: msg,
    meta: JSON.stringify(meta),
    created_at: new Date(),
    updated_at: new Date()
  };

  bookshelf.knex(self.tableName).insert(newLogMessage)
    .then(callback(null, true))
    .catch(function(err) {
      throw new Error('Error inserting log message to database:' + JSON.stringify(newLogMessage));
    });
};

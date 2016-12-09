'use strict';

let bookshelf = require('../config/bookshelf');

let LogMessage = bookshelf.Model.extend({
  tableName: 'log_messages'
});

module.exports = {
  LogMessage: LogMessage
};

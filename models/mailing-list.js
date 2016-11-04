'use strict';

var bookshelf = require('../config/bookshelf');

var MailingList = bookshelf.Model.extend({
  tableName: 'mailing_lists'
});

module.exports = {
  MailingList: MailingList
};

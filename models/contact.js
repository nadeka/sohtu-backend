'use strict';

var bookshelf = require('../config/bookshelf');

var Contact = bookshelf.Model.extend({
  tableName: 'contact'
});

module.exports = {
  Contact: Contact
};

'use strict';

var bookshelf = require('../config/bookshelf');

var Template = bookshelf.Model.extend({
  tableName: 'templates'
});

module.exports = {
  Template: Template
};

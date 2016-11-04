'use strict';

// We use Bookshelf as an ORM (Object Relational Mapper) in model files.
// Here we initialize Bookshelf by passing it Knex
//
// Check: http://bookshelfjs.org/

let knexConfig = require('../knexfile');
let settings = require('./settings');

let knex = require('knex')(knexConfig[settings.environment]);

let bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;

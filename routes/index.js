'use strict';

// When you create new route files, add them here because
// this file is checked in server.js at server startup

let mailingLists = require('./mailing-lists');

module.exports = [].concat(mailingLists);

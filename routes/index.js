'use strict';

// When you create new route files, add them here because
// this file is checked in server.js at server startup

let mailingLists = require('./mailing-lists');
let contacts = require('./contacts');

module.exports = [].concat(mailingLists);
module.exports = [].concat(contacts);

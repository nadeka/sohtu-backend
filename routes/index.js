'use strict';

// When you create new route files, add them here because
// this file is checked in server.js at server startup

let mailingLists = require('./mailing-lists');
let contacts = require('./contacts');
let emailCampaigns = require('./email-campaigns');
let templates = require('./templates');

module.exports = [].concat(mailingLists, contacts, templates emailCampaigns);

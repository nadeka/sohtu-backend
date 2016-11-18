'use strict';

let mailingListController = require('../controllers/mailing-lists');
let validators = require('../validators/validators');

// Routes for mailing lists. Handler functions are in the controllers directory
module.exports = [{
  method: 'GET',
  path: '/mailing-lists',
  config: {
    handler: mailingListController.getMailingLists
  }
}, {
  method: 'GET',
  path: '/mailing-lists/{id}',
  config: {
    handler: mailingListController.getMailingList
  }
}, {
  method: 'POST',
  path: '/mailing-lists',
  config: {
    handler: mailingListController.createMailingList,
    validate: {
      payload: validators
    }
  }
}];

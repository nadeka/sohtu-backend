'use strict';

let contactsController = require('../controllers/contacts');
let validators = require('../validators/validators');

// Routes for mailing lists. Handler functions are in the controllers directory
module.exports = [{
  method: 'GET',
  path: '/contacts',
  config: {
    handler: contactsController.getContacts
  }
}, {
  method: 'GET',
  path: '/contact/{id}',
  config: {
    handler: contactsController.getContact
  }
}, {
  method: 'POST',
  path: '/contacts',
  config: {
    handler: contactsController.createContact,
    validate: { payload: validators }
  }
}];

'use strict';

let contactsController = require('../controllers/contacts');
let validators = require('../validators/validators');

// Routes for contacts. Handler functions are in the controllers directory
module.exports = [{
  method: 'GET',
  path: '/contacts',
  config: {
    handler: contactsController.getContacts
  }
}, {
  method: 'GET',
  path: '/contacts/{id}',
  config: {
    handler: contactsController.getContact
  }
}, {
  method: 'POST',
  path: '/contacts',
  config: {
    handler: contactsController.createContact,
    validate: {
      payload: validators
    }
  }
}];

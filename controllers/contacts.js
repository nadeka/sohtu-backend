'use strict';

let models = require('../models/contact');
let humps = require('humps');
let logger = require('../services/logger');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getContacts: function (request, reply) {
    logger.debug('Fetching all contacts');

    models.Contact
      .fetchAll()
      .then(function (contacts) {
        let camelizedContacts =
          contacts.toJSON({ omitPivot: true }).map(contact => humps.camelizeKeys(contact));
        logger.debug(`Fetched ${camelizedContacts.length} contacts`);
        reply(camelizedContacts);
      })
      .catch(function(err) {
        logger.error('Contacts could not be fetched');

        reply(Boom.notFound('Contacts not found.'));
      });
  },

  getContact: function (request, reply) {
    logger.debug(`Fetching contact with id ${request.params.id}`);

    new models.Contact({id: request.params.id})
      .fetch({require: true})
      .then(function(contact) {
        let camelizedContact = humps.camelizeKeys(contact.toJSON({ omitPivot: true }));
        logger.debug(`Fetched contact:`, camelizedContact);
        reply(camelizedContact);
      })
      .catch(function (err) {
        logger.error(`Could not fetch contact with id ${request.params.id}`);
        reply(Boom.notFound("Contact not found."));
      });
  },

  createContact: function (request, reply) {
    logger.debug(`Creating new contact from payload data:`, request.payload);

    let newContact = {
      first_name: request.payload.firstName,
      last_name: request.payload.lastName,
      email: request.payload.email,
      telephone: request.payload.telephone,
      gender: request.payload.gender,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.Contact(newContact)
      .save()
      .then(function (contact) {
        let camelizedContact = humps.camelizeKeys(contact.toJSON({ omitPivot: true }));
        logger.debug(`Saved new contact:`, camelizedContact);
        reply(camelizedContact);
      })
      .catch(function(err) {
        logger.error('New contact could not be saved:', newContact);

        reply(Boom.badRequest('Could not create contact.'));
      });
  }
};

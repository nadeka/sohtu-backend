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
    models.Contact
      .fetchAll()
      .then(function (contacts) {
        let camelizedContacts =
          contacts.toJSON({ omitPivot: true }).map(contact => humps.camelizeKeys(contact));
        reply(camelizedContacts);
      })
      .catch(function(err) {
        logger.error('Contacts could not be fetched from the database');

        reply(Boom.notFound('Contacts not found.'));
      });
  },

  getContact: function (request, reply) {
    new models.Contact({id: request.params.id})
      .fetch({require: true})
      .then(function(contact) {
        reply(humps.camelizeKeys(contact.toJSON({ omitPivot: true })));
      })
      .catch(function (err) {
        logger.error('Contact with id %s was requested but not found', request.params.id);
        reply(Boom.notFound("Contact not found."));
      });
  },

  createContact: function (request, reply) {
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
        reply(humps.camelizeKeys(contact.toJSON({ omitPivot: true })));
      })
      .catch(function(err) {
        logger.error('New contact could not be saved to the database:', newContact);

        reply(Boom.badRequest('Could not create contact.'));
      });
  }
};

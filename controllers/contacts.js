'use strict';

let models = require('../models/contact');
let humps = require('humps');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getContacts: function (request, reply) {
    models.Contact.fetchAll().then(function (contacts) {
      let camelizedContacts =
        contacts.toJSON({ omitPivot: true }).map(contact => humps.camelizeKeys(contact));
      reply(camelizedContacts);
    });
  },

  getContact: function (request, reply) {
    new models.Contact({id: request.params.id})
      .fetch({require: true})
      .then(function(contact) {
        reply(humps.camelizeKeys(contact.toJSON({ omitPivot: true })));
      })
      .catch(function (err) {
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

    new models.Contact(newContact).save().then(function (contact) {
      reply(humps.camelizeKeys(contact.toJSON({ omitPivot: true })));
    });
  }
};

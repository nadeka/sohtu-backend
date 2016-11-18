'use strict';

let models = require('../models/contact');
let utils = require('../utils/utils');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getContacts: function (request, reply) {
    models.Contact.fetchAll().then(function (contacts) {
      reply(utils.formatJson('contacts', contacts));
    });
  },

  getContact: function (request, reply) {
    new models.Contact({id: request.params.id})
      .fetch({require: true})
      .then(function(contact) {
        reply(utils.formatJson('contact', contact));
      })
      .catch(function (err) {
        reply(Boom.notFound("Contact not found."));
      });
  },

  createContact: function (request, reply) {
    request.payload.contact.created_at = new Date();
    request.payload.contact.updated_at = new Date();

    new models.Contact(request.payload.contact).save().then(function (contact) {
      reply(utils.formatJson('contact', contact));
    });
  }
};

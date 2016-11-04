'use strict';

let models = require('../models/mailing-list');
let utils = require('../utils/utils');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getMailingLists: function (request, reply) {
    models.MailingList.fetchAll().then(function (mailingLists) {
      reply(utils.formatJson('mailingLists', mailingLists));
    });
  },

  getMailingList: function (request, reply) {
    new models.MailingList({id: request.params.id})
      .fetch({require: true})
      .then(function(mailingList) {
        reply(utils.formatJson('mailingList', mailingList));
      })
      .catch(function (err) {
        reply(Boom.notFound("Mailing list not found."));
      });
  },

  createMailingList: function (request, reply) {
    request.payload.mailingList.created_at = new Date();
    request.payload.mailingList.updated_at = new Date();

    new models.MailingList(request.payload.mailingList).save().then(function (mailingList) {
      reply(utils.formatJson('mailingList', mailingList));
    });
  }
};

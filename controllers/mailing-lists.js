'use strict';

let models = require('../models/mailing-list');
let humps = require('humps');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getMailingLists: function (request, reply) {
    models.MailingList.fetchAll({ withRelated: ['members'] }).then(function (mailingLists) {
      let camelizedMailingLists =
        mailingLists.toJSON({ omitPivot: true }).map(list => humps.camelizeKeys(list));

      reply(camelizedMailingLists);
    });
  },

  getMailingList: function (request, reply) {
    new models.MailingList({id: request.params.id})
      .fetch({withRelated: ['members'], require: true})
      .then(function(mailingList) {
        reply(humps.camelizeKeys(mailingList.toJSON({ omitPivot: true })));
      })
      .catch(function (err) {
        reply(Boom.notFound("Mailing list not found."));
      });
  },

  createMailingList: function (request, reply) {
    let newMailingList = {
      name: request.payload.name,
      description: request.payload.description,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.MailingList(newMailingList)
      .save()
      .then(function (mailingList) {
        mailingList.load(['members'])
          .then(function(model) {
            model.members().attach(request.payload.members);

            new models.MailingList({id: mailingList.id})
              .fetch({withRelated: ['members'], require: true})
              .then(function(mailingList) {
                reply(humps.camelizeKeys(mailingList.toJSON({ omitPivot: true })));
              })
              .catch(function (err) {
                reply(Boom.notFound("Error fetching created mailing list."));
              });
          })
          .catch(function (err) {
            reply(Boom.badRequest("Could not create mailing list."));
          });
    });
  }
};

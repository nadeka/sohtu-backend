'use strict';

let models = require('../models/mailing-list');
let humps = require('humps');
let bookshelf = require('../config/bookshelf');
let logger = require('../services/logger');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getMailingLists: function (request, reply) {
    logger.debug('Fetching all mailing lists');

    models.MailingList
      .fetchAll({ withRelated: ['members'] })
      .then(function (mailingLists) {
        let camelizedMailingLists =
          mailingLists.toJSON({ omitPivot: true }).map(list => humps.camelizeKeys(list));
        logger.debug(`Fetched ${camelizedMailingLists.length} mailing lists`);
        reply(camelizedMailingLists);
      })
      .catch(function(err) {
        logger.error('Mailing lists could not be fetched');
        reply(Boom.notFound('Mailing lists not found.'));
      });
  },

  getMailingList: function (request, reply) {
    logger.debug(`Fetching mailing list with id ${request.params.id}`);

    new models.MailingList({id: request.params.id})
      .fetch({ withRelated: ['members'], require: true })
      .then(function(mailingList) {
        let camelizedMailingList = humps.camelizeKeys(mailingList.toJSON({ omitPivot: true }));
        logger.debug(`Fetched mailing list:`, camelizedMailingList);
        reply(camelizedMailingList);
      })
      .catch(function(err) {
        logger.error('Mailing list with id %s was requested but not found', request.params.id);
        reply(Boom.notFound('Mailing list not found.'));
      });
  },

  createMailingList: function (request, reply) {
    logger.debug(`Creating new mailing list from payload data:`, request.payload);

    let newMailingList = {
      name: request.payload.name,
      description: request.payload.description,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.MailingList(newMailingList)
      .save()
      .then(function(mailingList) {
        mailingList.load(['members'])
          .then(function(model) {
            model.members().attach(request.payload.members).then(function() {
              new models.MailingList({id: mailingList.id})
                .fetch({ withRelated: ['members'], require: true })
                .then(function(finalMailingList) {
                  let camelizedMailingList = humps.camelizeKeys(finalMailingList.toJSON({ omitPivot: true }));
                  logger.debug(`Saved new mailing list:`, camelizedMailingList);
                  reply(camelizedMailingList);
                })
                .catch(function(err) {
                  logger.error('Could not fetch the newly created mailing list:', mailingList);

                  reply(Boom.notFound("Could not fetch created mailing list."));
                });
            })
            .catch(function(err) {
              logger.error('Error attaching members to the newly created mailing list:', mailingList);

              reply(Boom.internal("Could not attach members to mailing list."));
            });
          })
          .catch(function(err) {
              logger.error('Error attaching members to the newly created mailing list:',
                mailingList);

            reply(Boom.internal("Could not attach members to mailing list."));
          });
    })
    .catch(function(err) {
      logger.error('New mailing list could not be saved:', newMailingList);

      reply(Boom.badRequest('Could not create mailing list.'));
    });
  }
};

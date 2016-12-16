'use strict';

let models = require('../models/log-message');
let humps = require('humps');
let logger = require('../services/logger');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getLogMessages: function (request, reply) {
    logger.debug('Fetching all log messages');

    models.LogMessage
      .fetchAll()
      .then(function (logMessages) {
        let camelizedLogMessages =
          logMessages.toJSON({ omitPivot: true }).map(logMessage => humps.camelizeKeys(logMessage));
        logger.debug(`Fetched ${camelizedLogMessages.length} log messages`);
        reply(camelizedLogMessages);
      })
      .catch(function(err) {
        logger.error('Log messages could not be fetched');

        reply(Boom.notFound('Log messages not found.'));
      });
  },

  createLogMessage: function (request, reply) {
    logger.debug(`Creating new log message from payload data:`, request.payload);

    let newLogMessage = {
      level: request.payload.level,
      msg: request.payload.msg,
      meta: request.payload.meta,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.LogMessage(newLogMessage)
      .save()
      .then(function(logMessage) {
          new models.LogMessage({id: logMessage.id})
            .fetch({ require: true })
            .then(function(logMessage) {
              let camelizedLogMessage = humps.camelizeKeys(logMessage.toJSON({ omitPivot: true }));
              logger.debug(`Saved new log message:`, camelizedLogMessage);
              reply(camelizedLogMessage);
            })
            .catch(function(err) {
              logger.error('Could not fetch the newly created log message:', logMessage);

              reply(Boom.notFound("Could not fetch created log message."));
            });
        })
      .catch(function(err) {
        logger.error('New log message could not be saved:', newLogMessage);

        reply(Boom.badRequest('Could not create log message.'));
      });
  }
};

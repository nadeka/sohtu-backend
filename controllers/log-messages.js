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

    logger.log(request.payload.level, request.payload.msg, request.payload.meta, function() {
      reply('Saved new log message');
    });
  }
};

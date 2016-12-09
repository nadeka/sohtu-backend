'use strict';

let Boom = require('boom');
let logger = require('../services/logger');

module.exports = {

  payloadValidationErrorHandler: function (request, reply, source, error) {
    logger.error('Invalid payload data:', request.payload);
    reply(Boom.badRequest('Invalid payload data.'));
  }

};

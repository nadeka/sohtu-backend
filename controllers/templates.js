'use strict';

let models = require('../models/template');
let humps = require('humps');
let logger = require('../services/logger');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getTemplates: function (request, reply) {
    logger.debug('Fetching all templates');

    models.Template
      .fetchAll()
      .then(function (templates) {
        let camelizedTemplates =
          templates.toJSON({ omitPivot: true }).map(template => humps.camelizeKeys(template));
        logger.debug(`Fetched ${camelizedTemplates.length} templates`);
        reply(camelizedTemplates);
      })
      .catch(function(err) {
        logger.error('Templates could not be fetched from the database');

        reply(Boom.notFound('Templates not found.'));
      });
  }
};
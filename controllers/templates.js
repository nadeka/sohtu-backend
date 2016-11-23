'use strict';

let models = require('../models/template');
let utils = require('../utils/utils');
let humps = require('humps');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  getTemplates: function (request, reply) {
    models.Template.fetchAll().then(function (templates) {
      let camelizedTemplates =
        templates.toJSON({ omitPivot: true }).map(template => humps.camelizeKeys(template));
      reply(camelizedTemplates);
    });
  }
};
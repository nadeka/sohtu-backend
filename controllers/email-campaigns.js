'use strict';

let models = require('../models/email-campaign');
let utils = require('../utils/utils');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  createEmailCampaign: function (request, reply) {
    request.payload.created_at = new Date();
    request.payload.updated_at = new Date();

    new models.EmailCampaign(request.payload).save().then(function (emailCampaign) {
      reply(utils.formatJson('emailCampaign', emailCampaign));
    });
  }

};

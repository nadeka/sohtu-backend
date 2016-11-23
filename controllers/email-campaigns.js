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

    let newEmailCampaign = {
      name: request.payload.name,
      subject: request.payload.subject,
      schedule: request.payload.schedule,
      content: '',
      email_campaign_template_id: 1
    }

    new models.EmailCampaign(newEmailCampaign).save().then(function (emailCampaign) {
      reply(utils.formatJson('emailCampaign', emailCampaign));
    });
  }

};

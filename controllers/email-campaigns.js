'use strict';

let models = require('../models/email-campaign');
let humps = require('humps');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  createEmailCampaign: function (request, reply) {

    let newEmailCampaign = {
      name: request.payload.name,
      subject: request.payload.subject,
      mailing_lists: request.payload.mailingLists,
      schedule: request.payload.schedule,
      template: request.payload.template,
      content: request.payload.content,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.EmailCampaign(newEmailCampaign).save().then(function (emailCampaign) {
      reply(humps.camelizeKeys(emailCampaign.toJSON({ omitPivot: true })));
    });

  }

};

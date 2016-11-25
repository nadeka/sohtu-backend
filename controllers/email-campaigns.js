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
      schedule: request.payload.schedule,
      content: request.payload.content,
      template_id: request.payload.template,
      created_at: new Date(),
      updated_at: new Date()
    };

    new models.EmailCampaign(newEmailCampaign)
      .save()
      .then(function (emailCampaign) {
        emailCampaign.load(['mailingLists'])
          .then(function(model) {
            model.mailingLists().attach(request.payload.mailingLists).then(function() {
              new models.EmailCampaign({id: emailCampaign.id})
                .fetch({withRelated: ['mailingLists'], require: true})
                .then(function(emailCampaign) {
                  reply(humps.camelizeKeys(emailCampaign.toJSON({ omitPivot: true })));
                })
                .catch(function (err) {
                  reply(Boom.notFound("Error fetching created email campaign."));
                });
            });
          })
          .catch(function (err) {
            reply(Boom.badRequest("Could not create email campaign."));
          });
    });

  }

};

'use strict';

let models = require('../models/email-campaign');
let humps = require('humps');
let sendgrid = require('../services/sendgrid');
let logger = require('../services/logger');

// Used to return HTTP errors
//
// Check: https://github.com/hapijs/boom
let Boom = require('boom');

module.exports = {

  sendTestCampaign: function (request, reply) {
    let testCampaign = {
      subject: request.payload.subject,
      schedule: new Date(),
      content: request.payload.content,
    }
    testCampaign.mailingLists = [];
    testCampaign.mailingLists.push({
      members: []
    });
    request.payload.emailAddresses.forEach(function(emailAddress) {
        testCampaign.mailingLists[0].members.push({
          email: emailAddress
        })
    });
    sendgrid.sendEmailCampaign(testCampaign);
    reply();
  },

  createEmailCampaign: function (request, reply) {
    let newEmailCampaign = {
      name: request.payload.name,
      subject: request.payload.subject,
      schedule: request.payload.schedule,
      content: request.payload.content,
      template_id: request.payload.template,
      created_at: new Date(),
      updated_at: new Date(),
      status: request.payload.status
    }

    new models.EmailCampaign(newEmailCampaign)
      .save()
      .then(function (emailCampaign) {
        emailCampaign.load(['mailingLists'])
          .then(function(model) {
            model.mailingLists().attach(request.payload.mailingLists).then(function() {
              new models.EmailCampaign({id: emailCampaign.id})
                .fetch({withRelated: ['mailingLists.members'], require: true})
                .then(function(emailCampaign) {
                  let jsonEmailCampaign = humps.camelizeKeys(emailCampaign.toJSON({ omitPivot: true }));
                  sendCampaignIfScheduleIsNear(jsonEmailCampaign);
                  reply(jsonEmailCampaign);
                })
                .catch(function (err) {
                  logger.error('Could not fetch the newly created email campaign:', emailCampaign);

                  reply(Boom.notFound("Error fetching created email campaign."));
                });
            });
          });
      })
      .catch(function (err) {
        logger.error('New email campaign could not be saved to the database:', newEmailCampaign);

        reply(Boom.badRequest("Could not create email campaign."));
      });
  }
};

function sendCampaignIfScheduleIsNear(jsonEmailCampaign) {
    let schedule = new Date(jsonEmailCampaign.schedule);
    let now = new Date();
    let hours = 24;
    if (schedule.getTime() < now.getTime() + hours * 3600000) {
      sendgrid.sendEmailCampaign(jsonEmailCampaign);
      sendgrid.setCampaignStatus(jsonEmailCampaign.id, 'sent');
    }
}

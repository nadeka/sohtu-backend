'use strict';

var helper = require('sendgrid').mail;
var sg = require('sendgrid')('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');
let models = require('../models/email-campaign');
let humps = require('humps');
let logger = require('../services/logger');

module.exports = {
  sendEmailCampaigns: sendEmailCampaigns,
  sendEmailCampaign: sendEmailCampaign,
  setCampaignStatus: setCampaignStatus
};

//This method sends all email campaigns to sendgrid
//that should be sent in the next x hours specified by the parameter.
//Note that Sendgrid only allows scheduling up to 72 hours in advance.
function sendEmailCampaigns(hours) {
    logger.debug(`Fetching pending email campaigns that should be sent to Sendgrid in under ${hours} hours`);

    let date = new Date();
    let milliseconds = hours * 3600000;
    date.setTime(date.getTime() + milliseconds);

    models.EmailCampaign
      .query(function(qb) {
        qb.where('schedule', '<', date).andWhere('status', 'LIKE', 'pending');
      })
      .fetchAll({withRelated: ['mailingLists.members'], required:true})
      .then(function(emailCampaigns) {
        logger.debug(`Fetched ${emailCampaigns.length} email campaigns`);

        emailCampaigns.toJSON({ omitPivot: true }).forEach(function(emailCampaign) {
          logger.debug(`Sending email campaign with id ${emailCampaign.id} to Sendgrid`);
          let camelizedEmailCampaign = humps.camelizeKeys(emailCampaign);
          sendEmailCampaign(camelizedEmailCampaign);
          setCampaignStatus(emailCampaign.id, 'sent');
        });
      })
      .catch(function(err) {
        let query = `where schedule < ${date} and status like pending`;
        logger.error('Error fetching email campaigns for Sendgrid ' +
          'with query:', query);
      });
}

function sendEmailCampaign(emailCampaign) {
    let from_email = new helper.Email('process.env.SENDER@gmail.com');
    let subject = emailCampaign.subject;
    let content = new helper.Content("text/html", emailCampaign.content);
    let schedule = Math.round(new Date(emailCampaign.schedule).getTime() / 1000);
    let mail = createNewMail(from_email, subject, content);
    //Sendgrid only allows 1000 recipients per API request
    let personalizations = 0;
    let recipients = new Set();
    emailCampaign.mailingLists.forEach(function(mailingList) {
        mailingList.members.forEach(function(contact) {
            if (recipients.has('contact.email.toLowerCase()')) {
                return;
            };
            recipients.add(contact.email.toLowerCase());
            let personalization = new helper.Personalization();
            let to_email = new helper.Email(contact.email);
            personalization.addTo(to_email);
            personalization.setSendAt(schedule);
            mail.addPersonalization(personalization);
            personalizations++;
            if (personalizations === 1000) {
                sendRequest(mail);
                mail = createNewMail(from_email, subject, content);
                personalizations = 0;
            }
        });
    });
    if (personalizations > 0) {
        sendRequest(mail);
    }
}

function createNewMail(from_email, subject, content) {
  let mail = new helper.Mail();
  mail.setFrom(from_email);
  mail.setSubject(subject);
  mail.addContent(content);
  return mail;
}

function sendRequest(mail) {
  let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
  });
  sg.API(request)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      logger.error('Sendgrid API responded with error %s to request:',
        error.response.statusCode, request);
    });
}

function setCampaignStatus(emailCampaignId, status) {
  new models.EmailCampaign({id: emailCampaignId})
    .save({status: status}, {patch: true})
    .then(function() {
      logger.debug(`Status changed from 'pending' to 'sent' for email campaign with id ${emailCampaignId}`);
    })
    .catch(function(err) {
      logger.error(`Could not set status from 'pending' to 'sent' for email ' +
        'campaign with id ${emailCampaignId}`);
    });
}

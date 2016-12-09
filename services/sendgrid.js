var helper = require('sendgrid').mail
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
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
    emailCampaign.mailingLists.forEach(function(mailingList) {
        mailingList.members.forEach(function(contact) {
            from_email = new helper.Email(process.env.SENDER);
            to_email = new helper.Email(contact.email);
            subject = emailCampaign.subject;
            content = new helper.Content("text/html", emailCampaign.content);
            mail = new helper.Mail(from_email, subject, to_email, content);
            mail.setSendAt(Math.round(new Date(emailCampaign.schedule).getTime() / 1000));

            let request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });

            sg.API(request)
              .then(response => {

              })
              .catch(error => {
                logger.error('Sendgrid API responded with error %s to request:',
                  error.response.statusCode, request);
              });
        });
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

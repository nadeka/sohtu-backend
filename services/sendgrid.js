var helper = require('sendgrid').mail
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
let models = require('../models/email-campaign');
let humps = require('humps');

module.exports = {
  sendEmailCampaigns: sendEmailCampaigns,
  sendEmailCampaign: sendEmailCampaign
};

//This method sends all email campaigns to sendgrid
//that should be sent in the next x hours specified by the parameter.
//Note that Sendgrid only allows scheduling up to 72 hours in advance.
function sendEmailCampaigns(hours) {
    let date = new Date();
    let milliseconds = hours * 3600000;
    date.setTime(date.getTime() + milliseconds);
    models.EmailCampaign.query(function(qb) {
      qb.where('schedule', '<', date).andWhere('status', 'LIKE', 'pending');
    }).fetchAll({withRelated: ['mailingLists.members'], required:true}).then(function(emailCampaigns) {
      emailCampaigns.toJSON({ omitPivot: true }).forEach(function(emailCampaign) {
        camelizedEmailCampaign = humps.camelizeKeys(emailCampaign);
        sendEmailCampaign(camelizedEmailCampaign);
        new models.EmailCampaign({id: emailCampaign.id}).save({status: 'sent'}, {patch: true});
      })
    })
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
            sg.API(request, function(error, response) {
                console.log(response.statusCode)
                console.log(response.body)
                console.log(response.headers)
            });
        });
    });
}
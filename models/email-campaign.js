'use strict';

var bookshelf = require('../config/bookshelf');
var EmailCampaignTemplate = require('./email-campaign-template.js').EmailCampaignTemplate;
var MailingList = require('./mailing-list.js').MailingList;

var EmailCampaign = bookshelf.Model.extend({
  tableName: 'email_campaigns',
  mailing_lists: function() {
    return this.belongsToMany(MailingList);
  },
  email_campaign_template: function() {
    return this.belongsTo(EmailCampaignTemplate);
  }
});

module.exports = {
  EmailCampaign: EmailCampaign
};

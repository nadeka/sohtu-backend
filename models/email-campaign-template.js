'use strict';

var bookshelf = require('../config/bookshelf');
var EmailCampaign = require('./email-campaign.js').EmailCampaign;

var EmailCampaignTemplate = bookshelf.Model.extend({
  tableName: 'email_campaign_templates',
  email_campaigns: function() {
    return this.hasMany(EmailCampaign);
  }
});

module.exports = {
  EmailCampaignTemplate: EmailCampaignTemplate
};

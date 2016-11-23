'use strict';

var bookshelf = require('../config/bookshelf');
var EmailCampaign = require('./email-campaign.js').EmailCampaign;

var MailingList = bookshelf.Model.extend({
  tableName: 'mailing_lists',
  email_campaigns: function() {
    return this.belongsToMany(EmailCampaign);
  }
});

module.exports = {
  MailingList: MailingList
};

'use strict';

var bookshelf = require('../config/bookshelf');
var Template = require('./template.js').Template;
var MailingList = require('./mailing-list.js').MailingList;

var EmailCampaign = bookshelf.Model.extend({
  tableName: 'email_campaigns',
  mailing_lists: function() {
    return this.belongsToMany(MailingList, 'email-campaign-mailing-lists', 'email_campaign_id', 'mailing_list_id');
  },
  template: function() {
    return this.belongsTo(Template);
  }
});

module.exports = {
  EmailCampaign: EmailCampaign
};

'use strict';

var bookshelf = require('../config/bookshelf');

var Template = require('./template').Template;
var MailingList = require('./mailing-list').MailingList;

var EmailCampaign = bookshelf.Model.extend({
  tableName: 'email_campaigns',
  mailingLists: function() {
    return this.belongsToMany(MailingList, 'email_campaign_mailing_lists', 'email_campaign_id', 'mailing_list_id');
  },
  template: function() {
    return this.belongsTo(Template, 'template_id');
  }
});

module.exports = {
  EmailCampaign: EmailCampaign
};

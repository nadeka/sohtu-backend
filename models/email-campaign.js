'use strict';

var bookshelf = require('../config/bookshelf');
var Template = require('./template.js').Template;
var MailingList = require('./mailing-list.js').MailingList;

var EmailCampaign = bookshelf.Model.extend({
  tableName: 'email_campaigns',
  mailing_lists: function() {
    return this.belongsToMany(MailingList);
  },
  template: function() {
    return this.belongsTo(Template);
  }
});

module.exports = {
  EmailCampaign: EmailCampaign
};

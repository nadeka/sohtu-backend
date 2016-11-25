'use strict';

var bookshelf = require('../config/bookshelf');
var EmailCampaign = require('./email-campaign').EmailCampaign;

var Template = bookshelf.Model.extend({
  tableName: 'templates',
  emailCampaigns: function() {
    return this.hasMany(EmailCampaign, 'email_campaign_template_id');
  }
});

module.exports = {
  Template: Template
};

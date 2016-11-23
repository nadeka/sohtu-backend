'use strict';

var bookshelf = require('../config/bookshelf');
var EmailCampaign = require('./email-campaign.js').EmailCampaign;

var Template = bookshelf.Model.extend({
  tableName: 'templates',
  mailing_lists: function() {
    return this.hasMany(EmailCampaign);
  },
});

module.exports = {
  Template: Template
};

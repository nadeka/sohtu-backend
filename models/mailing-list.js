'use strict';

var bookshelf = require('../config/bookshelf');

let Contact = require('./contact').Contact;

let MailingList = bookshelf.Model.extend({
  tableName: 'mailing_lists',
  members: function() {
    return this.belongsToMany(Contact, 'mailing_lists_contacts', 'mailing_list_id', 'contact_id')
  }
});

module.exports = {
  MailingList: MailingList
};

'use strict';

let bookshelf = require('../config/bookshelf');
let MailingList = require('./mailing-list').MailingList;

let Contact = bookshelf.Model.extend({
  tableName: 'contacts',
  mailingLists: function() {
    return this.belongsToMany(MailingList, 'mailing_lists_contacts',
      'contact_id', 'mailing_list_id');
  }
});

module.exports = {
  Contact: Contact
};

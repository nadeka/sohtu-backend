exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes all existing entries and inserts seed entries
    knex('mailing_lists_contacts').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE mailing_lists_contacts_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('mailing_lists_contacts').insert({
          mailing_list_id: 1,
          contact_id: 1
        });
      })
      .then(function() {
        return knex('mailing_lists_contacts').insert({
          mailing_list_id: 2,
          contact_id: 1
        });
      })
      .then(function() {
        return knex('mailing_lists_contacts').insert({
          mailing_list_id: 1,
          contact_id: 2
        });
      })
  );
};

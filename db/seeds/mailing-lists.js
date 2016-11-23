exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes all existing entries and inserts seed entries
    knex('mailing_lists').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE mailing_lists_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('mailing_lists').insert({
          name: 'List 1',
          description: 'Description 1',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(function() {
        return knex('mailing_lists').insert({
          name: 'List 2',
          description: 'Description 2',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(function() {
        return knex('mailing_lists').insert({
          name: 'List 3',
          description: 'Description 3',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
  );
};

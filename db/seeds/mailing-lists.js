exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes all existing entries
    knex('mailing_lists').del(),

    // Inserts seed entries
    knex('mailing_lists').insert([{
      name: 'List 1',
      description: 'Description 1',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'List 2',
      description: null,
      created_at: new Date(),
      updated_at: new Date()
    }])
  );
};

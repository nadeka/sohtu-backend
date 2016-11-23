exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes all existing entries and inserts seed entries
    knex('contacts').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE contacts_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('contacts').insert({
          first_name: 'Salli',
          last_name: 'Saarenpää',
          email: 'salli.saarenpää@gmail.com',
          telephone: '0400 123 456',
          gender: 'Female',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(function() {
        return knex('contacts').insert({
          first_name: 'Pekka',
          last_name: 'Pouta',
          email: 'pekka.pouta@gmail.com',
          telephone: '050 5433 343',
          gender: 'Male',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(function() {
        return knex('contacts').insert({
          first_name: 'Pirjo',
          last_name: 'Pouta',
          email: 'pirjo.pouta@gmail.com',
          telephone: '050 5433 343',
          gender: 'Female',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
  );
};

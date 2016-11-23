exports.up = function(knex, Promise) {
  return knex.schema.createTable('mailing_lists_contacts', function(t) {
    t.increments('id').primary();
    t.integer('mailing_list_id').references('mailing_lists.id').onDelete('CASCADE');
    t.integer('contact_id').references('contacts.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('mailing_lists_contacts');
};

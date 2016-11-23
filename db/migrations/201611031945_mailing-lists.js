exports.up = function(knex, Promise) {
  return knex.schema.createTable('mailing_lists', function(t) {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('description').nullable();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('mailing_lists');
};

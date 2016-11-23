exports.up = function(knex, Promise) {
  return knex.schema.createTable('contacts', function(t) {
    t.increments().primary();
    t.string('first_name').nullable();
    t.string('last_name').nullable();
    t.string('email').nullable();
    t.string('telephone').nullable();
    t.string('gender').nullable();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('contacts');
};
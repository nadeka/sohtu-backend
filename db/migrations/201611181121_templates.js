exports.up = function(knex, Promise) {
  return knex.schema.createTable('templates', function(t) {
    t.increments('id').primary();
    t.string('name').notNull();
    t.text('html').nullable();
    t.text('html_image').nullable();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('templates');
};
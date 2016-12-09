exports.up = function(knex, Promise) {
  return knex.schema.createTable('log_messages', function(t) {
    t.increments('id').primary();
    t.string('level').nullable();
    t.text('msg').nullable();
    t.json('meta').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('log_messages');
};

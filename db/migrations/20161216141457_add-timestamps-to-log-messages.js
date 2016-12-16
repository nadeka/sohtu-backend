
exports.up = function(knex, Promise) {
  return knex.schema.table('log_messages', function(t){
    t.dateTime('created_at').nullable();
    t.dateTime('updated_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('log_messages', function(t){
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
  })
};

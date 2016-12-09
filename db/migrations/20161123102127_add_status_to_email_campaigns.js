exports.up = function(knex, Promise) {
  return knex.schema.table('email_campaigns', function(t){
        t.string('status').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('email_campaigns', function(t){
        t.dropColumn('status');
    })
};

exports.up = function(knex, Promise) {
  return knex.schema
    .raw("ALTER TABLE email_campaigns ALTER COLUMN content TYPE text;");
}

exports.down = function(knex, Promise) {
  return knex.schema.table('email_campaigns', function(t){
        t.dropColumn('content');
    })
};

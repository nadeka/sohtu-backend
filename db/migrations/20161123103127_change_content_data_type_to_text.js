exports.up = function(knex, Promise) {
  return knex.schema
    .raw("ALTER TABLE email_campaigns ALTER COLUMN content TYPE text;");
}

exports.down = function(knex, Promise) {
  return knex.schema
    .raw("ALTER TABLE email_campaigns ALTER COLUMN content TYPE varchar(255);");
};

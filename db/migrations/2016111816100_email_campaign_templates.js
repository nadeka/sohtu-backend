exports.up = function(knex, Promise) {
  return knex.schema.createTable('email_campaign_templates', function(t) {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('html').notNull();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('email_campaign_templates');
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable('email_campaigns', function(t) {
    t.increments('id').primary();
    t.integer('email_campaign_template_id').references('templates.id');
    t.string('name').notNull();
    t.string('subject').notNull();
    t.string('content').notNull();
    t.dateTime('schedule').notNull();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('email_campaigns');
};

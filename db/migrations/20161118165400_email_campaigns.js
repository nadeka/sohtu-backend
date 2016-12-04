exports.up = function(knex, Promise) {
  return knex.schema.createTable('email_campaigns', function(t) {
    t.increments('id').primary();
    t.integer('template_id').references('templates.id').onDelete('CASCADE');
    t.string('name').notNull();
    t.string('subject').notNull();
    t.text('content').notNull();
    t.dateTime('schedule').notNull();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('email_campaigns');
};

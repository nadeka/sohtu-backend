exports.up = function(knex, Promise) {
  return knex.schema.createTable('email_campaign_mailing_lists', function(t) {
    t.integer('email_campaign_id').references('email_campaigns.id');
    t.integer('mailing_list_id').references('mailing_lists.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('email_campaign_mailing_lists');
};

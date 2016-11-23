'use strict';

// Knex checks the NODE_ENV environment variable and chooses the right
// database configuration for the environment (test, development, staging, production).
// In staging and production, we give database port, host, name, username and password
// as environment variables
//
// Check: http://knexjs.org/
module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: 'sohtutest',
      user:     'postgres',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: { directory: './db/seeds' }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: 'sohtudev',
      user:     'postgres',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: { directory: './db/seeds' }
  },

  staging: {
    client: 'postgresql',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: { directory: './db/seeds' }
  },

  production: {
    client: 'postgresql',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { tableName: 'knex_migrations' }
    // We don't want to insert seed data to the production database
  }
};

'use strict';

// We use Hapi as our server framework
//
// Check: http://hapijs.com/
const Hapi = require('hapi');

const settings = require('./config/settings');
const logger = require('./services/logger');
const schedule = require('./config/schedule');

const server = new Hapi.Server();

// Bind the server to a port specified in settings file
server.connection({ host: settings.host, port: settings.port, routes: { cors: true }});

// Import routes and register them to the server
const routes = require('./routes');
server.route(routes);

// Start the server
server.start((err) => {
  if (err) {
    logger.error('Error starting server on port %s on host %s', settings.port, settings.host);
    process.exit();
  }

  console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server;

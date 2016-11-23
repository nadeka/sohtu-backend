'use strict';

// We use Hapi as our server framework
//
// Check: http://hapijs.com/
const Hapi = require('hapi');

const settings = require('./config/settings');

const server = new Hapi.Server();

// Bind the server to a port specified in settings file
server.connection({ host: '0.0.0.0', port: settings.port, routes: { cors: true }});

// Import routes and register them to the server
const routes = require('./routes');
server.route(routes);

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server;

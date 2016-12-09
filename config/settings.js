'use strict';

let path = require('path');

// Defaults that you access when you require this config
module.exports = {
  rootPath: path.normalize(__dirname + '/..'),

  // If we specify a PORT environment variable use it, else use 8000
  port: parseInt(process.env.PORT, 10) || 8000,

  host: '0.0.0.0',

  // If we specify a NODE_ENV environment variable use it, else use 'development'
  // (note a use of environment is in knexfile.js)
  environment: process.env.NODE_ENV || 'development'
};

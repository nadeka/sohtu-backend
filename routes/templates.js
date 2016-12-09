'use strict';

let templateController = require('../controllers/templates');
let validators = require('../validators/validators');
let errorHandlers = require('../config/error-handlers');

// Routes for templates. Handler functions are in the controllers directory
module.exports = [{
  method: 'GET',
  path: '/templates',
  config: {
    handler: templateController.getTemplates
  }
}];

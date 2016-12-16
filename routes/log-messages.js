'use strict';

let logMessageController = require('../controllers/log-messages');
let validators = require('../validators/validators');
let errorHandlers = require('../config/error-handlers');

// Routes for log messages. Handler functions are in the controllers directory
module.exports = [{
  method: 'GET',
  path: '/log-messages',
  config: {
    handler: logMessageController.getLogMessages
  }
}, {
  method: 'POST',
  path: '/log-messages',
  config: {
    handler: logMessageController.createLogMessage,
    validate: {
      payload: validators.logMessage,
      failAction: errorHandlers.payloadValidationErrorHandler
    }
  }
}];

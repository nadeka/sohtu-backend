'use strict';

let emailCampaignController = require('../controllers/email-campaigns');
let validators = require('../validators/validators');
let errorHandlers = require('../config/error-handlers');

// Routes for campaigns. Handler functions are in the controllers directory
module.exports = [{
  method: 'POST',
  path: '/email-campaigns',
  config: {
    handler: emailCampaignController.createEmailCampaign,
    validate: {
      payload: validators.emailCampaign
    }
  }
},{
  method: 'POST',
  path: '/email-campaigns/test',
  config: {
    handler: emailCampaignController.sendTestCampaign,
    validate: {
      payload: validators.testEmailCampaign,
      failAction: errorHandlers.payloadValidationErrorHandler
    }
  }
}];

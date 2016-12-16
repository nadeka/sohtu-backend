'use strict';

// Joi is a validation library that can be used to validate e.g. query strings
// and payloads in HTTP requests
//
// Check: https://github.com/hapijs/joi
var Joi = require('joi');

module.exports = {
  mailingList: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(300).allow([null, ""]).required(),
    members: Joi.array().required()
  }),
  contact: Joi.object({
    firstName: Joi.string().max(300).allow([null, ""]).required(),
    lastName: Joi.string().max(300).allow([null, ""]).required(),
    email: Joi.string().max(300).allow([null, ""]).required(),
    telephone: Joi.string().max(300).allow([null, ""]).required(),
    gender: Joi.string().max(300).allow([null, ""]).required()
  }),
  emailCampaign: Joi.object({
    name: Joi.string().max(300).allow([null, ""]).required(),
    subject: Joi.string().max(300).allow([null, ""]).required(),
    mailingLists: Joi.array().required(),
    schedule: Joi.date().required(),
    template: Joi.number().required(),
    content: Joi.string().max(100000).allow([null, ""]).required(),
    status: Joi.string().max(300).allow([null, ""]).required()
  }),
  testEmailCampaign: Joi.object({
    subject: Joi.string().max(300).allow([null, ""]).required(),
    emailAddresses: Joi.array().required(),
    content: Joi.string().max(100000).allow([null, ""]).required()
  }),
  logMessage: Joi.object({
    level: Joi.string().max(200).allow([null, ""]).required(),
    msg: Joi.string().max(200).allow([null, ""]).required(),
    meta: Joi.object().allow([null]).required()
  })
};

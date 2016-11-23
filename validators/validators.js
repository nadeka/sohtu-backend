'use strict';

// Joi is a validation library that can be used to validate e.g. query strings
// and payloads in HTTP requests
//
// Check: https://github.com/hapijs/joi
var Joi = require('joi');

module.exports = {
  mailingList: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(300).allow([null, ""]).required(),
    members: Joi.array().required(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
  }),
  contact: Joi.object({
    id: Joi.number().optional(),
    firstName: Joi.string().max(300).allow([null, ""]).required(),
    lastName: Joi.string().max(300).allow([null, ""]).required(),
    email: Joi.string().max(300).allow([null, ""]).required(),
    telephone: Joi.string().max(300).allow([null, ""]).required(),
    gender: Joi.string().max(300).allow([null, ""]).required(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
  })
};

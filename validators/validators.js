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
    description: Joi.string().max(300).allow([null, ""]),
    created_at: Joi.date(),
    updated_at: Joi.date()
  })
};

/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var httpStatus = require('../utils/httpStatus');

// creates avalidation middleware for Express
module.exports = function validate(config) {
  return function (req, res, next) {
    
    req.valid = {};
    
    function sendError(paramName, message) {
      return res.send(
        httpStatus.BAD_REQUEST,
        'parameter "' + paramName + '": ' + message
      );
    }
    
    var paramName;
    for (paramName in config) {
      var paramRules = config[paramName],
          paramValue;
      
      switch (paramRules.scope) {
        case 'body':
          paramValue = req.body[paramName];
          break;
        case 'query':
          paramValue = req.query[paramName];
          break;
        default:
          paramValue = req.param(paramName);
      }
      
      req.valid[paramName] = paramValue;
      
      if (paramRules.required && !paramValue) {
        return sendError(paramName, 'required');
      }
    }
    
    next();
  };
  
};
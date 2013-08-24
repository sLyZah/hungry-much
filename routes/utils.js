/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';


var httpStatus = require('./httpStatus');

exports.handlePromiseResponse = function (promise, response) {
  return promise.then(function success(result) {
    response.status(200);
    response.json(result);
    return result;
  }, function fail(error) {
    response.status(500);
    response.json(error);
    return error;
  });
};

exports.ensureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.send(401, 'Unauthorized');
  }
};


exports.dbErrorHandler = function (res) {
  return function (error) {
    res.send(httpStatus.INTERNAL_SERVER_ERROR, error);
  };
};


// creates a middleware for validating parameters
exports.validate = function (config) {
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

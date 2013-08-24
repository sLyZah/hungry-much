/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';


var httpStatus = require('./httpStatus'),
    ModelError = require('../models/ModelError'),
    Q          = require('q');

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

//TODO: remove when all refernces are gone 
exports.ensureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.send(401, 'Unauthorized');
  }
};

exports.authenticate = exports.ensureAuthentication;

exports.dbErrorHandler = function (res) {
  return function (error) {
    res.send(httpStatus.INTERNAL_SERVER_ERROR, error);
  };
};



function mapModelErrorToHttpStatus(error) {
  console.log(error.code);
  switch (error.code) {
    case ModelError.NOT_FOUND: return httpStatus.NOT_FOUND;
    case ModelError.DUPLICATE: return httpStatus.BAD_REQUEST;
    case ModelError.UNAUTHORIZED: return httpStatus.UNAUTHORIZED;
    case ModelError.REFUSED: return httpStatus.FORBIDDEN;
    default: return httpStatus.INTERNAL_SERVER_ERROR;
  }
}

exports.handleModelError = function (dbPromise, response) {
  dbPromise.then(null, function (modelError) {
    var status = mapModelErrorToHttpStatus(modelError);
    response.send(status, modelError.message);
  });
};

exports.serializeAll = function (models, deep) {
  return Q.all(models.map(function (model) {
    return model.serialize(deep);
  }));
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

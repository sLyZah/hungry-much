/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';

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




var validator  = require('validator'),
    httpStatus = require('./httpStatus');

function Rule(paramName, config) {
  this.paramName = paramName;
  this.validators = [];
  
  var method;
  for (method in config) {
    if (config.hasOwnProperty(method)) {
      var validate = validator.validators[method];
      this.validators.push(validate);
    }
  }
}

Rule.prototype.validate = function (request) {
  var param   = request.param(this.paramName),
      checker = validator.check(param);
  
  this.validators.forEach(function (validate) {
    validate.apply(checker, [param]);
  });
};

// creates a middleware for validating parameters
exports.validate = function (config) {
  var rules = [],
      paramName;
  
  for (paramName in config) {
    if (config.hasOwnProperty(paramName)) {
      var paramConfig = config[paramName];
      rules.push(new Rule(paramName, paramConfig));
    }
  }
  
  return function (req, res, next) {
    var validationSuccess = true;
    rules.forEach(function (rule) {
      try {
        rule.validate(req);
      } catch (err) {
        res.send(httpStatus.BAD_REQUEST, '"' + rule.paramName + '": ' + err.message);
        validationSuccess = false;
        return false;
      }
    });
    
    if (validationSuccess) {
      next();
    }
  };
};
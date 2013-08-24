/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Q          = require('q'),
    httpStatus = require('./httpStatus'),
    utils = require('./utils');

exports.init = function (app, passport) {
  
  var models = app.get('models');
  
  
  /**
    * POST /auth/signin
    * Sign in an existing user
    * params:
    *   email
    *   password
    * returns: the user after he's signed in
    */
  app.post('/auth/signin', utils.validate({
    email: {
      scope: 'body',
      required: true
    },
    password: {
      scope: 'body',
      required: true
    }
  }), passport.authenticate('local'), function (req, res) {
    
    var promise = req.user.serialize(true).then(function  (json) {
      res.status(httpStatus.OK);
      res.json(json);      
    });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  /**
    * GET /auth/signout
    * Signs out the currently logged in user
    */
  app.get('/auth/signout', function (req, res) {
    req.logout();
    res.send(httpStatus.OK);
  });
  
  
  /**
    * POST /auth/signup
    * Create a new user
    * params:
    *   name
    *   email
    *   password
    * returns: the user after he's created
    */
  app.post('/auth/signup', utils.validate({
    name: {
      scope: 'body',
      required: true
    },
    email: {
      scope: 'body',
      required: true
    },
    password: {
      scope: 'body',
      required: true
    }
  }), function (req, res) {
    
    var promise = models.User.create({
      name    : req.body.name,
      email   : req.body.email,
      password: models.User.encryptPassword(req.body.password)
    }).then(function onSuccess(user) {
      var deferred = Q.defer();
      req.login(user, function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(user);
        }
      });
      return deferred.promise;
    }).then(function (user) {
      return user.serialize();
    }).then(function (json) {
      res.status(httpStatus.OK);
      res.json(json);
    });
    
    utils.handleModelError(promise, res);
    
  });
  
};

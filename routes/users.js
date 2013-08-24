/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require("./utils"),
    httpStatus = require('./httpStatus'),
    Q = require('q');

exports.init = function (app) {
  
  var models = app.get('models');
  
  /**
    * GET /users
    * returns: array of all users
    */
  app.get('/users', function (req, res) {
    
    var promise = models.User.findAll()
      .then(function onSuccess(users) {
        return utils.serializeAll(users);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  /**
    * GET /users/me
    * authenticated
    * returns: the currently logged in user
    */
  app.get('/users/me', utils.authenticate, function (req, res) {
    var promise = req.user.serialize(true).then(function (json) {
      res.status(httpStatus.OK);
      res.json(json);
    });
    
    utils.handleModelError(promise, res);
  });
  
  /**
    * GET /users/:userId
    * returns: the user with id 'userId'
    */
  app.get('/users/:userId', utils.validate({
    userId: {
      required: true
    }
  }), function (req, res) {
    
    var promise = models.User.getUser(req.param('userId'))
      .then(function onSuccess(user) {
        return user.serialize(true);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  /**
    * PUT /users/me
    * Changes the properties of the currently logged in user
    * authenticated
    * params:
    *   name
    *   email
    * returns: the user after the change
    */
  app.put('/users/me', utils.authenticate, utils.validate({
    name: {
      scope: 'body'
    },
    email: {
      scope: 'body'
    }
  }), function (req, res) {
    
    var attributes = {};
    if (req.valid.name) { attributes.name = req.valid.name; }
    if (req.valid.email) { attributes.email = req.valid.email; }
    
    var promise = req.user.updateAttributes(attributes)
      .then(function (user) {
        return user.serialize(true);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  
  /**
    * POST /users/me/clicks
    * Add a click for this user
    * authenticated
    * params:
    *   groupId
    * returns: the click
    */
  app.put('/users/me', utils.authenticate, utils.validate({
    groupId: {
      scope: 'body',
      required: true
    }
  }), function (req, res) {
    
    var promise = req.user.click(req.valid.groupId)
      .then(function (click) {
        return click.serialize(true);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
};


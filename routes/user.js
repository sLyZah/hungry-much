/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var users = app.get('services').users;
var Promise = require("promise");

var ERR_USER_NOT_FOUND = 'User not found',
    ERR_UNKNOWN        = 'Error unknown';




function handle(userPromise, response) {
  return userPromise.then(function success(user) {
    response.status(200);
    response.json(user);
    return user;
  }, function fail(error) {
    response.status(500);
    response.json(error);
    return error;
  });
}

exports.init = function (app) {
  
  app.get('/users', function (req, res) {
    var name  = req.param('name');
    
    if (!name) {
      res.status(500);
      res.json('"name" not specified');
      return;
    }
    
    handle(users.getUserByName(name), res);
  });
  
  app.post('/users', function (req, res) {
    var name  = req.param('name');
    var email = req.param('email');
    
    if (!name) {
      res.status(500);
      res.json('"name" not specified');
      return;
    }
    
    if (!email) {
      res.status(500);
      res.json('"email" not specified');
      return;
    }
    
    handle(users.addUser({
      name: name,
      email: email
    }), res);
  });
  
  app.get('/users/:userId', function (req, res) {
    var userId  = req.param('userId');
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    handle(users.getUser(userId), res);
  });
  
  app.put('/users/:userId', function (req, res) {
    var userId = req.param('userId');
    var name   = req.param('name');
    var email  = req.param('email');
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    var config = {};
    
    if (name) {
      config.name = name;
    }
    
    if (email) {
      config.email = email;
    }
    
    handle(users.changeUser(userId, config), res);
  });
  
};


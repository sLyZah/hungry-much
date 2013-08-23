/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Promise = require('promise'),
    utils   = require('./utils');

exports.init = function (app, passport) {
  
  var models = app.get('models');
  
  app.post('/auth/signin', passport.authenticate('local'), function (req, res) {
    
    var email    = req.param('email');
    var password = req.param('password');
    
    if (!email) {
      res.status(500);
      res.json('"email" not specified');
      return;
    }
    
    if (!password) {
      res.status(500);
      res.json('"password" not specified');
      return;
    }
    
    utils.handlePromiseResponse(Promise.from(req.user), res);
    
  });
  
  app.post('/auth/signout', function (req, res) {
    
  });
  
  app.post('/auth/signup', function (req, res) {
    var name     = req.param('name');
    var email    = req.param('email');
    var password = req.param('password');
    
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
    
    if (!password) {
      res.status(500);
      res.json('"password" not specified');
      return;
    }
    
    var addUserPromise = models.User.addUser({
      name    : name,
      email   : email,
      password: models.User.encryptPassword(password)
    }).then(function (user) {
      // log the new user in
      req.login(user, function(err) {
        var p = new Promise();
        
        if (err) {
          p.reject();
        } else {
          p.resolve(user);
        }
        
        return p;
      });
      
    });
    
    utils.handlePromiseResponse(addUserPromise, res);
  });
  
};

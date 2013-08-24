/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Q          = require('q'),
    httpStatus = require('./httpStatus');

exports.init = function (app, passport) {
  
  var models = app.get('models');
  
  app.post('/auth/signin', passport.authenticate('local'), function (req, res) {
    if (req.user) {
      res.status(httpStatus.OK);
      res.json(req.user.serialize());      
    } else {
      res.send(httpStatus.INTERNAL_SERVER_ERROR);
    }
  });
  
  app.get('/auth/signout', function (req, res) {
    req.logout();
    res.send(httpStatus.OK);
  });
  
  app.post('/auth/signup', function (req, res) {
    var name     = req.param('name');
    var email    = req.param('email');
    var password = req.param('password');
    
    if (!name) {
      res.status(httpStatus.BAD_REQUEST);
      res.json('"name" not specified');
      return;
    }
    
    if (!email) {
      res.status(httpStatus.BAD_REQUEST);
      res.json('"email" not specified');
      return;
    }
    
    if (!password) {
      res.status(httpStatus.BAD_REQUEST);
      res.json('"password" not specified');
      return;
    }
    
    var addUserPromise = models.User.addUser({
      name    : name,
      email   : email,
      password: models.User.encryptPassword(password)
    }).then(function (user) {
      req.login(user, function (err) {
        
        if (err) {
          res.send(httpStatus.INTERNAL_SERVER_ERROR);
        } else {
          res.status(httpStatus.OK);
          res.json(user.serialize());
        }
        
      });
    },function (err) {
      // TODO: better error handling (duplicate user = 400)
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
    
  });
  
};

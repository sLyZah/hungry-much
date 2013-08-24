/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Q          = require('q'),
    httpStatus = require('./httpStatus'),
    utils = require('./utils');

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
    var name     = req.body.name;
    var email    = req.body.email;
    var password = req.body.password;
    
    if (!name) {
      return res.send(httpStatus.BAD_REQUEST, '"name" not specified');
    }
    
    if (!email) {
      return res.send(httpStatus.BAD_REQUEST, '"email" not specified');
    }
    
    if (!password) {
      return res.send(httpStatus.BAD_REQUEST, '"password" not specified');
    }
    
    var addUserPromise = models.User.addUser({
      name    : name,
      email   : email,
      password: models.User.encryptPassword(password)
    }).then(function onSuccess(user) {
      req.login(user, function (err) {
        
        if (err) {
          res.send(httpStatus.INTERNAL_SERVER_ERROR);
        } else {
          res.status(httpStatus.OK);
          res.json(user.serialize());
        }
        
      });
    },function onError(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(httpStatus.BAD_REQUEST, 'User already exists');
      } else {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    });
    
  });
  
};

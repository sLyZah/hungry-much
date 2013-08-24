/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Q          = require('q'),
    httpStatus = require('./httpStatus'),
    utils = require('./utils');

exports.init = function (app, passport) {
  
  var models = app.get('models');
  
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
    models.User.create({
      name    : req.body.name,
      email   : req.body.email,
      password: models.User.encryptPassword(req.body.password)
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

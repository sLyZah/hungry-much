/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require("./utils"),
    httpStatus = require('./httpStatus');

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.all('/users*', utils.ensureAuthentication);
  
  app.get('/users', function (req, res) {
    var email = req.query.email;
    
    if (!email) {
      return res.send(httpStatus.BAD_REQUEST, '"email" not specified');
    }
    
    models.User.getUserByEmail(email).then(function onSuccess(user) {
      if (user) {
        res.status(httpStatus.OK);
        res.json(user.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
  app.get('/users/me', function (req, res) {
    res.redirect('/users/' + req.user.id);
  });
  
  app.get('/users/:userId', function (req, res) {
    var userId  = req.param('userId');
    
    if (!userId) {
      // userId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    models.User.find(userId).then(function onSuccess(user) {
      if (user) {
        res.status(httpStatus.OK);
        res.json(user.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
  app.put('/users/me', function (req, res) {
    res.redirect('/users/' + req.user.id);
  });
  
  app.put('/users/:userId', function (req, res) {
    var userId = parseInt(req.param('userId'), 10);
    var name   = req.body.name;
    var email  = req.body.email;
    
    if (!userId) {
      // userId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    if (userId !== req.user.id) {
      return res.send(httpStatus.UNAUTHORIZED, 'this is not you');
    }
    
    var config = {};
    
    if (name) {
      config.name = name;
    }
    
    if (email) {
      config.email = email;
    }
    
    models.User.changeUser(userId, config).then(function onSuccess(user) {
      if (user) {
        res.status(httpStatus.OK);
        res.json(user.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
};


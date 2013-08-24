/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require("./utils"),
    httpStatus = require('./httpStatus');

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.all('/users*', utils.ensureAuthentication);
  
  
  
  app.get('/users', utils.validate({
    email: {
      required: true
    }
  }), function (req, res) {
    models.User.getUserByEmail(req.param('email')).then(
      function onSuccess(user) {
        if (user) {
          res.status(httpStatus.OK);
          res.json(user.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      utils.dbErrorHandler(res)
    );
  });
  
  
  
  app.get('/users/me', function (req, res) {
    res.redirect('/users/' + req.user.id);
  });
  
  app.get('/users/:userId', utils.validate({
    userId: {
      required: true
    }
  }), function (req, res) {
    models.User.find(req.param('userId')).then(
      function onSuccess(user) {
        if (user) {
          res.status(httpStatus.OK);
          res.json(user.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      utils.dbErrorHandler(res)
    );
  });
  
  
  
  app.put('/users/me', function (req, res) {
    res.redirect('/users/' + req.user.id);
  });
  
  app.put('/users/:userId', utils.validate({
    userId: {
      required: true
    }
  }), function (req, res) {
    var userId = parseInt(req.param('userId'), 10);
    var name   = req.body.name;
    var email  = req.body.email;
    
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


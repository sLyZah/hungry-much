/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils = require("./utils");

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.all('/users*', utils.ensureAuthentication);
  
  app.get('/users', function (req, res) {
    var email  = req.param('email');
    
    if (!email) {
      res.status(500);
      res.json('"email" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.User.getUserByEmail(email), res);
  });
  
  app.get('/users/:userId', function (req, res) {
    var userId  = req.param('userId');
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.User.getUser(userId), res);
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
    
    utils.handlePromiseResponse(models.User.changeUser(userId, config), res);
  });
  
};


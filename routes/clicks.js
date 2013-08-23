/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils = require('./utils');

exports.init = function (app, passport) {
  
  var models = app.get('models');
  
  app.all('/clicks*', utils.ensureAuthentication);
  
  app.get('/clicks', function (req, res) {
    var groupId = req.param('groupId');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Click.getClicks(groupId), res);
  });
  
  app.post('/clicks', function (req, res) {
    
    var userId  = req.param('userId');
    var groupId = req.param('groupId');
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    if (parseInt(userId, 10) !== req.user.id) {
      res.status(401);
      res.json('Unauthorized');
      return;
    }
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Click.addClick({
      userId: userId,
      groupId: groupId
    }), res);
  });
  
};


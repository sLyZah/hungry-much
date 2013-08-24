/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils = require('./utils');
var Q          = require('q'),
    httpStatus = require('./httpStatus');

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
    
    var groupId = req.body.groupId;
    var userId = req.user.id;
    
    // TODO: check if user belongs to group
    
    if (!groupId) {
      return res.send(httpStatus.BAD_REQUEST, '"groupId" not specified');
    }
    
    utils.handlePromiseResponse(models.Click.addClick({
      userId: userId,
      groupId: groupId
    }), res);
  });
  
};


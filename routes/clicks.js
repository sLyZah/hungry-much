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
  
  app.post('/clicks', utils.validate({
    groupId: {
      scope: 'body',
      required: true
    }
  }), function (req, res) {
    utils.handlePromiseResponse(req.user.click(req.valid.groupId), res);
  });
  
};


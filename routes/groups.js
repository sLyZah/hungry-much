/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global app */

'use strict';

var utils = require('./utils');

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.get('/groups', function (req, res) {
    var name = req.param('name');
    
    if (!name) {
      res.status(500);
      res.json('"name" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.getGroupByName(name), res);
    
  });
  
  app.post('/groups', function (req, res) {
    var name     = req.param('name');
    var admin    = req.param('admin');
    var treshold = req.param('treshold');
    
    if (!name) {
      res.status(500);
      res.json('"name" not specified');
      return;
    }
    
    if (!admin) {
      res.status(500);
      res.json('"admin" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.addGroup({
      name: name,
      adminId: admin,
      treshold: treshold
    }), res);
  });
  
  app.get('/groups/:groupId', function (req, res) {
    var groupId = req.param('groupId');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.getGroup(groupId), res);
  });
  
  app.put('/groups/:groupId', function (req, res) {
    var groupId  = req.param('groupId');
    var admin    = req.param('admin');
    var name     = req.param('name');
    var treshold = req.param('treshold');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    var config = {};
    
    if (name) {
      config.name = name;
    }
    
    if (name) {
      config.treshold = treshold;
    }
    
    if (admin) {
      config.admin = admin;
    }
    
    utils.handlePromiseResponse(models.Group.changeGroup(groupId, config), res);
  });
  
  app.post('/groups/:groupId/users', function (req, res) {
    var groupId = req.param('groupId');
    var userId  = req.param('userId');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.addUser(groupId, userId), res);
  });
  
  app.get('/groups/:groupId/users', function (req, res) {
    var groupId = req.param('groupId');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.getUsers(groupId), res);
  });
  
  app.delete('/groups/:groupId/users/:userId', function (req, res) {
    var groupId = req.param('groupId');
    var userId  = req.param('userId');
    
    if (!groupId) {
      res.status(500);
      res.json('"groupId" not specified');
      return;
    }
    
    if (!userId) {
      res.status(500);
      res.json('"userId" not specified');
      return;
    }
    
    utils.handlePromiseResponse(models.Group.removeUser(groupId, userId), res);
  });
  
};

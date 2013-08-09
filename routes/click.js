/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var models    = app.get('models'),
    Click     = models.Click,
    User      = models.User,
    Group     = models.Group,
    Sequelize = require('Sequelize');



/**
 * find all clicks for a certain user and/or group (debug)
 */
exports.findAll = function (req, res) {
  
  var query = {};
  
  var conditions = [];
  var params = [];
  
  var groupId = req.param('groupId');
  if (groupId) {
    conditions.push('groupId=?');
    params.push(groupId);
  }
  
  var after = req.param('after');
  if (after) {
    var afterTime = new Date(parseInt(after, 10)).toISOString();
    conditions.push('timestamp>?');
    params.push(afterTime);
  }
  
  query.where = [conditions.join(' and ')].concat(params);
  
  Click.findAll(query).success(function (clicks) {
    if (clicks === null) {
      res.status(404);
      res.json({});
    } else {
      res.json(clicks);
    }
  }).error(function (error) {
    res.json({
      'err' : 'Something went wrong finding the clicks',
      'msg' : error
    });
  });
};


/**
 * Add a click for a certain user/group
 * by user email and group id
 */
exports.save = function (req, res) {
  
  var userQuery = { where: {} };
  var groupQuery = { where: {} };
  
  var email = req.param('email');
  if (email) {
    userQuery.where.email = email;
  }
  
  var groupKey = req.param('groupKey');
  if (groupKey) {
    groupQuery.where.key = groupKey;
  }
  
  var chainer = new Sequelize.Utils.QueryChainer();
  chainer.add(User, 'find', [userQuery]);
  chainer.add(Group, 'find', [groupQuery]);
  
  chainer.runSerially().success(function (results) {
    var user  = results[0],
      group = results[1];
    
    if (!user) {
      res.status(500);
      res.json({ 'err' : 'User not found' });
      return;
    }
    
    if (!group) {
      res.status(500);
      res.json({ 'err' : 'Group not found' });
      return;
    }
    
    Click.create({
      timestamp: new Date()
    }).success(function (savedClick) {
      savedClick.setUser(user);
      savedClick.setGroup(group);
      res.json(savedClick);
    }).error(function (error) {
      res.status(500);
      res.json({
        'err' : 'Something went wrong saving the model',
        'msg' : error
      });
    });
        
  }).error(function (error) {
    res.status(500);
    res.json({
      'err' : 'Something went wrong finding the user or group',
      'msg' : error
    });
  });
  
};

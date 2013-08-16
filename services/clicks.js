/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var Click = app.get('models').Click,
    users = require('../services/users'),
    groups = require('../services/groups'),
    Promise = require("promise");



exports.getClicks =function (groupId) {
  return groups.getGroup(groupId).then(function (group) {
    return group.getClicks();
  });
};

exports.addClick =function (config) {
  return Promise.all([
    users.getUser(config.userId),
    groups.getGroup(config.groupId)
  ]).then(function (results) {
    var user  = results[0],
        group = results[1];
    
    return Click.create({
      timestamp: new Date(),
      GroupId: group.id,
      UserId: user.id
    });
  });
};


/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var Group = app.get('models').Group,
    User = app.get('models').User,
    users = require('../services/users'),
    Promise = require("promise");


var ERR_GROUP_NOT_FOUND = 'Group not found',
    ERR_UNKNOWN         = 'Error unknown';





function reject(value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
}

function handleDBError(error) {
  return reject({
    msg: ERR_UNKNOWN,
    err: error
  });
}



exports.getGroup = function (id) {
  return Group.find({
    where: { id: id }
  }).then(function (group) {
    return group !== null ? group : reject({msg: ERR_GROUP_NOT_FOUND});
  }, handleDBError);
};

exports.getGroupByName = function (name) {
  return Group.find({
    where: { name: name }
  }).then(function (group) {
    return group !== null ? group : reject({msg: ERR_GROUP_NOT_FOUND});
  }, handleDBError);
};

exports.addGroup = function (config) {
  return users.getUser(config.adminId).then(function (admin) {
    return Group.create(config).then(function (group) {
      return group.addMember(admin).then(function () {
        return exports.getGroup(group.id);
      });
    }, handleDBError);
  });
};

exports.changeGroup = function (id, config) {
  return Group.update(config, {
    id: id
  }).then(function (group) {
    return exports.getGroup(id);
  }, handleDBError);
};

exports.getUsers = function (groupId) {
  return exports.getGroup(groupId).then(function (group) {
    return group.getMembers();
  });
};

exports.addUser = function (groupId, userId) {
  return Promise.all([
    exports.getGroup(groupId),
    users.getUser(userId)
  ]).then(function (results) {
    var group = results[0],
        user  = results[1];
    
    return group.addMember(user).then(function () {
      return exports.getGroup(groupId);
    });
  });
};

exports.removeUser = function (groupId, userId) {
  return Promise.all([
    exports.getGroup(groupId),
    users.getUser(userId)
  ]).then(function (results) {
    var group = results[0],
        user  = results[1];
    
    if (user.id === group.adminId) {
      return reject({msg: 'Can\'t remove administrator'});
    }
    
    return group.removeMember(user).then(function (result) {
      return exports.getGroup(groupId);
    });
  });
};
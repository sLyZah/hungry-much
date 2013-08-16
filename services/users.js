/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var User = app.get('models').User,
    Promise = require("promise");

var ERR_USER_NOT_FOUND = 'User not found',
    ERR_UNKNOWN        = 'Error unknown';




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



exports.getUsers = function () {
  return User.findAll().then(null, handleDBError);
};


exports.getUser = function (id) {
  return User.find({
    where: {
      id: id
    }
  }).then(function (user) {
    return user !== null ? user : reject({msg: ERR_USER_NOT_FOUND});
  }, handleDBError);
};


exports.getUserByName = function (name) {
  return User.find({
    where: {
      name: name
    }
  }).then(function (user) {
    return user !== null ? user : reject({msg: ERR_USER_NOT_FOUND});
  }, handleDBError);
};


exports.addUser = function (config) {
  return User.create(config).then(null, handleDBError);
};


exports.changeUser = function (userId, config) {
  return User.update(config, {
    id: userId
  }).then(function () {
    return exports.getUser(userId);
  }, handleDBError);
};


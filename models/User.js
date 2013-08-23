/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Promise = require("promise"),
    Sequelize = require('sequelize');

var ERR_USER_NOT_FOUND = 'User not found',
    ERR_UNKNOWN        = 'Error unknown';



module.exports = function(sequelize, app) {
  'use strict';
  
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
  
  var User = sequelize.define('User', {
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, validate: { isEmail: true } }
  }, {
  
    classMethods: {
      
      getUser: function (id) {
        return User.find(id).then(function (user) {
          return user !== null ? user : reject({msg: ERR_USER_NOT_FOUND});
        }, handleDBError);
      },
      
      
      getUserByName: function (name) {
        return User.find({
          where: {
            name: name
          }
        }).then(function (user) {
          return user !== null ? user : reject({msg: ERR_USER_NOT_FOUND});
        }, handleDBError);
      },
      
      
      addUser: function (config) {
        return User.create(config).then(null, handleDBError);
      },
      
      
      changeUser: function (userId, config) {
        return User.update(config, {
          id: userId
        }).then(function () {
          return User.getUser(userId);
        }, handleDBError);
      }
      
    }
  });

  return User;
};

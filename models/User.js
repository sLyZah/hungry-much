/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global app */

var Promise = require("promise");

var ERR_USER_NOT_FOUND = 'User not found',
    ERR_UNKNOWN        = 'Error unknown';



module.exports = function(sequelize, DataTypes) {
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
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, validate: { isEmail: true } }
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

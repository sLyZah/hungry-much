/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Promise   = require("promise"),
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
    return reject(error);
  }
  
  var User = sequelize.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      },
      allowNull: false
    },
    password: {
      type: Sequelize.STRING
    }
  }, {
  
    classMethods: {
      
      encryptPassword: function (password) {
        // TODO: fo' real
        return password;
      },
      
      getUser: function (id) {
        return User.find(id);
      },
      
      getUserByEmail: function (email) {
        return User.find({
          where: {
            email: email
          }
        });
      },
      
      
      addUser: function (config) {
        return User.create(config).then(null, handleDBError);
      },
      
      
      changeUser: function (userId, config) {
        return User.update(config, {
          id: userId
        }).then(function () {
          return User.find(userId);
        }, handleDBError);
      }
      
    },
    
    instanceMethods: {
      serialize: function () {
        return {
          name: this.name,
          id: this.id,
          email: this.email
        };
      }
    }
    
  });


  return User;
};

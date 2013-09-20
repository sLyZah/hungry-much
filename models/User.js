/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Sequelize = require('sequelize'),
    Q         = require('q'),
    Error     = require('./ModelError'),
    crypto    = require('crypto');

var ERR_USER_NOT_FOUND = 'User not found',
    ERR_UNKNOWN        = 'Error unknown';



module.exports = function(sequelize, app) {
  'use strict';
  
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
        var hash = crypto.createHash('sha1');
        return hash.update(password).digest('hex');
      },
      
      getUser: function (id) {
        return User.find(id).then(function (user) {
          if (user) {
            return user;
          } else {
            return Q.reject(
              new Error(Error.NOT_FOUND, 'User not found')
            );
          }
        });
      },
      
      getUserByEmail: function (email) {
        return User.find({
          where: {
            email: email
          }
        }).then(function (user) {
          if (user) {
            return user;
          } else {
            return Q.reject(
              new Error(Error.NOT_FOUND, 'User not found')
            );
          }
        });
      },
      
      
      changeUser: function (userId, config) {
        return User.update(config, {
          id: userId
        }).then(function () {
          return User.getUser(userId);
        });
      },
      
      
      serializeAll: function (users) {
        return Q.all(users.map(function (user) {
          return user.serialize();
        }));
      }
      
    },
    
    instanceMethods: {
      
      serialize: function (deep) {
        var models = app.get('models');
        var json = {
          name : this.name,
          id   : this.id,
          email: this.email
        };
        
        if (deep) {
          return this.getGroup().then(function (group) {
            if (group) {
              return group.serialize();
            } else {
              return null;
            }
          }).then(function(groupJson) {
            json.belongsTo = groupJson;
            return json;
          });
        } else {
          return Q.when(json);
        }
      },
      
      click: function () {
        var models = app.get('models');
        
        var user = this;
      
        return models.Click.create({
          UserId: user.id,
          timestamp: new Date().getTime()
        });
      }
    }
    
  });


  return User;
};

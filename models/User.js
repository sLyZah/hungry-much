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
          return Q.all([
            this.getAdminGroups().then(function (groups) {
              return models.Group.serializeAll(groups);
            }),
            this.getGroups().then(function (groups) {
              return models.Group.serializeAll(groups);
            })
          ]).spread(function(adminGroupsJson, groupsJson) {
            json.administers = adminGroupsJson;
            json.belongsTo = groupsJson;
            return json;
          });
        } else {
          return Q.when(json);
        }
      },
      
      getAdminGroups: function () {
        var models = app.get('models');
        return models.Group.findAll({
          where: {
            adminId: this.id
          }
        });
      },
      
      click: function (groupId) {
        var models = app.get('models');
        
        var user = this;
        
        return this.getGroups({where: {id: groupId}}).then(function (groups) {
          if (groups) {
            return models.Click.create({
              UserId: user.id,
              GroupId: groupId,
              timestamp: new Date().getTime()
            });
          } else {
            return Q.reject(
              new Error(Error.NOT_FOUND, 'User doesn\'t belong to this group')
            );
          }
        });
      }
    }
    
  });


  return User;
};

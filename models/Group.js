/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Q          = require('q'),
    Sequelize = require('sequelize'),
    sqlQuery   = require('sql-query'),
    Error = require('./ModelError');

var ERR_GROUP_NOT_FOUND = 'Group not found',
    ERR_UNKNOWN         = 'Error unknown';

var DEFAULT_TRESHOLD = 2;

module.exports = function(sequelize, app) {
  'use strict';
  
  var Group = sequelize.define('Group', {
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    treshold: { type: Sequelize.INTEGER, defaultValue: DEFAULT_TRESHOLD },
    adminId: { type: Sequelize.INTEGER, allowNull: false }
  }, {
    classMethods: {
      
      getGroup: function (id) {
        return Group.find(id).then(function (group) {
          if (group) {
            return group;
          } else {
            return Q.reject(
              new Error(Error.NOT_FOUND, 'Group not found')
            );
          }
        });
      },
      
      getGroupByName: function (name) {
        return Group.find({
          where: { name: name }
        });
      },
      
      changeGroup: function (id, config) {
        return Group.update(config, {
          id: id
        }).then(function (group) {
          return Group.getGroup(id);
        });
      },
      
      getUsers: function (groupId) {
        return Group.find(groupId).then(function (group) {
          if (group) {
            console.log('getting members');
            return group.getMembers();
          } else {
            return null;
          }
        });
      },
      
      addUser: function (groupId, userId) {
        var models = app.get('models');
        return Q.all([
          Group.find(groupId),
          models.User.find(userId)
        ]).spread(function (group, user) {
          if (!group || !user) {
            return null;
          }
          
          return group.addMember(user).then(function () {
            return Group.getGroup(groupId);
          });
        });
      },
      
      isAdminForGroup: function (groupId, adminId) {
        return Group.find(groupId).then(function (group) {
          if (group && group.adminId === adminId) {
            return true;
          } else {
            return false;
          }
        });
      },
      
      getDistinctClicks: function (groupId, after) {
        var models = app.get('models');
        
        return Group.getGroup(groupId).then(function (group) {
          return group.getDistinctClicks(after);
        });
      },
      
      
      serializeAll: function (groups) {
        return Q.all(groups.map(function (group) {
          return group.serialize();
        }));
      }


    },
    instanceMethods: {
      serialize: function (deep) {
        var models = app.get('models');
        
        var json = {
          name    : this.name,
          id      : this.id,
          treshold: this.treshold || DEFAULT_TRESHOLD
        };
        
        if (deep) {
          
          return this.getMembers().then(function (members) {
            return models.User.serializeAll(members);
          }).then(function(membersJson) {
            json.members = membersJson;
            return json;
          });
        } else {
          return Q.when(json);
        }
      },
      
      getAdmin: function () {
        var models = app.get('models');
        return models.User.getUser(this.adminId);
      },
      
      ensureAdminRights: function (user) {
        if (this.adminId === user.id) {
          return this;
        } else {
          return Q.reject(
            new Error(Error.UNAUTHORIZED, 'User is no administrator for this group')
          );
        }
      },
      
      removeUser: function (user) {
        if (this.adminId === user.id) {
          return Q.reject(
            new Error(Error.REFUSED, 'Cannot remove administrator')
          );
        } else {
          return this.removeMember(user);
        }
      },
      
      getDistinctClicks: function (after) {
        var models = app.get('models');
        
        var q = new sqlQuery.Query().select()
          .from('Clicks')
          .groupBy('userId')
          .where({
            timestamp: sqlQuery.gt(after || 0)
          })
          .build();
        
        return sequelize.query(q, models.Click);
        
      },
      
      countClicks: function (after) {
      
      }
    }
  });
            
  return Group;
};

/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Q          = require('q'),
    Promise = require("promise"),
    Sequelize = require('sequelize'),
    sqlQuery   = require('sql-query');

var ERR_GROUP_NOT_FOUND = 'Group not found',
    ERR_UNKNOWN         = 'Error unknown';

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
  
  var Group = sequelize.define('Group', {
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    treshold: { type: Sequelize.INTEGER, defaultValue: 3 },
    adminId: { type: Sequelize.INTEGER }
  }, {
    classMethods: {
      
      getGroup: function (id) {
        return Group.find({
          where: { id: id }
        }).then(function (group) {
          return group !== null ? group : reject({msg: ERR_GROUP_NOT_FOUND});
        }, handleDBError);
      },
      
      getGroupByName: function (name) {
        return Group.find({
          where: { name: name }
        });
      },
      
      addGroup: function (config) {
        var models = app.get('models');
        return models.User.getUser(config.adminId).then(function (admin) {
          return Group.create(config).then(function (group) {
            return group.addMember(admin).then(function () {
              return Group.find(group.id);
            });
          });
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
      
      removeUser: function (groupId, userId) {
        var models = app.get('models');
        return Promise.all([
          Group.find(groupId),
          models.User.find(userId)
        ]).spread(function (group, user) {
          if (!group || !user) {
            return null;
          }
          
          if (user.id === group.adminId) {
            return reject({msg: 'Can\'t remove administrator'});
          }
          
          return group.removeMember(user).then(function (result) {
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
      }


    },
    instanceMethods: {
      serialize: function () {
        return {
          name: this.name,
          id: this.id,
          admin: this.adminId
        };
      },
      
      getDistinctClicks: function (after) {
        var models = app.get('models');
        
        var conditions = [
          {
            groupId: this.id
          }
        ];
        
        if (after) {
          conditions.push({
            timestamp: sqlQuery.gt(after)
          });
        }
        
        var q = new sqlQuery.Query().select()
          .from('Clicks')
          .groupBy('groupId', 'userId')
          .where({
            and: conditions
          }).build();
        
        return sequelize.query(q, models.Click);
        
      }
    }
  });
            
  return Group;
};

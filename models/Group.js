/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global app */

var Promise = require("promise");

var ERR_GROUP_NOT_FOUND = 'Group not found',
    ERR_UNKNOWN         = 'Error unknown';

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
  
  var Group = sequelize.define('Group', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    treshold: { type: DataTypes.INTEGER, defaultValue: 3 },
    key: DataTypes.STRING,
    adminId: { type: DataTypes.INTEGER }
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
        }).then(function (group) {
          return group !== null ? group : reject({msg: ERR_GROUP_NOT_FOUND});
        }, handleDBError);
      },
      
      addGroup: function (config) {
        var models = app.get('models');
        return models.User.getUser(config.adminId).then(function (admin) {
          return Group.create(config).then(function (group) {
            return group.addMember(admin).then(function () {
              return Group.getGroup(group.id);
            });
          }, handleDBError);
        });
      },
      
      changeGroup: function (id, config) {
        return Group.update(config, {
          id: id
        }).then(function (group) {
          return Group.getGroup(id);
        }, handleDBError);
      },
      
      getUsers: function (groupId) {
        return Group.getGroup(groupId).then(function (group) {
          return group.getMembers();
        });
      },
      
      addUser: function (groupId, userId) {
        var models = app.get('models');
        return Promise.all([
          Group.getGroup(groupId),
          models.User.getUser(userId)
        ]).then(function (results) {
          var group = results[0],
              user  = results[1];
          
          return group.addMember(user).then(function () {
            return Group.getGroup(groupId);
          });
        });
      },
      
      removeUser: function (groupId, userId) {
        var models = app.get('models');
        return Promise.all([
          Group.getGroup(groupId),
          models.User.getUser(userId)
        ]).then(function (results) {
          var group = results[0],
              user  = results[1];
          
          if (user.id === group.adminId) {
            return reject({msg: 'Can\'t remove administrator'});
          }
          
          return group.removeMember(user).then(function (result) {
            return Group.getGroup(groupId);
          });
        });
      }


    },
    instanceMethods: {
      getUniqueClicks: function (config) {
        var after = config.after;
        
        return this.getClicks({
          where: { }
        });
      }
    }
  });
            
  return Group;
};

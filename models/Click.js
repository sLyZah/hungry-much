/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

var Promise = require("promise");

module.exports = function(sequelize, DataTypes) {
  'use strict';
  
  var Click = sequelize.define('Click', {
    timestamp: {
      type: DataTypes.DATE
    }
  }, {
    
    classMethods: {
      
      getClicks: function (groupId) {
        var groups = require('../services/groups');
        return groups.getGroup(groupId).then(function (group) {
          return group.getClicks();
        });
      },
      
      addClick: function (config) {
        var groups = require('../services/groups'),
            users = require('../services/users'),
            User = app.get('models').User;
    
        return Promise.all([
          User.find(config.userId),
          groups.getGroup(config.groupId)
        ]).then(function (results) {
          var user  = results[0],
              group = results[1];
          
          return Click.create({
            timestamp: new Date()
          }).then(function (click) {
            return Promise.all([
              click.setUser(user),
              click.setGroup(group)
            ]).then(function () {
              return click;
            });
          });
        });
      }
  
    },
    
    instanceMethods: {
      
    }
    
  });
  
  return Click;
};

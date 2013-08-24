/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Promise = require('promise'),
    Sequelize = require('sequelize');


module.exports = function(sequelize, app) {
  'use strict';
  
  var Click = sequelize.define('Click', {
    timestamp: {
      type: Sequelize.BIGINT
    }
  }, {
    
    classMethods: {
      
      getClicks: function (groupId) {
        var models = app.get('models');
        return models.Group.getGroup(groupId).then(function (group) {
          return group.getClicks();
        });
      },
      
      addClick: function (config) {
        var models = app.get('models');
    
        return Promise.all([
          models.User.getUser(config.userId),
          models.Group.find(config.groupId)
        ]).then(function (results) {
          var user  = results[0],
              group = results[1];
          
          return Click.create({
            timestamp: new Date().getTime()
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
      serialize: function () {
        return {
          timestamp: this.timestamp,
          userId: this.UserId,
          groupId: this.GroupId
        };
      }
    }
    
  });
  
  
  return Click;
};



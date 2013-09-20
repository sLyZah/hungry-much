/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

var Q = require('q'),
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
    
        models.User.getUser(config.userId).then(function (user) {
          
          return Click.create({
            timestamp: new Date().getTime()
          }).then(function (click) {
            return click.setUser(user).then(function () {
              return click;
            });
          });
        });
      }
  
    },
    
    instanceMethods: {
      serialize: function (deep) {
        var models = app.get('models');
        var json = {
          timestamp: this.timestamp,
          userId: this.UserId
        };

        if (deep) {
          return this.getUser().then(function (user) {
            if (user) {
              return user.serialize();
            } else {
              return null;
            }
          }).then(function(userJson) {
            json.user = userJson;
            return json;
          });
        } else {
          return Q.when(json);
        }
      }
    }
    
  });
  
  
  return Click;
};



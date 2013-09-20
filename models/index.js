/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global app */

'use strict';

// As per http://redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html

var Sequelize = require('sequelize');
var config    = require('config').Mysql;  // we use node-config to handle environments


module.exports.init = function (app) {
  
  // initialize database connection
  var sequelize = new Sequelize(
    config.db,
    config.user,
    config.pass,
    {
      host: config.host,
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    }
  );
  
  var models = {};
  app.set('models', models);
  
  [
    'Group',
    'User',
    'Click'
  ].forEach(function(model) {
    models[model] = require(__dirname + '/' + model)(sequelize, app);
  });
  
  // describe relationships
  (function(m) {
    m.Group.hasMany(m.User, { as: 'Members' });
    m.User.belongsTo(m.Group);
    
  
    m.User.hasMany(m.Click, { as: 'Clicks' });
    m.Click.belongsTo(m.User);
  }(models));
  
  
  sequelize.sync({force: false});
  
};

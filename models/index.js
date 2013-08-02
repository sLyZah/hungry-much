// As per http://redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html

var Sequelize = require('sequelize');
var config    = require('config').Mysql;  // we use node-config to handle environments

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

// load models
var models = [
  'Group',
  'User'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {
  m.User.hasMany(m.Group, { as: 'Group' });
  m.Group.hasOne(m.User, { as: 'Admin', foreignKey: 'AdminGroupId' });
  m.Group.hasMany(m.User, { as: 'Members'});
})(module.exports);

// export connection
module.exports.sequelize = sequelize;
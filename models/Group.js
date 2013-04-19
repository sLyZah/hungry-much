module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    name: DataTypes.STRING,
    treshold: DataTypes.INTEGER,
  }, {
    instanceMethods: {
      countTasks: function() {
        // how to implement this method ?
      }
    }
  });
};

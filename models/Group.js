module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    treshold: { type: DataTypes.INTEGER, defaultValue: 3 },
    key: DataTypes.STRING
  }, {
    instanceMethods: {
      countGroups: function() {
        // how to implement this method ?
      }
    }
  });
};

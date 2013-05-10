module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    admin: { type: DataTypes.STRING, allowNull: false },
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

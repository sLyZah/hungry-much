module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, validate: { isEmail: true } }
  }, {});
};

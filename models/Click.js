module.exports = function(sequelize, DataTypes) {
  var Click = sequelize.define('Click', {
    timestamp: { type: DataTypes.DATE}
  }, {});
  
  return Click;
};

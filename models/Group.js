module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    treshold: { type: DataTypes.INTEGER, defaultValue: 3 },
    key: DataTypes.STRING,
    adminId: { type: DataTypes.INTEGER }
  }, {
    instanceMethods: {
      getUniqueClicks: function (config) {
        var after = config.after;
        
        return this.getClicks({
          where: {
            
          }
        })
      }
    }
  });
};

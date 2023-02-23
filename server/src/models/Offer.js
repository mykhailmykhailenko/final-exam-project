const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    static associate(models) {

      Offer.belongsTo(models.User, { 
        foreignKey: 'userId', sourceKey: 'id' 
      });
      Offer.belongsTo(models.Contest, { 
        foreignKey: 'contestId', sourceKey: 'id' } );
      Offer.hasOne(models.Rating, { 
        foreignKey: 'offerId', targetKey: 'id' });
    }
  }
   Offer.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Offer',
    tableName: 'Offers',
    timestamps: false,
  });



  return Offer;
};
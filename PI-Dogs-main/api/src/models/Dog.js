const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    id: {
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height_min:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight_min:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height_max:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight_max:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    life_span:{
      type: DataTypes.STRING,
      allowNull: true
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true
    },
},
{
  timestamp: false
})
};
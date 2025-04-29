const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tecnic = sequelize.define('TECNICS', {
  id_tecnic: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_dpt: DataTypes.INTEGER,
  nom: { 
    type: DataTypes.STRING,  
    allowNull: false  
  }
}, {
  tableName: 'TECNIC',
  timestamps: false
});

module.exports = Tecnic;

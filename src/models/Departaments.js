const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Departament = sequelize.define('DEPARTAMENT', {
  id_dpt: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING,
  ubicació: DataTypes.STRING
}, {
  tableName: 'DEPARTAMENT',
  timestamps: false
});

module.exports = Departament;

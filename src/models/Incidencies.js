// src/models/Incidencies.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Incidencia', {
  id_dpt: DataTypes.INTEGER,
  usuari_id: DataTypes.INTEGER,
  tecnic_id: DataTypes.INTEGER,
  id_tipus: DataTypes.INTEGER,
  data_creacio: DataTypes.DATE,
  descripcio: DataTypes.STRING,
  prioridad: DataTypes.STRING,
  estat: DataTypes.STRING
}, {
  tableName: 'INCIDENCIES', // Asegúrate que coincide con tu tabla
  timestamps: false
});

module.exports =  Incidencia ;


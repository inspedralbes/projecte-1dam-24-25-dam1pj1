const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TipusIncidencia = sequelize.define('TIPUS_INCIDENCIES', {
  id_tipus: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING
}, {
  tableName: 'TIPUS_INCIDENCIES',
  timestamps: false
});

module.exports = TipusIncidencia;


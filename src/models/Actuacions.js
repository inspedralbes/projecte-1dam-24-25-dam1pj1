const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Actuacio = sequelize.define('ACTUACIONS', {
  id_actuacio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_incidencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_incidencia' 
  },
  tecnic_id: DataTypes.INTEGER,
  dat: DataTypes.DATE,
  descripcio: DataTypes.TEXT,
  temps_invertit: DataTypes.INTEGER,
  visible: DataTypes.BOOLEAN
}, {
  tableName: 'ACTUACIONS',
  timestamps: false
});

module.exports = Actuacio;

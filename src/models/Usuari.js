  // models/Usuari.js
  const { DataTypes } = require('sequelize');
  const sequelize = require('../db'); // ajusta la ruta si es diferente

  const Usuari = sequelize.define('Usuari', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    esAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'USUARIS',
    timestamps: false
  });

  module.exports = Usuari;

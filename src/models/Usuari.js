const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuario = sequelize.define('USUARIS', {
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
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'USUARIS',
  timestamps: false
});

module.exports = Usuario;

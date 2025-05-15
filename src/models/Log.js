const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  usuari: String,
  accio: String,
  missatge: String,
  ruta: String,
  ip: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema, 'logs'); 
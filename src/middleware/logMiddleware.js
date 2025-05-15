const { registrarLog } = require('../middleware/logger');

function logAccess(req, res, next) {
  registrarLog(req, 'Accés', `L'usuari ha accedit a ${req.originalUrl}`);
  next();
}

module.exports = { logAccess };

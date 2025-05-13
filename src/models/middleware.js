 
const Log = require('../models/Log');

const logger = async (req, res, next) => {
  try {
    // Crear el log
    const logEntry = new Log({
      url: req.originalUrl,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      referer: req.headers.referer || ''
    });

    // Guardar el log de forma asíncrona (sense esperar)
    logEntry.save().catch(err => console.error('Error al guardar log:', err));
    
    next();
  } catch (error) {
    console.error('Error al middleware de logs:', error);
    next(); // Continuem l'execució encara que hi hagi error en el logging
  }
};

module.exports = logger;
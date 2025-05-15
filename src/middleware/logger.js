const Log = require('../models/Log');

function registrarLog(req, accio, missatge) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  Log.create({
    usuari: (req.session && req.session.usuari && req.session.usuari.nom) || 'Desconegut',
    accio,
    missatge,
    ruta: req.originalUrl,
    ip
  })
  .then(() => console.log(`📝 Log creat: ${accio}`))
  .catch(err => console.error('❌ Error al guardar log:', err));
}

module.exports = { registrarLog };

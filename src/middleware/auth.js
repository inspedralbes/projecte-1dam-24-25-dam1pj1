// middleware/auth.js
function estaAutenticat(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

function esAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.rol === 'admin') {
    return next();
  }
  return res.status(403).send('Accés denegat. Només per admins.');
}

module.exports = {
  estaAutenticat,
  esAdmin,
};

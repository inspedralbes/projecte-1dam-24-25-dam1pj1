// middlewares/auth.js
function checkAuth(req, res, next) {
  if (req.session && req.session.usuarioId) {
    next();
  } else {
    res.redirect('/login');
  }
}

function checkAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin === true) {
    return next();
  }
  res.status(403).send('Accés no autoritzat, mafiós de segona');
}


module.exports = { checkAuth, checkAdmin };

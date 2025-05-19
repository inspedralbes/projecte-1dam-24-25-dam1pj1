// middlewares/auth.js
function checkAuth(req, res, next) {
  if (!req.session.user) {

    req.session.toastr = {
      type: 'warning',
      title: 'Sessió requerida',
      message: 'Has d\'iniciar sessió per accedir aquí.'
    };

    return res.redirect('/login');
  }
  next();
}


function checkAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin === true) {
    return next();
  }

  req.session.toastr = {
    type: 'warning',
    title: 'Accés denegat',
    message: 'Només els administradors poden accedir aquí.'
  };
  return res.redirect('/login');
}

module.exports = { checkAuth, checkAdmin };

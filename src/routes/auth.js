const express = require('express');
const Usuario = require('../models/Usuari');
const router = express.Router();

router.get('/login', (req, res) => {
  const toastr = req.session.toastr;
  req.session.toastr = null; 
  res.render('login', { toastr });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error cerrando sesión:', err);
    }
    res.redirect('/login');
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { username } });

    if (user && user.password === password) {
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      };

      req.session.save(err => {
        if (err) {
          console.error('💥 Error guardando sesión:', err);
          return res.status(500).send('Error al guardar sesión');
        }
        return res.redirect('/');
      });
    } else {
      req.session.toastr = {
        type: 'error',
        title: 'Error de login',
        message: 'Usuari o contrasenya incorrectes'
      };
      return res.redirect('/login');
    }
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).render('login', {
      error: 'Error del servidor. Torna-ho a intentar més tard.'
    });
  }
});

module.exports = router;

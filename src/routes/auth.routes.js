const express = require('express');
const router = express.Router();
const Usuari = require('../models/Usuari'); // Asegúrate de que esté bien la ruta

// Página de login
router.get('/login', (req, res) => {
  res.render('auth/login'); // Tu vista de login.ejs
});

// Login post
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuari = await Usuari.findOne({ where: { username } });

    if (!usuari) {
      return res.render('auth/login', { error: 'Usuari no trobat' });
    }

    if (usuari.password !== password) {
      return res.render('auth/login', { error: 'Contrasenya incorrecta' });
    }

    req.session.user = {
      id: usuari.id,
      username: usuari.username,
      esAdmin: usuari.esAdmin
    };

    console.log('Usuari loguejat:', req.session.user);

    if (usuari.esAdmin) {
      return res.redirect('/incidencies'); // Para el admin
    } else {
      return res.redirect('/incidencies_user'); // Para usuarios normales
    }

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error intern del servidor');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

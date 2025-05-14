// routes/login.js
const express = require('express');
const router = express.Router();
const Usuari = require('../models/Usuari');

// GET login page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuari.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.render('auth/login', { error: 'Usuari o contrasenya incorrecte' });
    }

    req.session.usuari = user;
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.render('auth/login', { error: 'Error del servidor' });
  }
});

module.exports = router;

const express = require('express');
const Usuario = require('../models/Usuari');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login'); 
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

      console.log('👑 Login exitoso:', req.session.user);
      res.redirect('/incidencies');
      
    } else {
      return res.status(401).render('login', {
        error: 'Usuari o contrasenya incorrectes'
      });
    }
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).render('login', {
      error: 'Error del servidor. Torna-ho a intentar més tard.'
    });
  }
});

module.exports = router;

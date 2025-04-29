// src/routes/categoriesEJS.routes.js
const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencies'); // Asumimos que este es el modelo correcto
const Departament = require('../models/Departaments'); // Asumimos que este es el modelo correcto
const Tecnic = require('../models/Tecnics'); // Asumimos que este es el modelo correcto
const TipusIncidencia = require('../models/TipusIncidencies');

// Llistar categories
router.get('/', async (req, res) => {
  console.log("hola")
  try {
    const incidencies = await Incidencia.findAll({
      include: [
        {
          model: Departament,
          attributes: ['id_dpt', 'nom']
        },
        {
            model: Tecnic,
            attributes: ['id_tecnic', 'nom']
        }
      ]
    });
    console.log(incidencies);
    res.render('incidencies/list', { incidencies });
  } catch (error) {
    res.status(500).send('Error al recuperar incidencies');
  }
});

// Form nova categoria
router.get('/new', async (req, res) => {  // Cambié aquí para hacer la función async
  try {
    const departaments = await Departament.findAll();
    const tecnics = await Tecnic.findAll();
    const tipusIncidencia = await TipusIncidencia.findAll();
    res.render('incidencies/new', { departaments, tecnics, tipusIncidencia });
  } catch (error) {
    console.error('Error al cargar formulario de creación:', error);
    res.status(500).send('Error al cargar formulario de creación');
  }
});

// Crear categoria
router.post('/create', async (req, res) => {
  try {
    const { descripcion, estado, prioridad, id_dpt, tecnic_id, id_tipus } = req.body;

    const moment = require('moment-timezone');
    const dataCreacio = moment().tz('Europe/Madrid').toDate();

    const incidencia = await Incidencia.create({
      descripcion,
      usuari_id = 1,
      estado,
      prioridad,
      id_dpt,
      dataCreacio,
      tecnic_id,
      id_tipus,
    });
    
    console.log('Incidencia creada', incidencia);
    res.redirect('/incidencies'); // Redirige al listado de incidencias
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).send('Error al crear incidencia');
  }
});



// Form edició categoria
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id)
    console.log('🕵️‍♂️ Buscando incidencia con ID:', req.params.id);

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    } 

    res.render('incidencies/edit', { incidencia });
  } catch (error) {
    console.error('💥 Error al carregar el formulari:', error);
    res.status(500).send('Error al carregar formulari d’edició');
  }
});

// Actualitzar categoria
router.post('/:id/update', async (req, res) => {
  try {
    const { name } = req.body;
    const incidencia = await Category.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');
    incidencia.name = name;
    await incidencia.save();
    res.redirect('/incidencies');
  } catch (error) {
    res.status(500).send('Error al actualitzar la incidència');
  }
});

// Eliminar categoria
router.get('/:id/delete', async (req, res) => {
  try {
    const incidencia = await Category.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');
    await incidencia.destroy();
    res.redirect('/incidencies');
  } catch (error) {
    res.status(500).send('Error al eliminar la incidència');
  }
});

module.exports = router;

// src/routes/incidenciesEJS.routes.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const Incidencia = require('../models/Incidencies');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');
const TipusIncidencia = require('../models/TipusIncidencies');
const Actuacio = require('../models/Actuacions');

// Listar incidencias
router.get('/', async (req, res) => {
  try {
    const tecnicId = req.query.tecnic_id;

    const whereCondition = tecnicId
      ? { [Op.or]: [{ tecnic_id: tecnicId }, { tecnic_id: null }] }
      : {};

      const incidencies = await Incidencia.findAll({
        where: whereCondition,
        include: [
          { model: Departament, as: 'departament', attributes: ['id_dpt', 'nom'] },
          { model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] },
          { model: TipusIncidencia, as: 'tipus_incidencia', attributes: ['id_tipus', 'nom'] }
        ]
      });

    const tecnics = await Tecnic.findAll();

    res.render('incidencies/list', {
      incidencies,
      tecnics,
      tecnic_id: parseInt(tecnicId) || null
    });
  } catch (error) {
    console.error('❌ Error al recuperar incidències:', error);
    res.status(500).send('Error al recuperar incidències');
  }
});

// Formulario nueva incidencia
router.get('/new', async (req, res) => {
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

// Crear nueva incidencia
router.post('/create', async (req, res) => {
  try {
    const { descripcio, estat, prioridad, id_dpt, tecnic_id, id_tipus } = req.body;

    await Incidencia.create({
      descripcio,
      usuari_id: 1, // Ajusta si tienes usuarios reales
      estat,
      prioridad,
      id_dpt,
      data_creacio: new Date(),
      tecnic_id,
      id_tipus,
    });

    res.redirect('/incidencies');
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).send('Error al crear incidencia');
  }
});

// Formulario de edición
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    const tecnics = await Tecnic.findAll();

    if (!incidencia) return res.status(404).send('Incidència no trobada');

    res.render('incidencies/edit', { incidencia, tecnics });
  } catch (error) {
    console.error('💥 Error al carregar el formulari:', error);
    res.status(500).send('Error al carregar formulari d’edició');
  }
});

// Actualizar incidencia
router.post('/:id/update', async (req, res) => {
  try {
    const { id_dpt, tecnic_id, id_tipus, descripcio, estat, prioridad } = req.body;

    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    Object.assign(incidencia, {
      id_dpt,
      tecnic_id,
      id_tipus,
      descripcio,
      estat,
      prioridad
    });

    await incidencia.save();
    res.redirect('/incidencies');
  } catch (error) {
    console.error('💥 Error al actualizar la incidencia:', error.message);
    res.status(500).send('Error al actualitzar la incidència: ' + error.message);
  }
});

// Eliminar incidencia
router.get('/:id/delete', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    await incidencia.destroy();
    res.redirect('/incidencies');
  } catch (error) {
    console.error('💣 Error al eliminar la incidència', error);
    res.status(500).send('Error al eliminar la incidència: ' + error.message);
  }
});

// Mostrar actuacions d'una incidencia
router.get('/:id/actuacions', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id, {
      include: [
        { model: Departament, as: 'departament', attributes: ['id_dpt', 'nom'] },
        { model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] },
        { model: TipusIncidencia, as: 'tipus_incidencia', attributes: ['id_tipus', 'nom'] },
      ]
    });

    if (!incidencia) return res.status(404).send('Incidència no trobada');

    const actuacions = await Actuacio.findAll({
      where: { id_incidencia: req.params.id },
      include: [{ model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] }]
    });

    console.log('Actuacions recuperadas:', actuacions);  // Verifica qué datos se están recuperando

    res.render('incidencies/actuacions', { incidencia, actuacions });
  } catch (error) {
    console.error('Error al cargar las actuacions:', error);
    res.status(500).send('Error al cargar las actuacions');
  }
});


// Formulario per crear actuació
router.get('/actuacions/crear/:id_incidencia', async (req, res) => {
  const { id_incidencia } = req.params;
  try {
    const tecnics = await Tecnic.findAll();

    res.render('incidencies/crearActuacio', {
      id_incidencia,
      tecnics
    });    
  } catch (error) {
    console.error('Error al mostrar el formulario de creación:', error);
    res.status(500).send('Error interno al mostrar el formulario');
  }
});

// Crear actuació
router.post('/actuacions/crear', async (req, res) => {
  const { id_incidencia, tecnic_id, dat, descripcio, temps_invertit } = req.body;

  // Verifica que la fecha que recibes no sea null o undefined
  console.log('Fecha recibida para la actuación:', dat);

  try {
    if (dat) {
      const fecha = new Date(dat);
      if (!isNaN(fecha)) {
        // Fecha válida
        data_actuacio = fecha;
      } else {
        console.log('Fecha inválida:', dat);
        data_actuacio = null;
      }
    } else {
      data_actuacio = null;
    }
    
    await Actuacio.create({
      id_incidencia,
      tecnic_id,
      data_actuacio,
      descripcio,
      temps_invertit,
      visible: true
    });
    

    res.redirect(`/incidencies/${id_incidencia}/actuacions`);
  } catch (error) {
    console.error('Error creando la actuación:', error);
    res.status(500).send('Error interno');
  }
});



module.exports = router;
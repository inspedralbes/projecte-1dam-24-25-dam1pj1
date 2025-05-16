const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const Incidencia = require('../models/Incidencies');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');
const TipusIncidencia = require('../models/TipusIncidencies');
const Actuacio = require('../models/Actuacions');
const Log = require('../models/Log');

const { checkAuth, checkAdmin } = require('../middleware/auth');

// Listar incidencias (solo logueados)
router.get('/', checkAuth, checkAdmin, async (req, res) => {
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

// Formulario nueva incidencia (solo admin)
router.get('/new', checkAuth, checkAdmin, async (req, res) => {
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

// Crear nueva incidencia (solo admin)
router.post('/create', checkAuth, checkAdmin, async (req, res) => {
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

// Formulario de edición (solo admin)
router.get('/:id/edit', checkAuth, checkAdmin, async (req, res) => {
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

// Actualizar incidencia (solo admin)
router.post('/:id/update', checkAuth, checkAdmin, async (req, res) => {
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

// Eliminar incidencia (solo admin)
router.get('/:id/delete', checkAuth, checkAdmin, async (req, res) => {
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

// Mostrar actuacions d'una incidencia (logueado)
router.get('/:id/actuacions', checkAuth, async (req, res) => {
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

    res.render('incidencies/actuacions', { incidencia, actuacions });
  } catch (error) {
    console.error('Error al cargar las actuacions:', error);
    res.status(500).send('Error al cargar las actuacions');
  }
});

// Formulario per crear actuació (solo admin)
router.get('/actuacions/crear/:id_incidencia', checkAuth, checkAdmin, async (req, res) => {
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

// Crear actuació (solo admin)
router.post('/actuacions/crear', checkAuth, checkAdmin, async (req, res) => {
  const { id_incidencia, tecnic_id, dat, descripcio, temps_invertit } = req.body;

  try {
    let data_actuacio = null;
    if (dat) {
      const fecha = new Date(dat);
      if (!isNaN(fecha)) {
        data_actuacio = fecha;
      } else {
        console.log('Fecha inválida:', dat);
      }
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

// Logs (solo admin)
router.get('/logs', checkAuth, checkAdmin, async (req, res) => {
  try {
    const logs = await Log.find().sort({ data: -1 }).limit(100);
    res.render('incidencies/logs', { logs });
  } catch (error) {
    res.status(500).send('Error al mostrar los logs: ' + error.message);
  }
});

module.exports = router;

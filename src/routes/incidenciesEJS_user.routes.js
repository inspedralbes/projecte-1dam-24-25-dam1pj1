const express = require('express');
const router = express.Router();

const Incidencia = require('../models/Incidencies');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');
const TipusIncidencia = require('../models/TipusIncidencies');
const Actuacio = require('../models/Actuacions');

const { checkAuth } = require('../middleware/auth'); // 💥 Importamos el middleware de auth

// LISTAR INCIDÈNCIES (público)
router.get('/', async (req, res) => {
  try {
    const whereCondition = {};
    if (req.query.estat) {
      whereCondition.estat = req.query.estat;
    }

    const incidencies = await Incidencia.findAll({
      where: whereCondition,
      include: [
        { model: Departament, as: 'departament', attributes: ['id_dpt', 'nom'] },
        { model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] },
        { model: TipusIncidencia, as: 'tipus_incidencia', attributes: ['id_tipus', 'nom'] }
      ]
    });

    res.render('incidencies_user/list', { incidencies });
  } catch (error) {
    console.error('Error al recuperar incidències:', error);
    res.status(500).send('Error al recuperar incidències');
  }
});

// FORMULARIO NUEVA INCIDÈNCIA (solo logueados)
router.get('/new', checkAuth, async (req, res) => {
  try {
    const departaments = await Departament.findAll();
    const tecnics = await Tecnic.findAll();
    const tipusIncidencia = await TipusIncidencia.findAll();

    res.render('incidencies_user/new', { departaments, tecnics, tipusIncidencia });
  } catch (error) {
    console.error('Error al cargar formulario de creación:', error);
    res.status(500).send('Error al cargar formulario de creación');
  }
});

// CREAR INCIDÈNCIA (solo logueados)
router.post('/create', checkAuth, async (req, res) => {
  try {
    const { descripcio, estat, prioridad, id_dpt, tecnic_id, id_tipus } = req.body;

    await Incidencia.create({
      descripcio,
      usuari_id: req.session && req.session.user ? req.session.user.id : 1,
      estat,
      prioridad,
      id_dpt,
      data_creacio: new Date(),
      tecnic_id,
      id_tipus
    });

    res.redirect('/incidencies_user');
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).send('Error al crear incidencia');
  }
});

// VER ACTUACIONS D'UNA INCIDÈNCIA (público)
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

    res.render('incidencies_user/actuacions', { incidencia, actuacions });
  } catch (error) {
    console.error('Error al cargar las actuacions:', error);
    res.status(500).send('Error al cargar las actuacions');
  }
});

module.exports = router;

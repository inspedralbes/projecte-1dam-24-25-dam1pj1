const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const Incidencia = require('../models/Incidencies');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');
const TipusIncidencia = require('../models/TipusIncidencies');
const Actuacio = require('../models/Actuacions');
const Logs = require('../models/Log');

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

// FORMULARIOS Y CRUD
router.get('/new', async (req, res) => {
  try {
    const departaments = await Departament.findAll();
    const tecnics = await Tecnic.findAll();
    const tipusIncidencia = await TipusIncidencia.findAll();
    res.render('incidencies/new', {
      departaments,
      tecnics,
      tipusIncidencia
    });
  } catch (error) {
    res.status(500).send('Error al cargar formulario de creación');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    const tecnics = await Tecnic.findAll();
    if (!incidencia) return res.status(404).send('Incidència no trobada');
    res.render('incidencies/edit', {
      incidencia,
      tecnics
    });
  } catch (error) {
    res.status(500).send('Error al carregar formulari');
  }
});

router.get('/:id/actuacions', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id, {
      include: [
        { model: Departament, as: 'departament', attributes: ['id_dpt', 'nom'] },
        { model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] },
        { model: TipusIncidencia, as: 'tipus_incidencia', attributes: ['id_tipus', 'nom'] },
      ]
    });

    const actuacions = await Actuacio.findAll({
      where: { id_incidencia: req.params.id },
      include: [{ model: Tecnic, as: 'tecnic', attributes: ['id_tecnic', 'nom'] }]
    });

    res.render('incidencies/actuacions', {
      incidencia,
      actuacions
    });
  } catch (error) {
    res.status(500).send('Error al cargar les actuacions');
  }
});

router.get('/actuacions/crear/:id_incidencia', async (req, res) => {
  try {
    const tecnics = await Tecnic.findAll();
    res.render('incidencies/crearActuacio', {
      id_incidencia: req.params.id_incidencia,
      tecnics
    });
  } catch (error) {
    res.status(500).send('Error interno al mostrar formulario');
  }
});

const Log = require('../models/Log');

router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ data: -1 }).limit(100);
    res.render('incidencies/logs', { logs });
  } catch (error) {
    res.status(500).send('Error al carregar els logs');
  }
});



module.exports = router;

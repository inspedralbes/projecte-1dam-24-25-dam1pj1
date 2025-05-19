// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { Op, fn, col, literal, Sequelize } = require('sequelize');

const Incidencia = require('../models/Incidencies');
const Actuacio = require('../models/Actuacions');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');

const { checkAuth } = require('../middleware/auth');

router.get('/', checkAuth, async (req, res) => {
  try {
    // Total incidencies
    const totalIncidencies = await Incidencia.count();

    // Total actuacions
    const actuacionsTotals = await Actuacio.count();

    // Incidencies per departament
    const incidenciesPerDepartament = await Incidencia.findAll({
      attributes: ['id_dpt', [fn('COUNT', col('id')), 'total']],
      group: ['id_dpt'],
    });

    // Incidencies per estat
    const incidenciesPerEstat = await Incidencia.findAll({
      attributes: ['estat', [fn('COUNT', col('estat')), 'total']],
      group: ['estat'],
    });

    // Actuacions per tècnic
    const actuacionsPerTecnic = await Actuacio.findAll({
      include: [{ model: Tecnic, as: 'tecnic', attributes: ['nom'] }],
      attributes: ['tecnic_id', [fn('COUNT', col('tecnic_id')), 'total']],
      group: ['tecnic_id', 'tecnic.id_tecnic', 'tecnic.nom'],
    });

    // Incidencies per mes (usant `createdAt`)
    const incidenciesPerMes = await Incidencia.findAll({
      attributes: [
        [fn('MONTH', col('createdAt')), 'mes'],
        [fn('COUNT', col('id')), 'total']
      ],
      group: [literal('MONTH(createdAt)')],
      order: [[literal('MONTH(createdAt)'), 'ASC']],
    });

    // Temps mitjà invertit per actuació
    const tempsMitja = await Actuacio.findOne({
      attributes: [[fn('AVG', col('temps_invertit')), 'temps_mitja']],
    });

    // Top 5 departaments amb més incidències
    const topDepartaments = await Incidencia.findAll({
      include: [{ model: Departament, as: 'departament', attributes: ['nom'] }],
      attributes: [[col('Incidencia.id_dpt'), 'id_dpt'], [fn('COUNT', col('Incidencia.id_dpt')), 'total']],
      group: ['Incidencia.id_dpt', 'departament.id_dpt', 'departament.nom'],
      order: [[literal('total'), 'DESC']],
      limit: 5,
    });


    // Tècnic amb més actuacions
    const tecnicTop = await Actuacio.findAll({
      include: [{ model: Tecnic, as: 'tecnic', attributes: ['nom'] }],
      attributes: ['tecnic_id', [fn('COUNT', col('tecnic_id')), 'total']],
      group: ['tecnic_id', 'tecnic.nom'],
      order: [[literal('total'), 'DESC']],
      limit: 1,
    });

    // Últimes incidències (usant `createdAt`)
    const ultimesIncidencies = await Incidencia.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.render('dashboard', {
      totalIncidencies,
      actuacionsTotals,
      incidenciesPerDepartament,
      incidenciesPerEstat,
      actuacionsPerTecnic,
      incidenciesPerMes,
      tempsMitja: parseFloat(tempsMitja.temps_mitja).toFixed(2),
      topDepartaments,
      tecnicTop,
      ultimesIncidencies
    });
  } catch (err) {
    console.error('Error carregant dashboard:', err);
    res.status(500).send('Error carregant dashboard');
  }
});

module.exports = router;

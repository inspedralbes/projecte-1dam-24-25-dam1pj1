const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencies');
const Departament = require('../models/Departaments');
const Tecnic = require('../models/Tecnics');
const TipusIncidencia = require('../models/TipusIncidencies');
const Actuacio = require('../models/Actuacions'); // Asegúrate que el nombre del archivo y modelo es correcto


// Listar incidencias
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [
        { model: Departament, 
          attributes: ['id_dpt', 'nom'] 
        },
        {
          model: Tecnic,
          attributes: ['id_tecnic', 'nom'],
          as: 'tecnic'
        }
      ]
    });
    res.render('incidencies_user/list', { incidencies }); // <-- asegurate de tener views/incidencies_user/list.ejs
  } catch (error) {
    res.status(500).send('Error al recuperar incidències');
  }
});

// Formulario de nueva incidencia
router.get('/new', async (req, res) => {
  try {
    const departaments = await Departament.findAll();
    const tecnics = await Tecnic.findAll();
    const tipusIncidencia = await TipusIncidencia.findAll();
    res.render('incidencies_user/new', { departaments, tecnics, tipusIncidencia }); // <-- esta vista debe existir
  } catch (error) {
    console.error('Error al cargar formulario de creación:', error);
    res.status(500).send('Error al cargar formulario de creación');
  }
});

// Crear incidencia
router.post('/create', async (req, res) => {
  try {
    const { descripcio, estat, prioridad, id_dpt, tecnic_id, id_tipus } = req.body;
    const incidencia = await Incidencia.create({
      descripcio,
      usuari_id: 1, 
      estat,
      prioridad,
      id_dpt,
      data_creacio: new Date(),
      tecnic_id,
      id_tipus
    });
    res.redirect('/incidencies_user'); // Redirige al listado
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    res.status(500).send('Error al crear incidencia');
  }
});

// Ver actuaciones de una incidencia
router.get('/:id/actuacions', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    
    // Buscar la incidencia
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        {
          model: Departament,
          attributes: ['id_dpt', 'nom']
        },
        {
          model: Tecnic,
          as: 'tecnic', // 👈🏽 AQUÍ ESTÁ EL ALIAS
          attributes: ['id_tecnic', 'nom']
        },
        {
          model: TipusIncidencia,
          attributes: ['id_tipus', 'nom']
        }
      ]
    });
    
    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    // Aquí puedes hacer la lógica para obtener las actuaciones relacionadas
    // Supongamos que tienes un modelo Actuacions que guarda las actuaciones de cada incidencia
    const actuacions = await Actuacio.findAll({
      where: { incidencia_id: incidenciaId },
      include: [
        {
          model: Tecnic,
          as: 'tecnic',
          attributes: ['id_tecnic', 'nom']
        }
      ]
    });

    // Renderizar la vista con la incidencia y sus actuaciones
    res.render('incidencies/actuacions', { incidencia, actuacions });
  } catch (error) {
    console.error('Error al cargar les actuacions:', error);
    res.status(500).send('Error al cargar les actuacions');
  }
});

module.exports = router;

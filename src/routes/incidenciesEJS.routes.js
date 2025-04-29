// src/routes/categoriesEJS.routes.js
const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencies'); // Asumimos que este es el modelo correcto
const Departament = require('../models/Departaments'); // Asumimos que este es el modelo correcto
const Tecnic = require('../models/Tecnics'); // Asumimos que este es el modelo correcto
const TipusIncidencia = require('../models/TipusIncidencies');

// Llistar categories
router.get('/', async (req, res) => {
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
    console.log("🤖 Datos del form:", req.body);  
    const { descripcio, estat, prioridad, id_dpt, tecnic_id, id_tipus } = req.body;
    const incidencia = await Incidencia.create({
      descripcio,
      usuari_id: 1,
      estat,
      prioridad,
      id_dpt,
      data_creacio: new Date(),
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
    console.log("entra al try");
    const { id_dpt, tecnic_id, id_tipus, descripcio, estat, prioridad } = req.body;

    const incidencia = await Incidencia.findByPk(req.params.id);  
    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    incidencia.id_dpt = id_dpt;
    incidencia.tecnic_id = tecnic_id;
    incidencia.id_tipus = id_tipus;
    incidencia.descripcio = descripcio;
    incidencia.estat = estat;
    incidencia.prioridad = prioridad;

    // Guardando los cambios
    await incidencia.save();

    // Redirige a la lista de incidencias
    res.redirect('/incidencies');
  } catch (error) {
    console.error('💥 Error al actualizar la incidencia:', error.message);
    res.status(500).send('Error al actualitzar la incidència' + error.message);
  }
});

// Eliminar categoria
router.get('/:id/delete', async (req, res) => {
  try {
    console.log("🧨 Intentando eliminar incidencia con ID:", req.params.id);
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      console.log("❌ No se encontró la incidencia");
      return res.status(404).send('Incidència no trobada');
    }
    await incidencia.destroy();
    console.log("✅ Incidència eliminada correctamente");
    res.redirect('/incidencies');
  } catch (error) {
    console.error('💣 Error al eliminar la incidència', error);
    res.status(500).send('Error al eliminar la incidència: ' + error.message);
  }
});

module.exports = router;

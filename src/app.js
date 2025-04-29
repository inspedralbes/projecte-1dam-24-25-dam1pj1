// src/app.js
require('dotenv').config();
console.log('User:', process.env.MYSQL_USER);
const express = require('express');
const sequelize = require('./db');

const Incidencia = require('./models/Incidencies');
const Actuacio = require('./models/Actuacions');
const Departament = require('./models/Departaments');
const TipusIncidencia = require('./models/TipusIncidencies');
const Tecnic = require('./models/Tecnics');

Incidencia.belongsTo(Departament, { foreignKey: 'id_dpt' });
Departament.hasMany(Incidencia, { foreignKey: 'id_dpt', onDelete: 'CASCADE' });


Incidencia.belongsTo(Tecnic, { foreignKey: 'tecnic_id' });
Tecnic.hasMany(Incidencia, { foreignKey: 'tecnic_id', onDelete: 'CASCADE' });


Incidencia.belongsTo(TipusIncidencia, { foreignKey: 'id_tipus' });
TipusIncidencia.hasMany(Incidencia, { foreignKey: 'id_tipus', onDelete: 'CASCADE' });

Actuacio.belongsTo(Incidencia, { foreignKey: 'id_incidencia' });
Incidencia.hasMany(Actuacio, { foreignKey: 'id_incidencia', onDelete: 'CASCADE' });





// Rutes EJS
const incidenciaRoutesEJS = require('./routes/incidenciesEJS.routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS config
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

// Estàtica
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Rutes 
app.use('/incidencies', incidenciaRoutesEJS);

// Ruta d'inici
app.get('/', async (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;

(async () => {

  try {
    sequelize.sync()
      .then(() => {
        console.log('Base de datos sincronizada');
      })
      .catch((error) => {
        console.error('Error al sincronizar la base de datos', error);
      });

    await Departament.create({
        nom: 'Info-2',
        ubicacio: '2aPlanta',
      });  

    await Tecnic.create({
      nom: 'Jordi Rocha',
        id_dpt: Departament.id_dpt,
      });
    await Tecnic.create({
      nom: 'Fiona Mondelo',
        id_dpt: Departament.id_dpt,
      });

    await TipusIncidencia.create({
        nom: 'Problema técnico',
      });

    await Incidencia.create({
        id_dpt: 1,
        usuari_id: 1,
        tecnic_id: 1,
        id_tipus: 1,
        data_creacio: new Date(),
        descripcio: 'Problema con el monitor',
        prioridad: 'Alta',
        estat: 'Abierta',
      });  

    await Actuacio.create({
        id_incidencia: Incidencia.id,
        tecnic_id: Tecnic.id_tecnic,
        dat: new Date(),
        descripcio: 'Reparación del monitor',
        temps_invertit: 120,
        visible: 1,
      });  

    // Engega el servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor escoltant a http://localhost:${port}`);
    });
  } catch (error) {
    console.error("💀 Error a l'inici:", error);
  }
})();

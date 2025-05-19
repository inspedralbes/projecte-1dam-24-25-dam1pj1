// src/app.js
require('dotenv').config();
console.log('User:', process.env.MYSQL_USER);
const express = require('express');
const session = require('express-session');
const sequelize = require('./db');
const connectMongo = require('./mongo');

const { logAccess } = require('./middleware/logMiddleware');


const Incidencia = require('./models/Incidencies');
const Actuacio = require('./models/Actuacions');
const Departament = require('./models/Departaments');
const TipusIncidencia = require('./models/TipusIncidencies');
const Tecnic = require('./models/Tecnics');
const Usuari = require('./models/Usuari');



Incidencia.belongsTo(Departament, { foreignKey: 'id_dpt', as: 'departament' });
Departament.hasMany(Incidencia, { foreignKey: 'id_dpt', onDelete: 'CASCADE' });


Incidencia.belongsTo(Tecnic, { foreignKey: 'tecnic_id', targetKey: 'id_tecnic', as: 'tecnic' });
Tecnic.hasMany(Incidencia, { foreignKey: 'tecnic_id', onDelete: 'CASCADE' });


Incidencia.belongsTo(TipusIncidencia, { foreignKey: 'id_tipus', as: 'tipus_incidencia' });
TipusIncidencia.hasMany(Incidencia, { foreignKey: 'id_tipus', onDelete: 'CASCADE' });

Actuacio.belongsTo(Incidencia, { foreignKey: 'id_incidencia', onDelete: 'CASCADE' });
Incidencia.hasMany(Actuacio, { foreignKey: 'id_incidencia', onDelete: 'CASCADE' });

Actuacio.belongsTo(Tecnic, { foreignKey: 'tecnic_id', as: 'tecnic' });
Tecnic.hasMany(Actuacio, { foreignKey: 'tecnic_id', as: 'actuacions' });


// Rutes EJS

const incidenciaRoutesEJS = require('./routes/incidenciesEJS.routes');
const incidenciaRoutesEJS_user = require('./routes/incidenciesEJS_user.routes');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secreto_ultraseguro_123', // cámbialo en producción
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

connectMongo();
app.use(logAccess);
// EJS config
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

// Estàtica
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Rutes 
app.use('/incidencies', incidenciaRoutesEJS);
app.use('/incidencies_user', incidenciaRoutesEJS_user);
app.use('/', authRoutes);

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
      nom: 'Info-1',
      ubicacio: '2aPlanta',
    });
    await Departament.create({
      nom: 'Info-3',
      ubicacio: '2aPlanta',
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
      nom: 'Problema de hardware',
    });
    await TipusIncidencia.create({
      nom: 'Problema de software',
    });
    await TipusIncidencia.create({
      nom: 'Problema amb cablejat',
    });
    await TipusIncidencia.create({
      nom: 'Problema amb conexio',
    });

    await Incidencia.create({
      id_dpt: 1,
      usuari_id: 1,
      tecnic_id: 2,
      id_tipus: 1,
      descripcio: 'Problema con el monitor',
      prioridad: 'Alta',
      estat: 'Abierta',
    });
    await Incidencia.create({
      id_dpt: 2,
      usuari_id: 1,
      tecnic_id: 1,
      id_tipus: 1,
      descripcio: 'L’ordinador no s’encén',
      prioridad: 'Alta',
      estat: 'Abierta',
    });
     await Incidencia.create({
      id_dpt: 2,
      usuari_id: 1,
      tecnic_id: 2,
      id_tipus: 1,
      descripcio: 'L’alumne no pot iniciar sessió a l’ordinador.',
      prioridad: 'Mitja',
      estat: 'Resolta',
    });
    await Incidencia.create({
      id_dpt: 2,
      usuari_id: 2,
      tecnic_id: 1,
      id_tipus: 1,
      descripcio: 'El projector no mostra imatge.',
      prioridad: 'Mitja',
      estat: 'En progreso',
    });
    await Incidencia.create({
      id_dpt: 2,
      usuari_id: 1,
      tecnic_id: 1,
      id_tipus: 1,
      descripcio: ' El so no funciona .',
      prioridad: 'Mitja',
      estat: 'Cerrada',
    });
    await Actuacio.create({         
      id_incidencia: 1,
      tecnic_id: 2,
      data_actuacio: new Date(),
      descripcio: 'Reparación del monitor',
      temps_invertit: 120,
      visible: 2,
    });

      await Actuacio.create({    
      id_incidencia: 2,
      tecnic_id: 1,
      data_actuacio: new Date(),
      descripcio: 'Comprovació del cablejat, prova amb una altra font d’alimentació, substitució de la font.',
      temps_invertit: 90,
      visible: 1,
    });

     await Actuacio.create({   
      id_incidencia: 3,
      tecnic_id: 2,
      data_actuacio: new Date(),
      descripcio: 'Restabliment de contrasenya o desbloqueig del compte.',
      temps_invertit: 30,
      visible: 1,
    });
    await Actuacio.create({
      id_incidencia: 4,
      tecnic_id: 1,
      data_actuacio: new Date(),
      descripcio: 'Comprovació de connexions VGA/HDMI, canvi de cable, configuració de pantalla duplicada.',
      temps_invertit: 30,
      visible: 2,

    }); await Actuacio.create({
      id_incidencia: 5,
      tecnic_id: 1,
      data_actuacio: new Date(),
      descripcio:'Comprovació de la sortida d’àudio seleccionada, drivers d’àudio, prova amb altres altaveus/auriculars. ',
      temps_invertit: 30,
      visible: 2,
    });
  
    await Usuari.create({
      username: 'admin',
      password: '12345', 
      isAdmin: true, 
    });

    await Usuari.create({
      username: 'juan',
      password: '12345', 
      isAdmin: false,
    });


    // Engega el servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor escoltant a http://localhost:${port}`);
    });
  } catch (error) {
    console.error("💀 Error a l'inici:", error);
  }
})();

// src/app.js
require('dotenv').config();
console.log('User:', process.env.MYSQL_USER);
const express = require('express');
const sequelize = require('./db');
const mongoose = require('mongoose'); // Afegim mongoose per MongoDB

// Connexió a MongoDB Atlas per als logs
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connectat: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de connexió MongoDB: ${error.message}`);
    // No aturem l'aplicació si falla la connexió a MongoDB
    // L'aplicació principal ha de seguir funcionant encara que el sistema de logs no funcioni
  }
};

// Model de Log per MongoDB
const LogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  method: {
    type: String
  },
  referer: {
    type: String
  }
});

const Log = mongoose.model('Log', LogSchema);

// Middleware per registrar logs
const logger = async (req, res, next) => {
  try {
    // Crear el log
    const logEntry = new Log({
      url: req.originalUrl,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      referer: req.headers.referer || ''
    });

    // Guardar el log de forma asíncrona (sense esperar)
    logEntry.save().catch(err => console.error('Error al guardar log:', err));
    
    next();
  } catch (error) {
    console.error('Error al middleware de logs:', error);
    next(); // Continuem l'execució encara que hi hagi error en el logging
  }
};


//
const Incidencia = require('./models/Incidencies');
const Actuacio = require('./models/Actuacions');
const Departament = require('./models/Departaments');
const TipusIncidencia = require('./models/TipusIncidencies');
const Tecnic = require('./models/Tecnics');

Incidencia.belongsTo(Departament, { foreignKey: 'id_dpt', as: 'departament' }); 
Departament.hasMany(Incidencia, { foreignKey: 'id_dpt', onDelete: 'CASCADE' });


Incidencia.belongsTo(Tecnic, {foreignKey: 'tecnic_id',targetKey: 'id_tecnic',as: 'tecnic'});
Tecnic.hasMany(Incidencia, { foreignKey: 'tecnic_id', onDelete: 'CASCADE' });


Incidencia.belongsTo(TipusIncidencia, { foreignKey: 'id_tipus', as: 'tipus_incidencia'});
TipusIncidencia.hasMany(Incidencia, { foreignKey: 'id_tipus', onDelete: 'CASCADE' });

Actuacio.belongsTo(Incidencia, { foreignKey: 'id_incidencia',onDelete: 'CASCADE' });
Incidencia.hasMany(Actuacio, { foreignKey: 'id_incidencia', onDelete: 'CASCADE' });

Actuacio.belongsTo(Tecnic, {foreignKey: 'tecnic_id', as: 'tecnic'});
Tecnic.hasMany(Actuacio, { foreignKey: 'tecnic_id', as: 'actuacions'});


// Rutes EJS
const incidenciaRoutesEJS = require('./routes/incidenciesEJS.routes');
const incidenciaRoutesEJS_user = require('./routes/incidenciesEJS_user.routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connectar a MongoDB
connectMongoDB();

// Aplicar el middleware de logs a totes les peticions
app.use(logger);

/////
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

// Ruta d'inici
app.get('/', async (req, res) => {
  res.render('index');
});

// Rutes per a l'administració de logs
app.get('/admin/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Log.countDocuments();

    res.render('admin/logs', {
      logs,
      currentPage: page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar els logs' });
  }
});

app.get('/admin/logs/stats', async (req, res) => {
  try {
    // Obtenir número de visites dels últims 7 dies
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const dailyStats = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Pàgines més visitades
    const topPages = await Log.aggregate([
      {
        $group: {
          _id: "$url",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.render('admin/stats', {
      dailyStats,
      topPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar les estadístiques' });
  }
});

//

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
        tecnic_id: 1,
        id_tipus: 1,
        descripcio: 'Problema con el monitor',
        prioridad: 'Alta',
        estat: 'Abierta',
      });  

    await Actuacio.create({
        id_incidencia: 1,
        tecnic_id: 1,
        data_actuacio: new Date(),
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

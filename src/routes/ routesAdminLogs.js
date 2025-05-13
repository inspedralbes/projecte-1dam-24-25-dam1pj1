 // A routes/admin/logs.js
const express = require('express');
const router = express.Router();
const Log = require('../../models/Log');

// Obtenir tots els logs (amb paginació)
router.get('/', async (req, res) => {
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

// Estadístiques d'accés
router.get('/stats', async (req, res) => {
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

    // Navegadors més utilitzats
    const browsers = await Log.aggregate([
      {
        $group: {
          _id: "$userAgent",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.render('admin/stats', {
      dailyStats,
      topPages,
      browsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar les estadístiques' });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:12345@projectedam.wacrgux.mongodb.net/?retryWrites=true&w=majority&appName=ProjecteDAM', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('🔥 Mongo conectado como un loco 🔗');
  } catch (err) {
    console.error('💥 Error conectando MongoDB:', err);
  }
};

module.exports = connectMongo;

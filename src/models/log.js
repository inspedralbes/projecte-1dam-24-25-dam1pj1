
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Log', LogSchema);
const mongoose = require('mongoose');

const BusinessHours = new mongoose.Schema({
  professionista: { type: String, ref: 'Professional' },
  lunedi: [String],
  martedi: [String],
  mercoledi: [String],
  giovedi: [String],
  venerdi: [String],
  sabato: [String],
  domenica: [String]
});

module.exports = mongoose.model('BusinessHours', BusinessHours);
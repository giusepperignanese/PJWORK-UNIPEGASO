const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  reservation_id: { type: String, required: true, unique: true },
  professionista_id: { type: String, required: true, ref: 'User' },
  professionista_nome: { type: String, required: true },
  slot_id: { type: String, ref: 'TimeSlot' },
  customer_info: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  status: {
    type: String,
    enum: ['payed', 'to_pay', 'cancelled'],
    default: 'to_pay',
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
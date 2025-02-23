// src/controllers/Routes.js
const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');
const userService = require('../services/userService');

// {
//   "monday": ["09:00-10:00", "11:00-12:00"],
//   "tuesday": ["09:00-10:00"],
// }
router.get('/disponibilita/:professionista_id', (req, res) => {
  reservationService.getDisponibilita(req, res);
});

// professionista da la disponibilità per la settimana
router.post('/disponibilita/:professionista_id', (req, res) => {
  console.log('Request Body:', req.body);
  reservationService.updateAvailability(req, res);
});

// Endpoint per creare una nuova prenotazione
router.post('/reservations', (req, res) => {
  reservationService.createReservation(req, res);
});

// {
// ["Mario Rossi", "Luca Verdi"]
// },
router.get('/professionista', (req, res) => {
  reservationService.getProfessionisti(res, req);
});


router.get('/professionista/:professionista_id/reservations', reservationService.getReservationsByProfessionista);

// Route per il cliente
router.get('/cliente/:email/reservations', reservationService.getReservationsByCustomer);
router.get('/users', userService.getAllUsers);

router.post('/pagamento/:id', reservationService.updatePaymentStatus);



module.exports = router;
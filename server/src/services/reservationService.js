const mongoose = require('mongoose');
const Reservation = require('../database/models/Reservation'); // Schema delle prenotazioni
const BusinessHours = require('../database/models/BusinessHours'); // Schema degli orari di lavoro
const User = require('../database/models/User');

// Funzione per ottenere l'elenco dei professionisti
async function getProfessionisti(res, req) {
  try {
    console.log('getProfessionisti');
    const professionisti = await User.find({ role: 'professional' }, 'profile.firstName profile.lastName _id');
    console.log(professionisti);
    res.status(200).json(professionisti);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante il caricamento dei professionisti.' });
  }
}

// Funzione per ottenere la disponibilità di un professionista
async function getDisponibilita(req, res) {
  const { professionista_id } = req.params;

  if (!professionista_id) {
    return res.status(400).json({ message: 'Parametro professionista_id mancante.' });
  }

  try {
    console.log('ID ricevuto:', professionista_id);

    // Converte professionista_id in ObjectId
    let professionistaObjectId;
    try {
      professionistaObjectId = new mongoose.Types.ObjectId(professionista_id);
      console.log('ObjectId generato:', professionistaObjectId);
    } catch (error) {
      console.error('Errore durante la conversione dell\'ID:', error.message);
      return res.status(400).json({ message: 'ID del professionista non valido.' });
    }

    // Cerca la disponibilità del professionista
    const businessHours = await BusinessHours.findOne({ professionista: professionistaObjectId });
    console.log('Risultato della query:', businessHours);

    if (!businessHours) {
      return res.status(404).json({ message: 'Nessuna disponibilità trovata per questo professionista.' });
    }

    // Recupera le prenotazioni esistenti per il professionista
    const existingReservations = await Reservation.find({ professionista_id: professionistaObjectId });
    const bookedSlots = existingReservations.map(reservation => reservation.slot_id);

    // Filtra gli slot disponibili escludendo quelli già prenotati
    const disponibilita = {};
    for (const [day, slots] of Object.entries(businessHours.toObject())) {
      if (Array.isArray(slots)) {
        disponibilita[day] = slots.filter(slot => !bookedSlots.includes(`${day} ${slot}`));
      }
    }

    res.status(200).json(disponibilita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante il caricamento della disponibilità.' });
  }
}
async function updateAvailability(req, res) {
  const { professionista_id } = req.params;
  const { availability } = req.body;

  try {
    console.log('Request Body:', req.body); // Log del corpo della richiesta
    console.log('Professionista ID:', professionista_id); // Log dell'ID del professionista

    // Converte professionista_id in ObjectId
    const professionistaObjectId = new mongoose.Types.ObjectId(professionista_id);
    console.log('Professionista Object ID:', professionistaObjectId);

    // Verifica che il professionista esista e abbia il ruolo "professional"
    const professionista = await User.findById(professionistaObjectId);
    console.log('Professionista trovato:', professionista);

    if (!professionista || professionista.role !== 'professional') {
      return res.status(400).json({ message: 'Professionista non valido.' });
    }

    // Verifica che availability sia definito
    if (!availability) {
      return res.status(400).json({ message: 'Il campo "disponibilità" è obbligatorio.' });
    }

    // Cerca se esiste già un record di disponibilità per il professionista
    let businessHours = await BusinessHours.findOne({ professionista: professionistaObjectId });
    console.log('BusinessHours trovato:', businessHours);

    if (!businessHours) {
      // Se non esiste, crea un nuovo record
      businessHours = new BusinessHours({
        professionista: professionistaObjectId,
        ...availability
      });
    } else {
      // Usa il metodo set per aggiornare i campi
      businessHours.set({
        monday: availability.monday || [],
        tuesday: availability.tuesday || [],
        wednesday: availability.wednesday || [],
        thursday: availability.thursday || [],
        friday: availability.friday || [],
        saturday: availability.saturday || [],
        sunday: availability.sunday || []
      });
    }

    console.log('BusinessHours prima del salvataggio:', businessHours);

    // Salva le modifiche nel database
    await businessHours.save();

    res.status(200).json({ message: 'Disponibilità aggiornata con successo.', businessHours });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della disponibilità:', error); // Log dell'errore
    res.status(500).json({ message: 'Errore durante l\'aggiornamento della disponibilità.' });
  }
}

// Funzione per creare una nuova prenotazione considerando gli orari del professionista
async function createReservation(req, res) {
  const { professionista_id, professionista_nome, slot, user } = req.body;

  try {
    // Verifica che il professionista esista
    const professionista = await User.findById(professionista_id);
    if (!professionista || professionista.role !== 'professional') {
      return res.status(400).json({ message: 'Professionista non valido.' });
    }

    // Verifica che lo slot sia disponibile
    const businessHours = await BusinessHours.findOne({ professionista: professionista_id });
    if (!businessHours) {
      return res.status(400).json({ message: 'Nessuna disponibilità trovata per questo professionista.' });
    }

    const [day, timeRange] = slot.split(' ');
    const slotsForDay = businessHours[day];
    if (!slotsForDay || !slotsForDay.includes(timeRange)) {
      return res.status(400).json({ message: 'Slot orario non disponibile.' });
    }

    // Verifica se lo slot è già prenotato
    const existingReservation = await Reservation.findOne({
      professionista_id: professionista_id,
      slot_id: slot,
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Slot già prenotato da un altro utente.' });
    }

    // Crea la prenotazione
    const newReservation = new Reservation({
      reservation_id: new mongoose.Types.ObjectId().toString(),
      professionista_id: professionista_id, // Agg
      professionista_nome: professionista_nome, // mette il mnme del professionista
      slot_id: slot,
      customer_info: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone
      },
      status: 'to_pay', // stato standard
      created_at: new Date()
    });

    await newReservation.save();

    res.status(201).json({ message: 'Prenotazione effettuata con successo.', reservation: newReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante la creazione della prenotazione.' });
  }
}
async function getReservationsByProfessionista(req, res) {
  const { professionista_id } = req.params;

  try {
    // Cerca tutte le prenotazioni associate al professionista
    const reservations = await Reservation.find({ professionista_id });

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: 'Nessuna prenotazione trovata per questo professionista.' });
    }

    res.status(200).json({ message: 'Prenotazioni recuperate con successo.', reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante il recupero delle prenotazioni.' });
  }
}
async function getReservationsByCustomer(req, res) {
  const { email } = req.params;

  try {
    // Cerca tutte le prenotazioni associate all'email del cliente
    const reservations = await Reservation.find({ 'customer_info.email': email });

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: 'Nessuna prenotazione trovata per questo cliente.' });
    }

    res.status(200).json({ message: 'Prenotazioni recuperate con successo.', reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante il recupero delle prenotazioni.' });
  }
}
async function updatePaymentStatus(req, res) {
  const { id } = req.params; // ID della prenotazione

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Prenotazione non trovata.' });
    }

    //  prende tutti i  "to_pay"
    if (reservation.status !== 'to_pay') {
      return res.status(400).json({ message: 'La prenotazione è già stata pagata o non è valida per il pagamento.' });
    }

    // aggiornato to "payed"
    reservation.status = 'payed';
    await reservation.save();

    res.status(200).json({ message: 'Pagamento effettuato con successo.', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dello stato del pagamento.' });
  }
}
module.exports = {
  updatePaymentStatus,
  getReservationsByCustomer,
  getReservationsByProfessionista,
  getProfessionisti,
  updateAvailability,
  getDisponibilita,
  createReservation
};
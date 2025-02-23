const User = require('../database/models/User');

// Endpoint: GET /api/users
async function getAllUsers(req, res) {
  try {
    // Recupera tutti gli utenti dal database
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Nessun utente trovato.' });
    }

    res.status(200).json({ message: 'Lista utenti recuperata con successo.', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante il recupero della lista degli utenti.' });
  }
}

module.exports = {
  getAllUsers
};
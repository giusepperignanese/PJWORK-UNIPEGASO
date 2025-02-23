const mongoose = require('mongoose');



// Funzione per inizializzare gli obiettivi (schemi e dati iniziali)
async function initObiettivi() {
  try {
    // Creazione degli schemi (se non esistono già)
    const User = require(`./models/User`);
    const usersToCreate = [
      {
        email: 'cliente1@example.com',
        password: 'password123',
        role: 'customer',
        profile: { firstName: 'Mario', lastName: 'Rossi', phone: '333-1234567' }
      },
      {
        email: 'cliente2@example.com',
        password: 'password456',
        role: 'customer',
        profile: { firstName: 'Laura', lastName: 'Bianchi', phone: '333-9876543' }
      },
      {
        email: 'professionista1@example.com',
        password: 'password789',
        role: 'professional',
        profile: { firstName: 'Giovanni', lastName: 'Verdi', phone: '333-1112233' }
      }
    ];

    for (const userData of usersToCreate) {
      const userExists = await User.findOne({ email: userData.email }); //Controlla se esiste
      if (!userExists) {
        await User.create(userData);
        console.log(`Utente ${userData.email} creato.`);
      } else {
        console.log(`Utente ${userData.email} esiste già, saltato.`);
      }
    }
    console.log("Creazione utenti fittizi completata (o saltati se esistenti).");

    console.log('Dati iniziali inseriti con successo.');
  } catch (err) {
    console.error("Errore durante l'inizializzazione degli obiettivi:", err);
    throw err;
  }
}



async function initializeDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27019/PJ', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const expectedCollections = ['users', 'reservations', , 'businesshours'];
    const allCollectionsExist = expectedCollections.every(collectionName =>
      collections.some(c => c.name === collectionName)
    );


    if (allCollectionsExist) {
      console.log('Il database è già stato inizializzato completamente. Nessuna azione necessaria.');
      return;
    }
    console.log("Database non completamente inizializzato o mancante di collezioni.  Inizializzazione in corso...");

    await initObiettivi();

    console.log('Inizializzazione del database completata.');
  } catch (error) {
    console.error("Errore durante l'inizializzazione del database:", error);
    throw error;
  }
}


module.exports = initializeDatabase;
const mongoose = require('mongoose');
const initializeDatabase = require('./initMongoDb');

const url = process.env.MONGO_URI || 'mongodb://localhost:27019/PJ';


async function connectToDatabase(retries = 3, delay = 60000) {
  try {
    // Controlla se Mongoose è già connesso
    if (mongoose.connection.readyState === 1) {
      console.log('Già connesso a MongoDB');
      return mongoose.connection;
    }

    console.log(`Tentativo di connessione a MongoDB: `);
    console.log(`${url}`);
    await mongoose.connect(url, {});

    console.log('Connessione a MongoDB riuscita');
    await initializeDatabase(mongoose.connection);

    return mongoose.connection;
  } catch (error) {
    console.error('Errore di connessione a MongoDB:', error.message);

    if (retries > 0) {
      console.log(`Riprovo la connessione in ${delay / 1000} secondi... (${retries - 1} tentativi rimasti)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectToDatabase(retries - 1, delay);
    } else {
      console.error('Numero massimo di tentativi di connessione raggiunto');
      return null;
    }
  }
}

module.exports = {
  connectToDatabase
};

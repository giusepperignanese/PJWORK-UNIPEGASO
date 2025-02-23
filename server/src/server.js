const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const app = express();
const { connectToDatabase } = require('../src/database/mongodbconfig');


const Routes = require('../src/controllers/Routes');
const Auth = require('../src/controllers/authController');

var bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Carica il file .env
dotenv.config({ path: './server.env' });
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json()); // Use express.json() directly.  No need for body-parser anymore
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// --- Route Handling ---
app.use('/auth', Auth);     // Use the Auth router,  prefix with /auth
app.use('/api', Routes);    // Use the Routes router, prefix with /api.  This is a good practice.




// Gestisci le rotte non trovate
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API non trovata. Controlla l'URL o verifica che l'endpoint sia corretto."
  });
});

// Connetti al database MongoDB
connectToDatabase();

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

// Gestisci la chiusura del pool di connessioni al database
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Pool di connessioni al database chiuso.');
    process.exit(0);
  } catch (err) {
    console.error(
      'Errore durante la chiusura del pool di connessioni al database:',
      err
    );
    process.exit(1);
  }
});

module.exports = app;
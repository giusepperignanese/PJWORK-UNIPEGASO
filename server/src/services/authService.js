const User = require('../database/models/User');

const authService = {
  async register(req, res) {
    try {
      const { email, password, role, ...profile } = req.body;

      // Verifica se l'utente esiste già
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email già registrata' });
      }

      // Crea un nuovo utente (senza hash della password)
      const newUser = new User({
        email,
        password, // Password in chiaro
        role,
        profile
      });

      await newUser.save();

      // Restituisci i dati dell'utente
      res.status(200).json({
        success: true,
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Errore durante la registrazione: ${error.message}`
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenziali non valide' });
      }
      if (password !== user.password) {
        return res.status(401).json({ message: 'Credenziali non valide' });
      }
      console.log("user", user);
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Errore durante il login: ${error.message}`
      });
    }
  }

};
module.exports = authService;
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', (req, res) => {
  authService.login(req, res);
});

router.post('/register', (req, res) => {
  console.log('prova registrazione');
  authService.register(req, res);
});

module.exports = router;
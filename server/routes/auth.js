const router = require('express').Router();
const jwt = require('jsonwebtoken');

const strip = (val, fallback) => (val || fallback).replace(/^["']|["']$/g, '').trim();
const ADMIN_USERNAME = strip(process.env.ADMIN_USERNAME, 'admin');
const ADMIN_PASSWORD = strip(process.env.ADMIN_PASSWORD, 'Afrilens2026');
const JWT_SECRET = strip(process.env.JWT_SECRET, 'afrilens_fallback_secret');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = (username || '').trim();
  const pass = (password || '').trim();

  if (user === ADMIN_USERNAME.trim() && pass === ADMIN_PASSWORD.trim()) {
    const token = jwt.sign({ role: 'admin', username: user }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;

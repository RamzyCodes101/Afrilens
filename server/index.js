require('dotenv').config();
const express = require('express');
const { init } = require('./db');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temp debug — remove after login works
app.post('/api/test', (req, res) => {
  res.json({
    body: req.body,
    contentType: req.headers['content-type'],
    adminUser: process.env.ADMIN_USERNAME || '(not set)',
    adminPassLen: (process.env.ADMIN_PASSWORD || '').length,
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/images', require('./routes/images'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

init()
  .then(() => console.log('Database ready'))
  .catch((err) => console.error('DB init error (non-fatal):', err.message));

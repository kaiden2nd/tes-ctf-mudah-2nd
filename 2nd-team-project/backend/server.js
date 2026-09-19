require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'messages.json');

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// Pastikan file penyimpanan pesan ada
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function readMessages() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

// Validasi sederhana
function validateContact(body) {
  const errors = [];
  const { name, email, message } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Nama minimal 2 karakter.');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Format email tidak valid.');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push('Pesan minimal 5 karakter.');
  }
  return errors;
}

// Rate limiting yang lebih kuat (pakai library, bukan bikin sendiri)
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5, // maksimal 5 pesan per menit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Terlalu banyak permintaan, coba lagi sebentar.' },
});

// Middleware: cek token admin sebelum boleh baca pesan masuk
function checkAdminToken(req, res, next) {
  const authHeader = req.headers.authorization; // format: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ ok: false, error: 'ADMIN_TOKEN belum diatur di server (.env).' });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Token tidak valid atau tidak ada.' });
  }
  next();
}

// POST /api/contact - terima pesan dari form kontak
app.post('/api/contact', contactLimiter, (req, res) => {
  const errors = validateContact(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join(' ') });
  }

  const { name, email, message } = req.body;
  const messages = readMessages();

  // Bersihkan input dari karakter berbahaya sebelum disimpan
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: validator.escape(name.trim()),
    email: validator.normalizeEmail(email.trim()) || email.trim(),
    message: validator.escape(message.trim()),
    createdAt: new Date().toISOString(),
    ip: req.ip,
  };

  messages.push(entry);
  saveMessages(messages);

  res.status(201).json({ ok: true, message: 'Pesan diterima.' });
});

// GET /api/messages - lihat semua pesan masuk (dilindungi token admin)
app.get('/api/messages', checkAdminToken, (req, res) => {
  const messages = readMessages();
  res.json({ ok: true, count: messages.length, data: messages });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Backend jalan di http://localhost:${PORT}`);
});

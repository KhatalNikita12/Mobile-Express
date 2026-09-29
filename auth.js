// auth.js — simple admin login (password lives only on the server, in env vars)
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const TOKEN_HOURS = 8;

const secret = () => process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('hex');

// constant-time string compare (hashes first so length differences don't leak)
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const makeToken = () => {
  const exp = String(Date.now() + TOKEN_HOURS * 3600 * 1000);
  return `${exp}.${sign(exp)}`;
};

const verifyToken = (token) => {
  if (!token || !secret()) return false;
  const [exp, sig] = String(token).split('.');
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
};

const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

router.post('/login', (req, res) => {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server.' });
  }

  const { username = '', password = '' } = req.body || {};
  const ok = safeEqual(username, expectedUser) & safeEqual(password, expectedPass);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password.' });

  res.json({ token: makeToken() });
});

router.get('/verify', (req, res) => {
  if (verifyToken(bearer(req))) return res.json({ valid: true });
  res.status(401).json({ valid: false });
});

module.exports = router;
module.exports.verifyToken = verifyToken; // reuse later to protect write routes

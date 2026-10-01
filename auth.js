// auth.js — admin login. Only needs ADMIN_USERNAME + ADMIN_PASSWORD (no ADMIN_TOKEN_SECRET).
// The login token is signed with a key derived from the password, so changing the
// password automatically logs everyone out.
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const TOKEN_HOURS = 8;

const adminUser = () => process.env.ADMIN_USERNAME;
const adminPass = () => process.env.ADMIN_PASSWORD ;

const signingKey = () =>
  crypto.createHash('sha256').update(`mx-admin:${adminUser()}:${adminPass()}`).digest();
const sign = (payload) => crypto.createHmac('sha256', signingKey()).update(payload).digest('hex');

// constant-time compare (hashes first so length differences don't leak)
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
  if (!token || !adminPass()) return false;
  const [exp, sig] = String(token).split('.');
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
};

const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

router.post('/login', (req, res) => {
  if (!adminPass()) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server.' });
  }
  const { username = '', password = '' } = req.body || {};
  const userOk = safeEqual(username, adminUser());
  const passOk = safeEqual(password, adminPass());
  if (!(userOk && passOk)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  res.json({ token: makeToken() });
});

router.get('/verify', (req, res) => {
  if (verifyToken(bearer(req))) return res.json({ valid: true });
  res.status(401).json({ valid: false });
});

// Middleware: anyone can READ (GET), but add/edit/delete needs a valid admin token.
const protectWrites = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.path.startsWith('/auth')) return next(); // login itself must stay open
  if (verifyToken(bearer(req))) return next();
  res.status(401).json({ error: 'Admin login required.' });
};

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.protectWrites = protectWrites;
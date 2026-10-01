// app.js — the Express app, shared by local dev (server.js) and Netlify (netlify/functions/api.js)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./product');
const serviceRoutes = require('./services');
const categoryRoutes = require('./categories');
const brandRoutes = require('./brands');
const offersRoutes = require('./offers');
const aboutGalleryRoutes = require('./aboutGallery');
const authRoutes = require('./auth');

const app = express();

app.use(cors());              // same-origin in production; permissive is fine for local dev
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

const api = express.Router();
api.use(authRoutes.protectWrites);   // writes (POST/PUT/DELETE) need admin login
api.use('/products', productRoutes);
api.use('/services', serviceRoutes);
api.use('/categories', categoryRoutes);
api.use('/about-gallery', aboutGalleryRoutes);
api.use('/brands', brandRoutes);
api.use('/offers', offersRoutes);
api.use('/auth', authRoutes);
api.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    env: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SECRET_KEY: !!process.env.SUPABASE_SECRET_KEY,
    },
  })
);

// Local dev / direct calls:        /api/...
// Netlify (after the redirect):    /.netlify/functions/api/...
app.use('/api', api);
app.use('/.netlify/functions/api', api);
// Fallback: also answer without the /api prefix (e.g. REACT_APP_API_URL=http://localhost:5000)
app.use('/', api);

module.exports = app;
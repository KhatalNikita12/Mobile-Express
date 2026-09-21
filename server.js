require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./product');
const serviceRoutes = require('./services');
const categoryRoutes = require('./categories');
const brandRoutes = require('./brands');
const offersRoutes = require('./offers');
const app = express();
const PORT = process.env.SERVER_PORT || 5000;



app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Set Cross-Origin Resource Policy (CORP) header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  console.log(`📡 [SERVER RECEIVED]: ${req.method} ${req.url}`);
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/offers', offersRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Mobile Xpress API running on http://localhost:${PORT}`);
});
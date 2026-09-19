require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./product');
const serviceRoutes = require('./services');
const categoryRoutes = require('./categories');
const brandRoutes = require('./brands');
const app = express();
const PORT = process.env.SERVER_PORT || 5000;



app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'], // Add your frontend ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Mobile Xpress API running on http://localhost:${PORT}`);
});
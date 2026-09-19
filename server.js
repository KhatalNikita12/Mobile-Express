require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./product');
const serviceRoutes = require('./services');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Mobile Xpress API running on http://localhost:${PORT}`);
});
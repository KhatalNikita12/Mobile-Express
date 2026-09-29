// server.js — LOCAL development only (Netlify uses netlify/functions/api.js instead)
const app = require('./app');

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mobile Xpress API running on http://localhost:${PORT}`);
});

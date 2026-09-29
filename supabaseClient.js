const { createClient } = require('@supabase/supabase-js');
const ws = require('ws'); // explicit WebSocket so this also works on Node < 22 (e.g. Netlify Functions)

let client = null;

function getClient() {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  // Use the secret key on your server side
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Thrown lazily (on first use) so the function doesn't crash on load (which shows as a 502).
    // Inside a route's try/catch this becomes a readable 500 JSON error instead.
    throw new Error(
      'Missing Supabase env vars: set SUPABASE_URL and SUPABASE_SECRET_KEY in Netlify (Site configuration > Environment variables), then redeploy.'
    );
  }

  client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws },
  });
  return client;
}

// Same import style as before: `const supabase = require('./supabaseClient')`
module.exports = new Proxy({}, {
  get(_target, prop) {
    const c = getClient();
    const value = c[prop];
    return typeof value === 'function' ? value.bind(c) : value;
  },
});

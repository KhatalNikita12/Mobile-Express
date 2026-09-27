const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');

// Logger middleware
router.use((req, res, next) => {
  console.log(`📦 [Offers ROUTER HIT]: ${req.method} path: ${req.path}`);
  next();
});

// NOTE: we deliberately do NOT use Supabase/PostgREST's relational embedding
// here (e.g. select('*, categories(name), brands(name), products(name)')).
// That syntax only works once PostgREST has cached real foreign-key
// constraints for category_id/brand_id/product_id, and until that schema
// cache is set up correctly it fails with a 500 on every request — including
// plain GETs. category_id / brand_id / product_id are still stored and
// returned as plain numeric IDs; the frontend (OffersTable.jsx) already
// resolves them to names locally using the categories/brands/products it
// has loaded, so no join is required here.

// Normalize + validate the offer payload coming from the admin form.
// Returns { data, error } — data is the clean row to insert/update,
// error is a user-facing message if something required is missing/invalid.
function buildOfferPayload(body = {}) {
  // category_id / brand_id / product_id are UUIDs in this schema
  // (e.g. "3fa85f64-5717-4562-b3fc-2c963f66afa6"), NOT numbers — running a
  // UUID through Number() gives NaN, which was silently turning every valid
  // selection into null and failing validation below. Just keep it as a
  // trimmed string.
  const toId = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const str = String(val).trim();
    return str.length > 0 ? str : null;
  };
  const toNumber = (val, fallback = 0) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  const category_id = toId(body.category_id);
  const brand_id = toId(body.brand_id);
  const product_id = toId(body.product_id);
  const original_price = toNumber(body.original_price, null);
  const discount_percentage = toNumber(body.discount_percentage, 0);
  const offer_price = toNumber(body.offer_price, null);
  const valid_until = body.valid_until || null;
  const is_active = body.is_active === undefined ? true : Boolean(body.is_active);

  if (!product_id) return { error: 'A valid product_id is required.' };
  if (!category_id) return { error: 'A valid category_id is required.' };
  if (original_price === null || original_price < 0) return { error: 'A valid original_price is required.' };
  if (offer_price === null || offer_price < 0) return { error: 'A valid offer_price is required.' };
  if (!valid_until) return { error: 'valid_until (offer end date) is required.' };

  return {
    data: {
      category_id,
      brand_id,
      product_id,
      original_price,
      discount_percentage,
      offer_price,
      valid_until,
      is_active
    }
  };
}

// Logs the full Supabase error (message/details/hint/code) so problems like
// a missing column or missing table show up clearly in the server console,
// instead of just a bare "500"/"400" in the browser with no explanation.
function logSupabaseError(label, err) {
  console.error(`❌ [Offers] ${label}:`, {
    message: err?.message,
    details: err?.details,
    hint: err?.hint,
    code: err?.code,
  });
}

// If the `offers` table hasn't had supabase_offers.sql run against it yet
// (e.g. brand_id or is_active don't exist as columns), PostgREST rejects the
// insert/update with a 400 "Could not find the 'X' column of 'offers' in the
// schema cache" error. Rather than hard-failing the whole request, detect
// that specific error, drop the offending field, and retry — so offers can
// still be saved (without that field) while you get the migration run.
const MISSING_COLUMN_RE = /Could not find the '([^']+)' column/i;

async function insertOrUpdateWithFallback({ mode, id, payload }) {
  let attempt = { ...payload };

  for (let tries = 0; tries < Object.keys(payload).length + 1; tries++) {
    const query = mode === 'insert'
      ? supabase.from('offers').insert([attempt]).select('*').single()
      : supabase.from('offers').update(attempt).eq('id', id).select('*').single();

    const { data, error } = await query;
    if (!error) return { data };

    const match = MISSING_COLUMN_RE.exec(error.message || '');
    if (match && Object.prototype.hasOwnProperty.call(attempt, match[1])) {
      console.warn(
        `⚠️  [Offers] Column '${match[1]}' does not exist on the offers table yet — ` +
        `saving without it for now. Run supabase_offers.sql in Supabase to add it permanently.`
      );
      delete attempt[match[1]];
      continue;
    }

    return { error };
  }

  return { error: new Error('Unable to save offer after removing unrecognized columns.') };
}

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    logSupabaseError('GET / failed', err);
    res.status(500).json({ error: err.message, details: err.details, hint: err.hint });
  }
});

// Create new offer — category_id / brand_id / product_id are saved as IDs
router.post('/', async (req, res) => {
  try {
    const { data: payload, error: validationError } = buildOfferPayload(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { data, error } = await insertOrUpdateWithFallback({ mode: 'insert', payload });

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    logSupabaseError('POST / failed', err);
    res.status(500).json({ error: err.message, details: err.details, hint: err.hint });
  }
});

// Update offer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: payload, error: validationError } = buildOfferPayload(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const updateData = {
      ...payload,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await insertOrUpdateWithFallback({ mode: 'update', id, payload: updateData });

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Offer ID not found' });

    res.json(data);
  } catch (err) {
    logSupabaseError(`PUT /${req.params.id} failed`, err);
    res.status(500).json({ error: err.message, details: err.details, hint: err.hint });
  }
});

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    logSupabaseError(`DELETE /${req.params.id} failed`, err);
    res.status(500).json({ error: err.message, details: err.details, hint: err.hint });
  }
});

module.exports = router;

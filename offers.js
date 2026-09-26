const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');
const app = express();
// Logger middleware
router.use((req, res, next) => {
  console.log(`📦 [Offers ROUTER HIT]: ${req.method} path: ${req.path}`);
  next();
});

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('offers').select('*').order('id', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Required to parse JSON payloads into req.body
app.use(express.json()); 

router.post('/', async (req, res) => {
  try {
    const {
      category_id,
      product_id,
      brand_id,
      original_price,
      discount_percentage,
      offer_price,
      valid_until,
      is_active = true
    } = req.body;

    const cleanUuid = (val) => {
      if (!val || val === 'undefined' || val === 'null' || String(val).trim() === '') return null;
      return String(val).trim();
    };

    const payload = {
      category_id: cleanUuid(category_id),
      product_id: cleanUuid(product_id),
      brand_id: cleanUuid(brand_id),
      original_price: original_price !== null && original_price !== '' ? Number(original_price) : null,
      discount_percentage: discount_percentage !== '' ? Number(discount_percentage) : 0,
      offer_price: offer_price !== null && offer_price !== '' ? Number(offer_price) : null,
      valid_until: valid_until || null,
      is_active
    };

    const { data, error } = await supabase
      .from('offers')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating offer:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// Update offer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Offer ID not found' });

    res.json(data);
  } catch (err) {
    console.error('Error updating offer:', err.message);
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
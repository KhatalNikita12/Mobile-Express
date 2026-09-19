const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');

// Get all brands (with category details if needed)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*, categories(name)');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create brand linked to a category
router.post('/', async (req, res) => {
  try {
    const { name, category_id } = req.body;
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name: name.trim(), category_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete brand
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
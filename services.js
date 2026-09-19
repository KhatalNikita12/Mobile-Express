const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');

// Get all services
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a service
router.post('/', async (req, res) => {
  try {
    const { category, name, description, price } = req.body;
    const { data, error } = await supabase
      .from('services')
      .insert([{ category, name, description, price }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, description, price } = req.body;
    const { data, error } = await supabase
      .from('services')
      .update({ category, name, description, price })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
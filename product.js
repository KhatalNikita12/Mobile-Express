const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory temporarily
const supabase = require('./supabaseClient');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product with uploaded image files
router.post('/', upload.array('imageFiles', 5), async (req, res) => {
  try {
    const { category, name, brand, price, specs } = req.body;
    let imageUrls = [];

    // Upload files to Supabase Storage bucket
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: publicURLData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        imageUrls.push(publicURLData.publicUrl);
      }
    }

    // Insert product record into database with image URLs
    const { data, error } = await supabase
      .from('products')
      .insert([{ category, name, brand, price, specs, images: imageUrls }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
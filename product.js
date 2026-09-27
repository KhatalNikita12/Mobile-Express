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

// Get one product along with its currently active offer, if any
router.get('/:id/with-offer', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) throw productError;
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const today = new Date().toISOString().split('T')[0];

    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('product_id', id)
      .gte('valid_until', today) // only offers still valid today or later
      .order('valid_until', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (offerError) throw offerError;

    res.json({ ...product, activeOffer: offer || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update the product data
// Update product (with optional new image files)
router.put('/:id', upload.array('imageFiles', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, brand, price, specs } = req.body;
    
    // Build update object
    const updateData = { category, name, brand, price, specs };

    // If new image files are uploaded, process and add them
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        imageUrls.push(publicURLData.publicUrl);
      }
      updateData.images = imageUrls; // Update images array if new files are provided
    }

    // Update record in Supabase
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Product not found in database' });

    res.json(data);
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
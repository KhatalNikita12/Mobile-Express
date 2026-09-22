const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Stores file in memory temporarily
const supabase = require('./supabaseClient');

// GET: Fetch gallery items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('about_gallery').select('*');
    if (error) throw error;
    res.status(200).json({ success: true, data: data || [] });
  } catch (err) {
    console.error("GET Gallery Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Add gallery item with file upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    // 1. Generate a unique file name
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

    // 2. Upload file to Supabase Storage bucket 'product-images'
    const { error: storageError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) throw storageError;

    // 3. Get the Public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Insert record into 'about_gallery' table
    // 💡 Wrapped in brackets [publicUrl] to match Supabase's text[] array column type
    const { error: dbError } = await supabase
      .from('about_gallery')
      .insert([{ 
        title: title || 'Store Snapshot', 
        description: description || '', 
        images: [publicUrl] 
      }]);

    if (dbError) throw dbError;

    // 5. Fetch updated list to return to frontend
    const { data: updatedList, error: fetchError } = await supabase.from('about_gallery').select('*');
    if (fetchError) throw fetchError;

    res.status(200).json({ 
      success: true, 
      message: 'Gallery item and image uploaded successfully!', 
      data: updatedList 
    });

  } catch (err) {
    console.error("🔥 BACKEND GALLERY POST CRASH:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT: Update gallery item (title/description, optional new image)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

      const { error: storageError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      updateData.images = [publicUrlData.publicUrl];
    }

    const { error: dbError } = await supabase
      .from('about_gallery')
      .update(updateData)
      .eq('id', id);

    if (dbError) throw dbError;

    const { data: updatedList, error: fetchError } = await supabase.from('about_gallery').select('*');
    if (fetchError) throw fetchError;

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully!',
      data: updatedList
    });
  } catch (err) {
    console.error('PUT Gallery Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Remove gallery item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('about_gallery').delete().eq('id', id);
    if (error) throw error;
    
    res.status(200).json({ success: true, message: 'Gallery item deleted successfully.' });
  } catch (err) {
    console.error("DELETE Gallery Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
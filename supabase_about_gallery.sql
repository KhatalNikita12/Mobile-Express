-- About Us Gallery — Supabase table
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- This project stores its data in Supabase (see supabaseClient.js), not the
-- local schema.sql, so the "About Us" gallery table must be created here.

CREATE TABLE IF NOT EXISTS about_gallery (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',   -- array of public image URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keep updated_at current on every edit
CREATE OR REPLACE FUNCTION set_about_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_about_gallery_updated_at ON about_gallery;
CREATE TRIGGER trg_about_gallery_updated_at
BEFORE UPDATE ON about_gallery
FOR EACH ROW EXECUTE FUNCTION set_about_gallery_updated_at();

-- ---------------------------------------------------------------------
-- Storage: images are uploaded by the backend (aboutGallery.js) into the
-- same "product-images" bucket already used for product photos.
-- If that bucket doesn't exist yet:
--   Supabase Dashboard → Storage → New bucket → name: product-images → Public bucket: ON
-- ---------------------------------------------------------------------

-- Optional: Row Level Security. The backend uses the Supabase SECRET key
-- (service role), which bypasses RLS, so this is only needed if you also
-- want to allow direct anon/public reads of the table via the client SDK.
-- ALTER TABLE about_gallery ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public can read gallery" ON about_gallery
--   FOR SELECT USING (true);

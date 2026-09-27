-- Offers table — Supabase table (UUID primary/foreign keys)
-- This matches the table you already have. Run this in the Supabase SQL
-- editor (Project → SQL Editor → New query) — it's safe to re-run, every
-- statement is idempotent.
--
-- IMPORTANT: category_id, brand_id and product_id are UUIDs (foreign keys
-- into categories / brands / products), never plain text names. The admin
-- dropdowns send the selected row's id (a UUID string), and the backend
-- (offers.js) stores/returns that id as-is — it never runs it through
-- Number(), which would corrupt a UUID into NaN.

create extension if not exists "uuid-ossp" with schema extensions;

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  category_id UUID NULL,
  brand_id UUID NULL,
  product_id UUID NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  discount_percentage NUMERIC(5, 2) NULL DEFAULT 0,
  offer_price NUMERIC(10, 2) NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Optional but recommended: real foreign keys so the ids can't point at rows
-- that don't exist. Only useful if categories/brands/products all use a UUID
-- `id` column (the Supabase default). Wrapped so re-running this script, or
-- running it when a constraint/type mismatch already exists, doesn't error.
DO $$
BEGIN
  ALTER TABLE public.offers
    ADD CONSTRAINT offers_category_id_fkey FOREIGN KEY (category_id)
      REFERENCES public.categories (id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
          WHEN others THEN RAISE NOTICE 'Skipped offers_category_id_fkey: %', SQLERRM;
END $$;

DO $$
BEGIN
  ALTER TABLE public.offers
    ADD CONSTRAINT offers_brand_id_fkey FOREIGN KEY (brand_id)
      REFERENCES public.brands (id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
          WHEN others THEN RAISE NOTICE 'Skipped offers_brand_id_fkey: %', SQLERRM;
END $$;

DO $$
BEGIN
  ALTER TABLE public.offers
    ADD CONSTRAINT offers_product_id_fkey FOREIGN KEY (product_id)
      REFERENCES public.products (id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
          WHEN others THEN RAISE NOTICE 'Skipped offers_product_id_fkey: %', SQLERRM;
END $$;

-- Helpful indexes for the lookups the app does (by product, and "still valid" queries)
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON public.offers (product_id);
CREATE INDEX IF NOT EXISTS idx_offers_category_id ON public.offers (category_id);
CREATE INDEX IF NOT EXISTS idx_offers_brand_id ON public.offers (brand_id);
CREATE INDEX IF NOT EXISTS idx_offers_valid_until ON public.offers (valid_until);

-- Keep updated_at current on every edit
CREATE OR REPLACE FUNCTION set_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION set_offers_updated_at();

-- Optional: Row Level Security. The backend uses the Supabase SECRET key
-- (service role), which bypasses RLS, so this is only needed if you also
-- want to allow direct anon/public reads of the table via the client SDK.
-- ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public can read offers" ON public.offers
--   FOR SELECT USING (true);

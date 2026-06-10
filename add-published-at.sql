-- ═══════════════════════════════════════════════
-- Tambah kolom published_at ke tabel news_articles
-- Jalankan SQL ini di Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Tambah kolom published_at (nullable, default = created_at)
ALTER TABLE public.news_articles 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- 2. Isi published_at yang kosong dengan created_at
UPDATE public.news_articles 
SET published_at = created_at 
WHERE published_at IS NULL;

-- Selesai! Kolom published_at sudah siap digunakan.

-- ══════════════════════════════════════════════
-- Tabel site_settings: Menyimpan pengaturan website
-- Jalankan SQL ini di Supabase SQL Editor
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  -- Kontak
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  -- Sosial Media
  instagram_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  tiktok_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  -- Visi & Misi
  visi TEXT DEFAULT '',
  misi TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row
INSERT INTO site_settings (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

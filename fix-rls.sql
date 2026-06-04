-- ============================================
-- JALANKAN DI SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================
-- FIX untuk 3 tabel yang masih diblokir RLS:
-- news_articles, events, gallery
-- ============================================


-- ═══ 1. news_articles ═══
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_news" ON public.news_articles
  FOR SELECT USING (true);

CREATE POLICY "anon_insert_news" ON public.news_articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_news" ON public.news_articles
  FOR UPDATE USING (true);

CREATE POLICY "anon_delete_news" ON public.news_articles
  FOR DELETE USING (true);


-- ═══ 2. events ═══
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "anon_insert_events" ON public.events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_events" ON public.events
  FOR UPDATE USING (true);

CREATE POLICY "anon_delete_events" ON public.events
  FOR DELETE USING (true);


-- ═══ 3. gallery ═══
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_gallery" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "anon_insert_gallery" ON public.gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_gallery" ON public.gallery
  FOR UPDATE USING (true);

CREATE POLICY "anon_delete_gallery" ON public.gallery
  FOR DELETE USING (true);


-- ═══ 4. Storage Buckets ═══
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('programs', 'programs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage: izinkan baca dan upload
CREATE POLICY "public_read_storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('thumbnails','gallery','events','programs'));

CREATE POLICY "public_upload_storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('thumbnails','gallery','events','programs'));


-- ✅ SELESAI! Refresh website kamu.

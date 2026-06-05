"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users, Newspaper, CalendarDays, ArrowRight, ChevronRight, ChevronLeft,
  Globe, AtSign, Film, PenLine, Monitor, BookOpen, Camera,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Program { id: string; title: string; description: string; icon_name?: string; is_active: boolean; }
interface Article { id: string; title: string; slug?: string; excerpt?: string; status: string; is_featured: boolean; thumbnail_url?: string | null; created_at: string; categories?: { name: string } | null; }
interface GalleryItem { id: string; title: string; image_url: string | null; caption?: string; }

const heroSlides = [
  { id: 1, title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar", excerpt: "Kepengurusan baru TEKAD UNM resmi dilantik di Aula Gedung PKM pada Sabtu, 12 April 2025.", category: "Organisasi", date: "12 Apr 2025" },
  { id: 2, title: "Workshop Jurnalistik: Menulis Berita yang Berdampak", excerpt: "TEKAD UNM mengadakan workshop jurnalistik bersama praktisi media nasional.", category: "Akademik", date: "28 Mar 2025" },
  { id: 3, title: "TEKAD Raih Juara 2 Lomba Karya Tulis Ilmiah Tingkat Regional", excerpt: "Tim perwakilan TEKAD berhasil meraih Juara 2 LKTI tingkat regional Sulawesi Selatan.", category: "Prestasi", date: "15 Mar 2025" },
];

const divisiData = [
  { icon: Monitor, name: "Website", desc: "Pengembangan & pengelolaan web" },
  { icon: AtSign, name: "Instagram", desc: "Konten & desain visual IG" },
  { icon: Film, name: "TikTok", desc: "Konten video pendek kreatif" },
  { icon: Globe, name: "YouTube", desc: "Produksi video & dokumentasi" },
  { icon: PenLine, name: "Reporter", desc: "Liputan berita & jurnalistik" },
];

const programColors = ["from-blue-500 to-blue-600", "from-indigo-500 to-indigo-600", "from-sky-500 to-blue-600", "from-violet-500 to-purple-600", "from-teal-500 to-cyan-600", "from-blue-600 to-indigo-600"];

export default function BerandaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const nextSlide = useCallback(() => { setCurrentSlide((p) => (p + 1) % heroSlides.length); }, []);
  const prevSlide = () => { setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length); };

  useEffect(() => { const t = setInterval(nextSlide, 5000); return () => clearInterval(t); }, [nextSlide]);

  useEffect(() => {
    async function fetchPrograms() {
      try { const s = createClient(); const { data } = await s.from("programs").select("*").eq("is_active", true); setPrograms(data || []); } catch (err) { console.error(err); } finally { setLoadingPrograms(false); }
    }
    fetchPrograms();
  }, []);

  useEffect(() => {
    async function fetchGallery() {
      try { const s = createClient(); const { data } = await s.from("gallery").select("id, title, image_url, caption").order("created_at", { ascending: false }).limit(12); setGallery(data || []); } catch (err) { console.error(err); }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      try { const s = createClient(); const { data } = await s.from("news_articles").select("*, categories(name)").eq("status", "published").order("created_at", { ascending: false }).limit(4); setArticles(data || []); } catch (err) { console.error(err); } finally { setLoadingArticles(false); }
    }
    fetchArticles();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const featured = articles[0] || null;
  const side = articles.slice(1);

  return (
    <>
      {/* ── HERO ── */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" />
        <div className="relative h-[380px] sm:h-[440px] md:h-[500px] lg:h-[560px]">
          {heroSlides.map((slide, i) => (
            <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${i === currentSlide ? "translate-x-0 opacity-100" : i < currentSlide ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"}`}>
              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm sm:text-xs">{slide.category}</span>
                    <h2 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">{slide.title}</h2>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">{slide.excerpt}</p>
                    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <Link href={`/berita/${slide.id}`} className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-blue-700 transition-all hover:bg-gray-100 active:scale-[0.98] sm:px-6 dark:bg-white dark:text-gray-900">
                        Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <span className="text-xs text-white/50">{slide.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={prevSlide} className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:left-5" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm transition hover:bg-white/20 hover:text-white sm:right-5" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`} aria-label={`Slide ${i + 1}`} />))}
          </div>
        </div>
      </section>

      {/* ── BERITA ── */}
      <section id="berita-terbaru" className="bg-white py-20 sm:py-24 lg:py-28 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Terbaru</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">Berita & Pengumuman</h2>
            </div>
            <Link href="/berita" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white">Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>

          {loadingArticles ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-900"><div className="aspect-[16/9]" /><div className="space-y-3 p-6"><div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" /><div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" /></div></div>
              <div className="flex flex-col gap-4">{[1,2,3].map(i => <div key={i} className="animate-pulse flex gap-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-900"><div className="h-20 w-24 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-800" /><div className="flex-1 space-y-2 py-1"><div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" /><div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" /></div></div>)}</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center dark:border-gray-800"><Newspaper className="mx-auto mb-4 h-10 w-10 text-gray-300 dark:text-gray-700" /><p className="text-sm text-gray-400">Berita akan segera ditampilkan.</p></div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {featured && (
                <Link href={`/berita/${featured.slug || featured.id}`}>
                  <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                      {featured.thumbnail_url ? (<img src={featured.thumbnail_url} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />) : (<div className="flex h-full items-center justify-center"><Newspaper className="h-10 w-10 text-gray-300 dark:text-gray-700" /></div>)}
                      <div className="absolute left-4 top-4"><span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">{featured.categories?.name || "UMUM"}</span></div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <time className="text-xs font-medium text-gray-400">{formatDate(featured.created_at)}</time>
                      <h3 className="mt-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-2xl dark:text-white dark:group-hover:text-blue-400">{featured.title}</h3>
                      {featured.excerpt && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{featured.excerpt}</p>}
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </article>
                </Link>
              )}
              <div className="flex flex-col gap-4">
                {side.map((a) => (
                  <Link key={a.id} href={`/berita/${a.slug || a.id}`} className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">{a.thumbnail_url ? <img src={a.thumbnail_url} alt={a.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Newspaper className="h-5 w-5 text-gray-300 dark:text-gray-700" /></div>}</div>
                    <div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{a.categories?.name || "UMUM"}</span><h4 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{a.title}</h4><time className="mt-1.5 text-[11px] text-gray-400">{formatDate(a.created_at)}</time></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PROGRAM ── */}
      <section id="program-kami" className="bg-gray-50/50 py-20 sm:py-24 lg:py-28 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Layanan</span>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">Program Kami</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">Berbagai program unggulan yang kami jalankan untuk mengembangkan potensi mahasiswa.</p>
          </div>
          {loadingPrograms ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"><div className="mb-4 h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" /><div className="mb-2 h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" /><div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" /></div>)}</div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program, idx) => (
                <div key={program.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${programColors[idx % programColors.length]} shadow-lg transition-transform duration-200 group-hover:scale-105`}><BookOpen className="h-5 w-5 text-white" /></div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{program.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{program.description}</p>
                </div>
              ))}
            </div>
          ) : (<div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center dark:border-gray-800"><BookOpen className="mx-auto mb-4 h-10 w-10 text-gray-300 dark:text-gray-700" /><p className="text-sm text-gray-400">Program akan segera ditampilkan.</p></div>)}
        </div>
      </section>

      {/* ── GALLERY MARQUEE ── */}
      {gallery.length > 0 && (
        <section className="overflow-hidden bg-white py-16 sm:py-20 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Dokumentasi</span>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">Galeri Kegiatan</h2>
              </div>
              <Link href="/galeri" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white">Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            </div>
          </div>
          <div className="relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent dark:from-gray-950" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent dark:from-gray-950" />
            {/* Marquee track */}
            <div className="flex animate-marquee gap-4" style={{ width: 'max-content' }}>
              {[...gallery, ...gallery].map((foto, i) => (
                <div key={`${foto.id}-${i}`} className="group relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-56 sm:w-80 dark:bg-gray-800">
                  {foto.image_url ? (
                    <Image src={foto.image_url} alt={foto.title || "Galeri"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="320px" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Camera className="h-8 w-8 text-gray-300 dark:text-gray-600" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-sm font-semibold text-white">{foto.title}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
        </section>
      )}

      {/* ── TENTANG ── */}
      <section className="bg-white py-20 sm:py-24 lg:py-28 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Tentang Kami</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">Tim Media Kreatif <span className="text-gradient">TEKAD UNM</span></h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-500 sm:text-base">TEKAD (Tim Edukasi, Kreativitas, Aspirasi, dan Dedikasi) merupakan Unit Kegiatan Mahasiswa Administrasi Bisnis Universitas Negeri Makassar yang bergerak di bidang jurnalistik dan media kampus.</p>
              <div className="mt-7"><Link href="/tentang" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]">Selengkapnya <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {divisiData.map((d) => { const Icon = d.icon; return (
                <div key={d.name} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white transition-transform duration-200 group-hover:scale-105"><Icon className="h-5 w-5" /></div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{d.name}</p><p className="mt-1 text-[11px] text-gray-400">{d.desc}</p>
                </div>
              ); })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 py-20 sm:py-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">Bergabung Bersama TEKAD UNM</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">Kembangkan potensimu di bidang jurnalistik, media kreatif, dan teknologi.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/daftar" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue-700 transition-all hover:bg-gray-100 active:scale-[0.98] sm:w-auto dark:text-gray-900">Daftar Sekarang <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <Link href="/tentang" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5 sm:w-auto">Pelajari Lebih Lanjut</Link>
          </div>
        </div>
      </section>
    </>
  );
}

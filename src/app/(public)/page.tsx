"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Newspaper,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Globe,
  AtSign,
  Film,
  PenLine,
  Monitor,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface Program {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  is_active: boolean;
  created_at?: string;
}

interface Article {
  id: string;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status: string;
  is_featured: boolean;
  thumbnail_url?: string | null;
  created_at: string;
  categories?: { name: string } | null;
}

/* ═══════════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════════ */

const heroSlides = [
  {
    id: 1,
    title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar",
    excerpt: "Kepengurusan baru TEKAD UNM resmi dilantik di Aula Gedung PKM pada Sabtu, 12 April 2025.",
    category: "Organisasi",
    date: "12 Apr 2025",
  },
  {
    id: 2,
    title: "Workshop Jurnalistik: Menulis Berita yang Berdampak",
    excerpt: "TEKAD UNM mengadakan workshop jurnalistik bersama praktisi media nasional.",
    category: "Akademik",
    date: "28 Mar 2025",
  },
  {
    id: 3,
    title: "TEKAD Raih Juara 2 Lomba Karya Tulis Ilmiah Tingkat Regional",
    excerpt: "Tim perwakilan TEKAD berhasil meraih Juara 2 LKTI tingkat regional Sulawesi Selatan.",
    category: "Prestasi",
    date: "15 Mar 2025",
  },
];

const divisiData = [
  { icon: Monitor, name: "Website", desc: "Pengembangan & pengelolaan web" },
  { icon: AtSign, name: "Instagram", desc: "Konten & desain visual IG" },
  { icon: Film, name: "TikTok", desc: "Konten video pendek kreatif" },
  { icon: Globe, name: "YouTube", desc: "Produksi video & dokumentasi" },
  { icon: PenLine, name: "Reporter", desc: "Liputan berita & jurnalistik" },
];

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const programColors = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-teal-500 to-cyan-600",
  "from-blue-600 to-indigo-600",
];

/* ═══════════════════════════════════════════════
   BERANDA PAGE — CLEAN PREMIUM
   ═══════════════════════════════════════════════ */

export default function BerandaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Fetch programs
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("programs").select("*").eq("is_active", true);
        if (error) console.error("Error fetching programs:", error);
        else setPrograms(data || []);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, []);

  // Fetch articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("news_articles")
          .select("*, categories(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(4);
        if (error) console.error("Error fetching articles:", error);
        else setArticles(data || []);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoadingArticles(false);
      }
    }
    fetchArticles();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const featuredArticle = articles[0] || null;
  const sideArticles = articles.slice(1);

  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section id="hero" className="relative overflow-hidden bg-gray-950">
        <div className="relative h-[380px] sm:h-[440px] md:h-[500px] lg:h-[560px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? "translate-x-0 opacity-100" : index < currentSlide ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
              }`}
            >
              {/* BG */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/80 to-gray-950" />
              <div className="absolute inset-0 dot-grid opacity-20" />

              {/* Content */}
              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-sm sm:text-xs">
                      {slide.category}
                    </span>
                    <h2 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
                      {slide.excerpt}
                    </p>
                    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <Link
                        href={`/berita/${slide.id}`}
                        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-900 transition-all hover:bg-gray-100 active:scale-[0.98] sm:px-6"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <span className="text-xs text-gray-600">{slide.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Nav arrows */}
          <button onClick={prevSlide} className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/50 backdrop-blur-sm transition hover:bg-white/10 hover:text-white sm:left-5" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/50 backdrop-blur-sm transition hover:bg-white/10 hover:text-white sm:right-5" aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── BERITA ─────────────── */}
      <motion.section id="berita-terbaru" className="py-20 sm:py-24 lg:py-28" {...sectionAnim}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Terbaru</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Berita & Pengumuman
              </h2>
            </div>
            <Link href="/berita" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-900">
              Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loadingArticles ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="animate-pulse rounded-2xl bg-gray-100"><div className="aspect-[16/9]" /><div className="space-y-3 p-6"><div className="h-5 w-3/4 rounded bg-gray-200" /><div className="h-4 w-full rounded bg-gray-100" /></div></div>
              <div className="flex flex-col gap-4">{[1,2,3].map(i => <div key={i} className="animate-pulse flex gap-4 rounded-xl bg-gray-100 p-4"><div className="h-20 w-24 shrink-0 rounded-lg bg-gray-200" /><div className="flex-1 space-y-2 py-1"><div className="h-4 w-full rounded bg-gray-200" /><div className="h-3 w-20 rounded bg-gray-100" /></div></div>)}</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Newspaper className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Berita akan segera ditampilkan.</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {featuredArticle && (
                <Link href={`/berita/${featuredArticle.slug || featuredArticle.id}`}>
                  <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/[0.04]">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {featuredArticle.thumbnail_url ? (
                        <img src={featuredArticle.thumbnail_url} alt={featuredArticle.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center dot-grid-light">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm"><Newspaper className="h-7 w-7 text-gray-300" /></div>
                        </div>
                      )}
                      <div className="absolute left-4 top-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">{featuredArticle.categories?.name || "UMUM"}</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <time className="text-xs font-medium text-gray-400">{formatDate(featuredArticle.created_at)}</time>
                      <h3 className="mt-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-2xl">{featuredArticle.title}</h3>
                      {featuredArticle.excerpt && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{featuredArticle.excerpt}</p>}
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </article>
                </Link>
              )}
              <div className="flex flex-col gap-4">
                {sideArticles.map((article) => (
                  <Link key={article.id} href={`/berita/${article.slug || article.id}`} className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/[0.04]">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {article.thumbnail_url ? <img src={article.thumbnail_url} alt={article.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Newspaper className="h-5 w-5 text-gray-300" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{article.categories?.name || "UMUM"}</span>
                      <h4 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600">{article.title}</h4>
                      <time className="mt-1.5 text-[11px] text-gray-400">{formatDate(article.created_at)}</time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ─────────────── PROGRAM KAMI ─────────────── */}
      <motion.section id="program-kami" className="bg-gray-50/50 py-20 sm:py-24 lg:py-28" {...sectionAnim}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Layanan</span>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">Program Kami</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">
              Berbagai program unggulan yang kami jalankan untuk mengembangkan potensi mahasiswa.
            </p>
          </div>

          {loadingPrograms ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-8"><div className="mb-4 h-12 w-12 rounded-xl bg-gray-200" /><div className="mb-2 h-5 w-2/3 rounded bg-gray-200" /><div className="h-4 w-full rounded bg-gray-100" /></div>)}
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program, idx) => (
                <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/[0.04] sm:p-8"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${programColors[idx % programColors.length]} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">{program.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{program.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Program akan segera ditampilkan.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ─────────────── TENTANG ─────────────── */}
      <motion.section className="py-20 sm:py-24 lg:py-28" {...sectionAnim}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Tentang Kami</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Tim Media Kreatif{" "}
                <span className="text-gradient">TEKAD UNM</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-500 sm:text-base">
                TEKAD (Tim Edukasi, Kreativitas, Aspirasi, dan Dedikasi) merupakan Unit Kegiatan Mahasiswa Administrasi Bisnis Universitas Negeri Makassar yang bergerak di bidang jurnalistik dan media kampus.
              </p>
              <div className="mt-7">
                <Link href="/tentang" className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98]">
                  Selengkapnya
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {divisiData.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.name} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/[0.04]">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">{d.name}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{d.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─────────────── CTA ─────────────── */}
      <motion.section className="relative overflow-hidden bg-gray-950 py-20 sm:py-24" {...sectionAnim}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Bergabung Bersama TEKAD UNM
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 sm:text-base">
            Kembangkan potensimu di bidang jurnalistik, media kreatif, dan teknologi.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/daftar" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100 active:scale-[0.98] sm:w-auto">
              Daftar Sekarang <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/tentang" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5 sm:w-auto">
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </motion.section>
    </>
  );
}

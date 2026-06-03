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

/* ═══════════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════════ */

const heroSlides = [
  {
    id: 1,
    title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar",
    excerpt:
      "Kepengurusan baru TEKAD UNM resmi dilantik di Aula Gedung PKM pada Sabtu, 12 April 2025.",
    category: "Organisasi",
    date: "12 Apr 2025",
    color: "from-blue-900/90 via-blue-800/80 to-slate-900/90",
  },
  {
    id: 2,
    title: "Workshop Jurnalistik: Menulis Berita yang Berdampak",
    excerpt:
      "TEKAD UNM mengadakan workshop jurnalistik bersama praktisi media nasional.",
    category: "Akademik",
    date: "28 Mar 2025",
    color: "from-indigo-900/90 via-blue-900/80 to-slate-900/90",
  },
  {
    id: 3,
    title: "TEKAD Raih Juara 2 Lomba Karya Tulis Ilmiah Tingkat Regional",
    excerpt:
      "Tim perwakilan TEKAD berhasil meraih Juara 2 LKTI tingkat regional Sulawesi Selatan.",
    category: "Prestasi",
    date: "15 Mar 2025",
    color: "from-slate-900/90 via-blue-900/80 to-indigo-900/90",
  },
];



const featuredNews = {
  id: 1,
  title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar",
  excerpt:
    "Kepengurusan baru TEKAD UNM resmi dilantik di Aula Gedung PKM pada Sabtu, 12 April 2025. Acara dihadiri oleh seluruh anggota dan dosen pembimbing.",
  category: "Organisasi",
  categoryColor: "bg-blue-100 text-blue-700",
  date: "12 Apr 2025",
};

const sideNews = [
  {
    id: 2,
    title: "Workshop Jurnalistik: Menulis Berita yang Berdampak",
    category: "Akademik",
    categoryColor: "bg-emerald-100 text-emerald-700",
    date: "28 Mar 2025",
  },
  {
    id: 3,
    title: "TEKAD Raih Juara 2 LKTI Tingkat Regional Sulawesi Selatan",
    category: "Prestasi",
    categoryColor: "bg-amber-100 text-amber-700",
    date: "15 Mar 2025",
  },
  {
    id: 4,
    title: "Rapat Koordinasi Divisi Semester Genap 2025",
    category: "Internal",
    categoryColor: "bg-gray-100 text-gray-700",
    date: "10 Mar 2025",
  },
];

const divisiData = [
  { icon: Monitor, name: "Website", desc: "Pengembangan & pengelolaan web", color: "from-blue-500 to-blue-700" },
  { icon: AtSign, name: "Instagram", desc: "Konten & desain visual IG", color: "from-pink-500 to-rose-600" },
  { icon: Film, name: "TikTok", desc: "Konten video pendek kreatif", color: "from-slate-700 to-slate-900" },
  { icon: Globe, name: "YouTube", desc: "Produksi video & dokumentasi", color: "from-red-500 to-red-700" },
  { icon: PenLine, name: "Reporter", desc: "Liputan berita & jurnalistik", color: "from-indigo-500 to-indigo-700" },
];

const galleryImages = [
  { id: 1, alt: "Pelantikan Pengurus Baru", color: "from-blue-200 to-blue-300" },
  { id: 2, alt: "Workshop Jurnalistik", color: "from-sky-200 to-indigo-300" },
  { id: 3, alt: "Kegiatan Sosial", color: "from-indigo-200 to-blue-300" },
  { id: 4, alt: "Lomba Karya Tulis", color: "from-slate-200 to-blue-200" },
];

/* ═══════════════════════════════════════════════
   ANIMATION PRESETS
   ═══════════════════════════════════════════════ */

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* Program card accent colors */
const programColors = [
  "from-blue-500 to-blue-700",
  "from-indigo-500 to-indigo-700",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-700",
  "from-teal-500 to-cyan-700",
  "from-blue-600 to-indigo-600",
];

/* ═══════════════════════════════════════════════
   BERANDA PAGE
   ═══════════════════════════════════════════════ */

export default function BerandaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Fetch programs from Supabase
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("is_active", true);

        if (error) {
          console.error("Error fetching programs:", error);
        } else {
          setPrograms(data || []);
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, []);

  return (
    <>
      {/* ─────────────── HERO SLIDER ─────────────── */}
      <section id="hero" className="relative overflow-hidden bg-gray-900">
        {/* Slides */}
        <div className="relative h-[420px] sm:h-[480px] lg:h-[540px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0 opacity-100"
                  : index < currentSlide
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}
              />
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Content */}
              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="mb-4 inline-block rounded-md bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 backdrop-blur-sm">
                      {slide.category}
                    </span>
                    <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base">
                      {slide.excerpt}
                    </p>
                    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <Link
                        href={`/berita/${slide.id}`}
                        className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] sm:px-6 sm:py-3"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <span className="text-sm text-gray-400">
                        {slide.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:left-6 sm:h-10 sm:w-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:right-6 sm:h-10 sm:w-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-blue-500"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────── PROGRAM KAMI ─────────────── */}
      <motion.section
        id="program-kami"
        className="py-16 sm:py-20 md:py-28"
        {...sectionAnim}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 text-center sm:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span>Layanan</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Program Kami
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Berbagai program unggulan yang kami jalankan untuk mengembangkan potensi mahasiswa di bidang media dan jurnalistik.
            </p>
          </div>

          {/* Programs Grid */}
          {loadingPrograms ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8"
                >
                  <div className="mb-4 h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="mb-2 h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="mt-1 h-4 w-4/5 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
              {programs.map((program, idx) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 sm:p-8"
                >
                  {/* Accent gradient bg on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      programColors[idx % programColors.length]
                    } opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]`}
                  />
                  <div className="relative">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                        programColors[idx % programColors.length]
                      } shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-700 sm:text-lg">
                      {program.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {program.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback if no programs found */
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center sm:p-16">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-400">
                Program akan segera ditampilkan.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ─────────────── BERITA TERBARU (PORTAL STYLE) ─────────────── */}
      <motion.section
        id="berita-terbaru"
        className="py-16 sm:py-20 md:py-28"
        {...sectionAnim}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Newspaper className="h-4 w-4" />
                <span>Terbaru</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                Berita & Pengumuman
              </h2>
            </div>
            <Link
              href="/berita"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Grid: 1 featured left + 3 side right */}
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Featured article (big) */}
            <article className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/5">
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm sm:h-20 sm:w-20">
                    <Newspaper className="h-6 w-6 text-blue-400 sm:h-8 sm:w-8" />
                  </div>
                </div>
                <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${featuredNews.categoryColor}`}
                  >
                    {featuredNews.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <time className="mb-2 text-xs font-medium text-gray-400">
                  {featuredNews.date}
                </time>
                <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700 sm:text-xl md:text-2xl">
                  {featuredNews.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">
                  {featuredNews.excerpt}
                </p>
                <Link
                  href={`/berita/${featuredNews.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                >
                  Baca Selengkapnya
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>

            {/* Side news list */}
            <div className="flex flex-col gap-4">
              {sideNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/berita/${news.id}`}
                  className="group flex gap-3 rounded-xl border border-gray-200/80 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/5 sm:gap-4 sm:p-4"
                >
                  {/* Mini thumbnail */}
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 sm:h-20 sm:w-24">
                    <Newspaper className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`mb-1 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${news.categoryColor}`}
                    >
                      {news.category}
                    </span>
                    <h4 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
                      {news.title}
                    </h4>
                    <time className="mt-1.5 text-xs text-gray-400">
                      {news.date}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─────────────── COMPANY PROFILE SECTION ─────────────── */}
      <motion.section
        className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 sm:py-20 md:py-28"
        {...sectionAnim}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>Tentang Kami</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                Tim Media Kreatif{" "}
                <span className="text-blue-700">TEKAD UNM</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                TEKAD (Tim Edukasi, Kreativitas, Aspirasi, dan Dedikasi)
                merupakan Unit Kegiatan Mahasiswa Administrasi Bisnis
                Universitas Negeri Makassar yang bergerak di bidang jurnalistik
                dan media kampus. Kami menjadi wadah komunikasi, publikasi, dan
                informasi bagi seluruh civitas akademika.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/tentang"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] sm:px-6 sm:py-3"
                >
                  Selengkapnya
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right: Divisi Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {divisiData.map((d) => {
                const Icon = d.icon;
                return (
                  <div
                    key={d.name}
                    className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5 sm:p-5"
                  >
                    <div
                      className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${d.color} shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {d.name}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-gray-400">
                      {d.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─────────────── GALERI ─────────────── */}
      <motion.section
        id="galeri"
        className="py-16 sm:py-20 md:py-28"
        {...sectionAnim}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14 md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              <span>Dokumentasi</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Potret Kegiatan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Momen-momen berharga dari berbagai kegiatan TEKAD UNM.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className={`group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${img.color}`}
              >
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                    <Sparkles className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-900/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:p-4 md:p-5">
                  <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-xs font-semibold text-white sm:text-sm md:text-base">
                      {img.alt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-14 md:mt-16">
            <Link
              href="/galeri"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:px-8 sm:py-3.5"
            >
              Lihat Semua Galeri
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ─────────────── CTA SECTION ─────────────── */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 sm:py-20 md:py-24"
        {...sectionAnim}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            Bergabung Bersama TEKAD UNM
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Kembangkan potensimu di bidang jurnalistik, media kreatif, dan
            teknologi bersama keluarga besar TEKAD.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/daftar"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all hover:bg-gray-50 hover:shadow-2xl active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5"
            >
              Daftar Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tentang"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 sm:w-auto sm:px-8 sm:py-3.5"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </motion.section>
    </>
  );
}

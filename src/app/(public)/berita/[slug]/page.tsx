import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Clock,
  Newspaper,
  Share2,
  Bookmark,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DUMMY DATA — akan diganti dengan fetch Supabase
   ═══════════════════════════════════════════════ */

const dummyArticle = {
  title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar",
  category: "Organisasi",
  categoryColor: "bg-blue-100 text-blue-700",
  author: "Redaksi TEKAD",
  date: "12 April 2025",
  readTime: "5 menit baca",
  content: [
    "Kepengurusan baru TEKAD UNM untuk periode 2025/2026 resmi dilantik dalam sebuah upacara yang berlangsung khidmat di Aula Gedung PKM, Kampus UNM Parangtambung, pada Sabtu, 12 April 2025. Acara yang dihadiri oleh seluruh anggota, alumni, serta dosen pembimbing ini menandai babak baru perjalanan organisasi media kreatif Administrasi Bisnis UNM.",
    "Dalam sambutannya, Ketua TEKAD periode baru, menyampaikan visi besarnya untuk membawa TEKAD menjadi lebih dikenal di tingkat universitas maupun nasional. \"Kami ingin TEKAD tidak hanya menjadi wadah informasi, tetapi juga menjadi laboratorium kreativitas bagi seluruh mahasiswa Administrasi Bisnis,\" ujarnya di hadapan para hadirin yang memenuhi aula.",
    "Acara pelantikan ini juga dimeriahkan dengan penampilan seni dari anggota TEKAD, presentasi program kerja masing-masing divisi, serta sesi diskusi interaktif bersama alumni yang kini berkarier di berbagai media nasional. Para alumni berbagi pengalaman dan memberikan motivasi kepada pengurus baru untuk terus berinovasi dan menjaga kualitas konten yang diproduksi.",
    "Dosen pembimbing TEKAD turut memberikan apresiasi atas kinerja pengurus periode sebelumnya dan menyampaikan harapannya agar kepengurusan baru dapat melanjutkan tradisi positif yang telah dibangun. Beliau juga menekankan pentingnya kolaborasi antar divisi dan pengembangan kompetensi digital di era transformasi media saat ini. Acara ditutup dengan sesi foto bersama dan ramah-tamah seluruh peserta.",
  ],
};

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  return {
    title: dummyArticle.title,
    description: dummyArticle.content[0].slice(0, 160) + "...",
  };
}

/* ═══════════════════════════════════════════════
   DETAIL BERITA PAGE
   ═══════════════════════════════════════════════ */

export default function DetailBeritaPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      {/* ─────────────── ARTICLE HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-sky-200/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          {/* Back button */}
          <Link
            href="/berita"
            className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-white/80 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Berita
          </Link>

          {/* Category badge */}
          <div className="mb-4">
            <span
              className={`inline-block rounded-lg px-3 py-1 text-xs font-semibold ${dummyArticle.categoryColor}`}
            >
              {dummyArticle.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {dummyArticle.title}
          </h1>

          {/* Meta info */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-500" />
              {dummyArticle.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              {dummyArticle.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              {dummyArticle.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────── ARTICLE CONTENT ─────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Featured Image Placeholder */}
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm sm:mb-14">
            <div className="aspect-[16/9]">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="flex h-full items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
                  <Newspaper className="h-9 w-9 text-blue-400" />
                </div>
              </div>
            </div>
            {/* Image caption */}
            <div className="bg-gray-50 px-5 py-3">
              <p className="text-xs text-gray-400">
                Foto: Dokumentasi pelantikan pengurus TEKAD UNM 2025/2026 di
                Aula Gedung PKM.
              </p>
            </div>
          </div>

          {/* Article body */}
          <article className="mx-auto max-w-3xl">
            <div className="space-y-6">
              {dummyArticle.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`leading-relaxed text-gray-600 ${
                    idx === 0
                      ? "text-lg font-medium text-gray-700 first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-extrabold first-letter:leading-none first-letter:text-blue-700"
                      : "text-base"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share & Bookmark */}
            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Bagikan:
                </span>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                {["TEKAD", "UNM", "Pelantikan"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to list */}
            <div className="mt-10 border-t border-gray-100 pt-10 text-center">
              <Link
                href="/berita"
                className="group inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Kembali ke Daftar Berita
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

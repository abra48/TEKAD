import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Search,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description:
    "Berita, artikel, dan pengumuman terbaru dari TEKAD — Tim Media Kreatif Administrasi Bisnis UNM.",
};

/* ═══════════════════════════════════════════════
   BERITA PAGE — Server Component (live fetch)
   ═══════════════════════════════════════════════ */

export default async function BeritaPage() {
  let berita: any[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    berita = data;
  } catch (err) {
    console.error("Failed to fetch news:", err);
    berita = [];
  }

  return (
    <>
      {/* ─────────────── HEADER ─────────────── */}
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

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Newspaper className="h-4 w-4" />
              <span>Media & Publikasi</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Berita & <span className="text-blue-700">Pengumuman</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              Ikuti perkembangan terkini, artikel inspiratif, dan pengumuman
              penting dari TEKAD UNM.
            </p>

            {/* Search Input */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="group relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                <input
                  type="text"
                  placeholder="Cari berita atau pengumuman..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── NEWS GRID ─────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!berita || berita.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <Newspaper className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Belum Ada Berita
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Berita dan pengumuman akan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {berita.map((news) => (
                <article
                  key={news.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {news.thumbnail_url ? (
                      <Image
                        src={news.thumbnail_url}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <div className="flex h-full items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
                            <Newspaper className="h-7 w-7 text-blue-400" />
                          </div>
                        </div>
                      </>
                    )}
                    {/* Category Badge */}
                    {news.category && (
                      <div className="absolute left-4 top-4">
                        <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {news.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <time className="mb-2 text-xs font-medium text-gray-400">
                      {new Date(news.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-blue-700">
                      {news.title}
                    </h2>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
                      {news.excerpt}
                    </p>
                    <Link
                      href={`/berita/${news.slug || news.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ─────────────── PAGINATION ─────────────── */}
          {berita && berita.length > 0 && (
            <nav
              aria-label="Pagination"
              className="mt-14 flex items-center justify-center gap-2"
            >
              <button
                disabled
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                    page === 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

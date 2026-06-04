"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Newspaper,
  Share2,
  Bookmark,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  is_featured: boolean;
  thumbnail_url?: string | null;
  created_at: string;
  categories?: { name: string } | null;
}

/* ═══════════════════════════════════════════════
   DETAIL BERITA PAGE — Real Data from Supabase
   ═══════════════════════════════════════════════ */

export default function DetailBeritaPage({
  params,
}: {
  params: { slug: string };
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("news_articles")
          .select("*, categories(name)")
          .eq("slug", params.slug)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params.slug]);

  // Format date
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Reading time estimate
  const readTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} menit baca`;
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">Memuat artikel...</p>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Newspaper className="h-14 w-14 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">
          Artikel Tidak Ditemukan
        </h2>
        <p className="max-w-sm text-sm text-gray-500">
          Artikel yang kamu cari tidak tersedia atau sudah dihapus.
        </p>
        <Link
          href="/berita"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ─────────────── ARTICLE HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
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

          {/* Category */}
          <div className="mb-4">
            <span className="border-b-2 border-blue-500 pb-0.5 text-xs font-black uppercase tracking-wider text-blue-600">
              {article.categories?.name || "UMUM"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              {formatDate(article.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              {readTime(article.content || "")}
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────── ARTICLE CONTENT ─────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Thumbnail */}
          {article.thumbnail_url && (
            <div className="relative mb-10 overflow-hidden rounded-2xl shadow-sm sm:mb-14">
              <div className="aspect-[16/9]">
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article body */}
          <article className="mx-auto max-w-3xl">
            {/* Render HTML content */}
            <div
              className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* If content is plain text (not HTML), render paragraphs */}
            {!article.content.includes("<") && (
              <div className="space-y-6">
                {article.content.split("\n\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={`leading-relaxed text-gray-600 ${
                      idx === 0
                        ? "text-lg font-medium text-gray-700"
                        : "text-base"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

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

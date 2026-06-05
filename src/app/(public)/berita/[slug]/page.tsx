"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Newspaper,
  Share2,
  Bookmark,
  Loader2,
  Tag,
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
   DETAIL BERITA PAGE — Next.js 14
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const readTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} menit baca`;
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat artikel...</p>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Newspaper className="h-9 w-9 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Artikel Tidak Ditemukan
        </h2>
        <p className="max-w-sm text-sm text-gray-500">
          Artikel yang kamu cari tidak tersedia atau sudah dihapus.
        </p>
        <Link
          href="/berita"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  /* ── Article View ── */
  return (
    <section className="bg-white py-10 sm:py-14 dark:bg-gray-950">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/berita"
          className="group mb-10 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Kembali
        </Link>

        {/* ── Header — Center aligned ── */}
        <header className="mb-10 text-center">
          {/* Category */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {article.categories?.name || "Umum"}
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-400 dark:text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-blue-500/60" />
              {formatDate(article.created_at)}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block dark:bg-gray-700" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500/60" />
              {readTime(article.content || "")}
            </span>
          </div>
        </header>

        {/* ── Hero Image ── */}
        {article.thumbnail_url && (
          <div className="relative mb-12 overflow-hidden rounded-2xl shadow-xl sm:mb-16">
            <div className="relative h-[280px] sm:h-[360px] md:h-[400px]">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          </div>
        )}

        {/* ── Content Body ── */}
        <div className="mx-auto max-w-3xl">
          {/* HTML content */}
          {article.content.includes("<") ? (
            <div
              className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-blue-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            /* Plain text content */
            <div className="space-y-6">
              {article.content.split("\n\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`leading-relaxed ${
                    idx === 0
                      ? "text-lg font-medium text-gray-700 dark:text-gray-300"
                      : "text-lg text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* ── Share & Actions ── */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                Bagikan:
              </span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link berhasil disalin!");
                  }
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Back to List ── */}
          <div className="mt-10 border-t border-gray-100 pt-10 text-center dark:border-gray-800">
            <Link
              href="/berita"
              className="group inline-flex items-center gap-2 rounded-full border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98] dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

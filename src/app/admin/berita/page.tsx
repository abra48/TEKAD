"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Newspaper,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  Rocket,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface Article {
  id: string;
  title: string;
  slug?: string;
  status: string;
  is_featured: boolean;
  thumbnail_url?: string | null;
  created_at: string;
  categories?: { name: string } | null;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle2; style: string }
> = {
  published: {
    label: "Published",
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  },
  draft: {
    label: "Draft",
    icon: Clock,
    style: "bg-gray-100 text-gray-600 ring-gray-500/10",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    style: "bg-amber-50 text-amber-700 ring-amber-600/10",
  },
};

/* ═══════════════════════════════════════════════
   KELOLA BERITA PAGE — REAL DATA
   ═══════════════════════════════════════════════ */

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("news_articles")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        setArticles(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Filter
  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Delete article
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .eq("id", id);
      if (error) {
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Quick Publish
  const handlePublish = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("news_articles")
        .update({ status: "published" })
        .eq("id", id);
      if (error) {
        alert(`Gagal publish: ${error.message}`);
      } else {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: "published" } : a
          )
        );
      }
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Manajemen Berita
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola artikel, berita, dan pengumuman TEKAD UNM
          </p>
        </div>
        <Link
          href="/admin/berita/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tulis Berita Baru
        </Link>
      </div>

      {/* ── Search & Refresh ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
        <button
          onClick={fetchArticles}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Judul Artikel
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kategori
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tanggal
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                /* Loading skeleton */
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-200" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-48 rounded bg-gray-200" />
                          <div className="h-3 w-24 rounded bg-gray-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-20 rounded bg-gray-100" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 w-20 rounded-full bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-8 w-24 rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Newspaper className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-400">
                      {search
                        ? "Tidak ada artikel yang cocok dengan pencarian."
                        : "Belum ada artikel. Tulis berita pertama Anda!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const st = statusConfig[item.status] || statusConfig.draft;
                  const StatusIcon = st.icon;
                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors duration-150 hover:bg-blue-50/40"
                    >
                      {/* Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-blue-50">
                            {item.thumbnail_url ? (
                              <Image
                                src={item.thumbnail_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Newspaper className="h-4 w-4 text-blue-500" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                              {item.title}
                            </p>
                            {item.is_featured && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                                ★ Unggulan
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                          {item.categories?.name || "Umum"}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${st.style}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {st.label}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {/* Preview di halaman publik */}
                          <Link
                            href={`/berita/${item.slug || item.id}`}
                            target="_blank"
                            title="Preview"
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {/* Quick Publish (hanya untuk draft) */}
                          {item.status === "draft" && (
                            <button
                              title="Publish Sekarang"
                              onClick={() => handlePublish(item.id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <Rocket className="h-4 w-4" />
                            </button>
                          )}
                          <Link
                            href={`/admin/berita/${item.id}`}
                            title="Edit"
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            title="Hapus"
                            onClick={() =>
                              handleDelete(item.id, item.title)
                            }
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">
                {articles.length}
              </span>{" "}
              artikel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Save,
  Eye,
  Star,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

/* ═══════════════════════════════════════════════
   EDIT BERITA PAGE
   ═══════════════════════════════════════════════ */

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  null,
  { icon: List, label: "Bullet List" },
  { icon: ListOrdered, label: "Numbered List" },
  { icon: Quote, label: "Quote" },
  null,
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
  null,
  { icon: Link2, label: "Link" },
  { icon: ImageIcon, label: "Image" },
  { icon: Code, label: "Code" },
];

export default function EditBeritaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form State ──
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);

  // ── Fetch existing article + categories ──
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // Fetch categories
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });
        setCategories(catData || []);

        // Fetch article
        const { data, error: fetchErr } = await supabase
          .from("news_articles")
          .select("*")
          .eq("id", params.id)
          .single();

        if (fetchErr || !data) {
          setError("Artikel tidak ditemukan.");
          return;
        }

        setTitle(data.title || "");
        setContent(data.content || "");
        setExcerpt(data.excerpt || "");
        setCategoryId(data.category_id || "");
        setStatus(data.status || "draft");
        setIsFeatured(data.is_featured || false);
        if (data.thumbnail_url) {
          setExistingThumbnail(data.thumbnail_url);
          setThumbnailPreview(data.thumbnail_url);
        }
        if (data.published_at) {
          setPublishedAt(new Date(data.published_at).toISOString().slice(0, 16));
        } else if (data.created_at) {
          setPublishedAt(new Date(data.created_at).toISOString().slice(0, 16));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal memuat artikel.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [params.id]);

  // ── Handle file input ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(existingThumbnail);
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Handle update ──
  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) { setError("Judul artikel tidak boleh kosong."); return; }
    if (!content.trim()) { setError("Isi artikel tidak boleh kosong."); return; }

    setIsLoading(true);
    try {
      let imageUrl: string | null = existingThumbnail;

      // Upload new thumbnail if changed
      if (thumbnailFile) {
        imageUrl = await uploadFile(thumbnailFile, "thumbnails", "news");
      }

      // If user cleared the thumbnail
      if (!thumbnailPreview && !thumbnailFile) {
        imageUrl = null;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("news_articles")
        .update({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          category_id: categoryId || null,
          status,
          is_featured: isFeatured,
          thumbnail_url: imageUrl,
          published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        })
        .eq("id", params.id);

      if (updateError) throw new Error(updateError.message);

      alert("Berita berhasil diperbarui!");
      router.push("/admin/berita");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.message || "Terjadi kesalahan.";
      setError(`Gagal: ${message}`);
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/berita"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Edit Artikel
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Perbarui konten artikel yang sudah ada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/berita/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : (
              <><Save className="h-4 w-4" /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* ── Editor Layout ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Left: Editor ── */}
        <div className="space-y-5">
          {/* Title Input */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Type className="h-3.5 w-3.5" /> Judul Artikel
              </div>
            </div>
            <div className="p-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tulis judul artikel yang menarik..."
                className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 px-3 py-2 dark:border-gray-800">
              {toolbarButtons.map((btn, idx) =>
                btn === null ? (
                  <div key={`sep-${idx}`} className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <button
                    key={btn.label}
                    title={btn.label}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <btn.icon className="h-4 w-4" />
                  </button>
                )
              )}
            </div>
            <div className="p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder={`Mulai menulis isi artikel di sini...\n\nTips: Gunakan toolbar di atas untuk memformat teks Anda.`}
                className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-0 dark:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
            <div className="border-t border-gray-100 px-5 py-2.5 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                {content.split(/\s+/).filter(Boolean).length} kata • {content.length} karakter
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ringkasan / Excerpt
              </div>
            </div>
            <div className="p-5">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Tulis ringkasan singkat artikel (opsional)..."
                className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-0 dark:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* ── Right: Settings ── */}
        <div className="space-y-5">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Thumbnail</p>
            </div>
            <div className="p-5">
              <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                {thumbnailPreview ? (
                  <>
                    <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="text-xs text-gray-400">Belum ada gambar</p>
                  </div>
                )}
              </div>
              <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5">
                <Upload className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {thumbnailFile ? thumbnailFile.name : "Ganti Gambar"}
                </span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-500/10 dark:bg-blue-500/5">
                <p className="mb-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">📐 Panduan Thumbnail</p>
                <ul className="space-y-0.5 text-[10px] text-blue-600/80 dark:text-blue-400/70">
                  <li>• Ukuran ideal: <strong>1200 × 675 px</strong> (rasio 16:9)</li>
                  <li>• Format: JPG, PNG, WebP — Maks <strong>5 MB</strong></li>
                  <li>• Tips: Gunakan foto horizontal yang jelas & kontras tinggi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Kategori</p>
            </div>
            <div className="p-5">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-500"
              >
                <option value="">— Pilih Kategori —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="p-5">
              <label className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isFeatured ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`}>
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Artikel Unggulan</p>
                    <p className="text-xs text-gray-400">Tampilkan di section utama</p>
                  </div>
                </div>
                <div className="relative">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 dark:bg-gray-700" />
                  <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>

          {/* Tanggal Posting */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tanggal Posting</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-500"
                />
              </div>
              <p className="mt-2 text-[11px] text-gray-400">
                Atur kapan berita ini ditampilkan sebagai tanggal posting.
              </p>
            </div>
          </div>

          {/* Status & Save */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status Publikasi</p>
            </div>
            <div className="space-y-4 p-5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save className="h-4 w-4" /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

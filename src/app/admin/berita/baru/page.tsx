"use client";

import { useState, FormEvent, useRef } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

/* ═══════════════════════════════════════════════
   FORM EDITOR BERITA BARU
   ═══════════════════════════════════════════════ */

const categories = [
  "Kegiatan",
  "Pengumuman",
  "Akademik",
  "Prestasi",
  "Organisasi",
  "Opini",
];

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  null, // separator
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

/** Buat slug sederhana dari judul artikel */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // hapus karakter spesial
    .replace(/\s+/g, "-") // spasi → dash
    .replace(/-+/g, "-") // hapus double dash
    .substring(0, 120); // batasi panjang
}

export default function BeritaBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handle file input ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Handle submit ──
  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul artikel tidak boleh kosong.");
      return;
    }
    if (!content.trim()) {
      setError("Isi artikel tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl: string | null = null;

      // 1. Upload thumbnail jika ada
      if (thumbnailFile) {
        imageUrl = await uploadFile(thumbnailFile, "thumbnails", "news");
        if (!imageUrl) {
          setError("Gagal mengupload gambar thumbnail. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }
      }

      // 2. Insert ke database
      const supabase = createClient();
      const slug = generateSlug(title);

      const { error: insertError } = await supabase
        .from("news_articles")
        .insert({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          category,
          status,
          is_featured: featured,
          thumbnail_url: imageUrl,
        });

      if (insertError) {
        setError(`Gagal menyimpan artikel: ${insertError.message}`);
        setIsLoading(false);
        return;
      }

      alert("Berita berhasil disimpan!");
      router.push("/admin/berita");
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/berita"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Tulis Artikel Baru
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Buat dan publikasikan konten baru untuk TEKAD UNM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Artikel
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* ── Editor Layout ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Kolom Kiri: Editor ── */}
        <div className="space-y-5">
          {/* Title Input */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Type className="h-3.5 w-3.5" />
                Judul Artikel
              </div>
            </div>
            <div className="p-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tulis judul artikel yang menarik..."
                className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Rich Text Editor (Mock) */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 px-3 py-2">
              {toolbarButtons.map((btn, idx) =>
                btn === null ? (
                  <div
                    key={`sep-${idx}`}
                    className="mx-1 h-5 w-px bg-gray-200"
                  />
                ) : (
                  <button
                    key={btn.label}
                    title={btn.label}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <btn.icon className="h-4 w-4" />
                  </button>
                )
              )}
            </div>

            {/* Content area */}
            <div className="p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder={`Mulai menulis isi artikel di sini...\n\nTips: Gunakan toolbar di atas untuk memformat teks Anda. Anda bisa menambahkan heading, list, gambar, dan link.`}
                className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Word count */}
            <div className="border-t border-gray-100 px-5 py-2.5">
              <p className="text-xs text-gray-400">
                {content.split(/\s+/).filter(Boolean).length} kata •{" "}
                {content.length} karakter
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ringkasan / Excerpt
              </div>
            </div>
            <div className="p-5">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Tulis ringkasan singkat artikel (opsional, ditampilkan di halaman daftar berita)..."
                className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Pengaturan ── */}
        <div className="space-y-5">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Thumbnail
              </p>
            </div>
            <div className="p-5">
              {/* Preview area */}
              <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                {thumbnailPreview ? (
                  <>
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
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
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                    <p className="text-xs text-gray-400">Belum ada gambar</p>
                  </div>
                )}
              </div>

              {/* File input */}
              <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <Upload className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-blue-600">
                  {thumbnailFile ? thumbnailFile.name : "Pilih Gambar"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Kategori */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Kategori
              </p>
            </div>
            <div className="p-5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">— Pilih Kategori —</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="p-5">
              <label className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      featured
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Artikel Unggulan
                    </p>
                    <p className="text-xs text-gray-400">
                      Tampilkan di section utama
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600" />
                  <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>

          {/* Status & Publish */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status Publikasi
              </p>
            </div>
            <div className="space-y-4 p-5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan Artikel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

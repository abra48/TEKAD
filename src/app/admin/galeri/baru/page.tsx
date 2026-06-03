"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  Loader2,
  AlertCircle,
  Star,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

/* ═══════════════════════════════════════════════
   FORM UPLOAD GALERI
   ═══════════════════════════════════════════════ */

export default function GaleriBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handle file input ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Handle submit ──
  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Judul foto tidak boleh kosong.");
      return;
    }
    if (!imageFile) {
      setError("Silakan pilih file foto untuk diupload.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload gambar ke Supabase Storage
      const imageUrl = await uploadFile(imageFile, "gallery", "photos");
      if (!imageUrl) {
        setError("Gagal mengupload foto. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // 2. Insert ke database
      const supabase = createClient();
      const { error: insertError } = await supabase.from("gallery").insert({
        title,
        image_url: imageUrl,
        caption: caption || null,
        is_featured: featured,
      });

      if (insertError) {
        setError(`Gagal menyimpan data galeri: ${insertError.message}`);
        setIsLoading(false);
        return;
      }

      alert("Foto berhasil diupload!");
      router.push("/admin/galeri");
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/galeri"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Upload Foto Galeri
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Tambahkan dokumentasi foto kegiatan TEKAD UNM
          </p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        <div className="space-y-6 p-5 sm:p-6">
          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              File Foto <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview foto"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <Camera className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Klik untuk pilih foto
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      PNG, JPG, WEBP (maks 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <Upload className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
              <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                {imageFile ? imageFile.name : "Pilih File Foto"}
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

          {/* Judul Foto */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Judul Foto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pelantikan Pengurus 2025/2026"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Tulis deskripsi singkat tentang foto ini (opsional)..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Featured Checkbox */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/30">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <Star className={`h-4 w-4 ${featured ? "text-amber-500" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Jadikan Featured
                </p>
                <p className="text-xs text-gray-500">
                  Foto ini akan ditampilkan di halaman utama
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/galeri"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Upload Foto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

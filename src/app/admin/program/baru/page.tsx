"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  BookOpen,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

/* ═══════════════════════════════════════════════
   FORM TAMBAH PROGRAM KERJA
   ═══════════════════════════════════════════════ */

export default function ProgramBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
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
      setError("Nama program tidak boleh kosong.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi program tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl: string | null = null;

      // 1. Upload thumbnail jika ada
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, "programs", "thumbnails");
        if (!imageUrl) {
          setError("Gagal mengupload gambar. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }
      }

      // 2. Insert ke database
      const supabase = createClient();
      const { error: insertError } = await supabase.from("programs").insert({
        title,
        description,
        image_url: imageUrl,
        is_active: isActive,
      });

      if (insertError) {
        setError(`Gagal menyimpan program: ${insertError.message}`);
        setIsLoading(false);
        return;
      }

      alert("Program berhasil ditambahkan!");
      router.push("/admin/program");
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
          href="/admin/program"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Tambah Program Kerja
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Tambahkan program baru yang akan ditampilkan di halaman publik
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
          {/* Nama Program */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BookOpen className="h-4 w-4 text-gray-400" />
              Nama Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pelatihan Jurnalistik Digital"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Deskripsi Program <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Jelaskan tujuan dan manfaat program ini secara singkat..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon className="h-4 w-4 text-gray-400" />
              Thumbnail Program
            </label>
            <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview thumbnail"
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
                    <ImageIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Klik untuk pilih gambar
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
                {imageFile ? imageFile.name : "Pilih File Thumbnail"}
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

          {/* Status Toggle */}
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/30">
            <div className="flex items-center gap-3">
              {isActive ? (
                <ToggleRight className="h-5 w-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Status Aktif
                </p>
                <p className="text-xs text-gray-500">
                  {isActive
                    ? "Program ini akan ditampilkan di halaman publik"
                    : "Program ini tidak akan terlihat di publik"}
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-emerald-500" />
              <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/program"
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
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Simpan Program
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

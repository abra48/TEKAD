"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, Camera, X, Loader2, AlertCircle, Star, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

export default function GaleriBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) { const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file); } else { setImagePreview(null); }
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) { setError("Judul foto tidak boleh kosong."); return; }
    if (!imageFile) { setError("Silakan pilih file foto untuk diupload."); return; }
    setIsLoading(true);
    try {
      const imageUrl = await uploadFile(imageFile, "gallery", "photos");
      const supabase = createClient();
      const { error: insertError } = await supabase.from("gallery").insert({ title, image_url: imageUrl, caption: caption || null, is_featured: featured });
      if (insertError) throw new Error(insertError.message);
      alert("Foto berhasil diupload!");
      router.push("/admin/galeri");
    } catch (err: any) {
      setError(`Gagal: ${err?.message || "Terjadi kesalahan."}`);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/galeri" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-300">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Upload Foto Galeri</h1>
          <p className="mt-0.5 text-xs text-gray-500">Tambahkan dokumentasi foto kegiatan</p>
        </div>
      </div>

      {error && (<div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" /><p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p></div>)}

      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">File Foto <span className="text-red-500">*</span></label>
            <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              {imagePreview ? (<><Image src={imagePreview} alt="Preview" fill className="object-cover" /><button type="button" onClick={clearImage} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"><X className="h-4 w-4" /></button></>) : (
                <div className="flex h-full flex-col items-center justify-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10"><Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><div className="text-center"><p className="text-xs font-medium text-gray-400">Klik untuk pilih foto</p><p className="mt-0.5 text-[10px] text-gray-300 dark:text-gray-600">PNG, JPG, WEBP (maks 5MB)</p></div></div>
              )}
            </div>
            <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5">
              <Upload className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 dark:group-hover:text-blue-300">{imageFile ? imageFile.name : "Pilih File Foto"}</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Judul Foto <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Pelantikan Pengurus 2025/2026" className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} placeholder="Deskripsi singkat (opsional)..." className="admin-input w-full resize-none rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 transition hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20" />
            <Star className={`h-4 w-4 ${featured ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}`} />
            <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jadikan Featured</p><p className="text-[11px] text-gray-400">Ditampilkan di halaman utama</p></div>
          </label>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/admin/galeri" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Batal</Link>
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Mengupload...</>) : (<><CheckCircle2 className="h-4 w-4" /> Upload Foto</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

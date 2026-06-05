"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, CalendarDays, Clock, MapPin, FileText, X, Loader2, AlertCircle, CheckCircle2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

export default function KegiatanBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) { const r = new FileReader(); r.onloadend = () => setThumbnailPreview(r.result as string); r.readAsDataURL(file); } else { setThumbnailPreview(null); }
  };
  const clearThumbnail = () => { setThumbnailFile(null); setThumbnailPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) { setError("Nama kegiatan tidak boleh kosong."); return; }
    if (!eventDate) { setError("Tanggal kegiatan harus diisi."); return; }
    setIsLoading(true);
    try {
      let thumbnailUrl: string | null = null;
      if (thumbnailFile) thumbnailUrl = await uploadFile(thumbnailFile, "events", "thumbnails");
      const supabase = createClient();
      const { error: insertError } = await supabase.from("events").insert({ title, event_date: eventDate, event_time: eventTime || null, location: location || null, description: description || null, thumbnail_url: thumbnailUrl, is_published: true });
      if (insertError) throw new Error(insertError.message);
      alert("Kegiatan berhasil ditambahkan!");
      router.push("/admin/kegiatan");
    } catch (err: any) { setError(`Gagal: ${err?.message || "Terjadi kesalahan."}`); } finally { setIsLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/kegiatan" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-300"><ArrowLeft className="h-4 w-4" /></Link>
        <div><h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Tambah Kegiatan</h1><p className="mt-0.5 text-xs text-gray-500">Buat jadwal kegiatan baru</p></div>
      </div>

      {error && (<div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" /><p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p></div>)}

      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><CalendarDays className="h-3 w-3" /> Nama Kegiatan <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Workshop Jurnalistik Digital" className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><CalendarDays className="h-3 w-3" /> Tanggal <span className="text-red-500">*</span></label><input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" /></div>
            <div><label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><Clock className="h-3 w-3" /> Waktu</label><input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" /></div>
          </div>
          <div><label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><MapPin className="h-3 w-3" /> Lokasi</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Contoh: Aula Gedung PKM Lt. 2" className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" /></div>
          <div><label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><FileText className="h-3 w-3" /> Deskripsi</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Deskripsi kegiatan (opsional)..." className="admin-input w-full resize-none rounded-xl px-4 py-2.5 text-sm" /></div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><ImageIcon className="h-3 w-3" /> Thumbnail</label>
            <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              {thumbnailPreview ? (<><Image src={thumbnailPreview} alt="Preview" fill className="object-cover" /><button type="button" onClick={clearThumbnail} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"><X className="h-4 w-4" /></button></>) : (
                <div className="flex h-full flex-col items-center justify-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10"><ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><p className="text-xs text-gray-400">Klik untuk pilih gambar</p></div>
              )}
            </div>
            <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5">
              <Upload className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" /><span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 dark:group-hover:text-blue-300">{thumbnailFile ? thumbnailFile.name : "Pilih File Thumbnail"}</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>
        </div>
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/admin/kegiatan" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Batal</Link>
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>) : (<><CheckCircle2 className="h-4 w-4" /> Simpan Kegiatan</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

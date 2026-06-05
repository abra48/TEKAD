"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Camera, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminGaleriPage() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGaleri() {
      const supabase = createClient();
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (error) console.error("Fetch gallery error:", error);
      setGaleri(data ?? []);
      setIsLoading(false);
    }
    fetchGaleri();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) { alert(`Gagal menghapus: ${error.message}`); return; }
    setGaleri((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (<div className="flex min-h-[400px] flex-col items-center justify-center gap-3"><Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" /><p className="text-sm text-gray-400">Memuat galeri...</p></div>);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Galeri Kegiatan</h1>
          <p className="mt-1 text-sm text-gray-500">{galeri.length} foto dokumentasi kegiatan</p>
        </div>
        <Link href="/admin/galeri/baru" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Upload Foto
        </Link>
      </div>

      {galeri.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"><Camera className="h-6 w-6 text-gray-400" /></div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400">Belum ada foto</p>
            <Link href="/admin/galeri/baru" className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Upload foto pertama →</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galeri.map((foto) => (
            <div key={foto.id} className="group overflow-hidden rounded-2xl border border-gray-200/60 bg-white transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {foto.image_url ? (
                  <Image src={foto.image_url} alt={foto.title || "Foto galeri"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Camera className="h-6 w-6 text-gray-300 dark:text-gray-600" /></div>
                )}
                {foto.is_featured && (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    <Star className="h-2.5 w-2.5" /> Featured
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleDelete(foto.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/80 text-white transition-transform hover:scale-110">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{foto.title}</p>
                <p className="mt-1 text-[11px] text-gray-400">{formatDate(foto.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

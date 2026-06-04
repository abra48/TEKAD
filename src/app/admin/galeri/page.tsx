"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Camera,
  Star,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminGaleriPage() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGaleri() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

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
    if (error) {
      alert(`Gagal menghapus: ${error.message}`);
      return;
    }
    setGaleri((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
        <p className="text-sm text-slate-500">Memuat galeri...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Galeri Kegiatan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {galeri.length} foto dokumentasi kegiatan
          </p>
        </div>
        <Link
          href="/admin/galeri/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Upload Foto
        </Link>
      </div>

      {/* Content */}
      {galeri.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03]">
            <Camera className="h-6 w-6 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">Belum ada foto</p>
            <Link href="/admin/galeri/baru" className="mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300">
              Upload foto pertama →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galeri.map((foto) => (
            <div
              key={foto.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-200">
                {foto.image_url ? (
                  <Image
                    src={foto.image_url}
                    alt={foto.title || "Foto galeri"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Camera className="h-6 w-6 text-slate-700" />
                  </div>
                )}

                {/* Featured badge */}
                {foto.is_featured && (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    <Star className="h-2.5 w-2.5" />
                    Featured
                  </div>
                )}

                {/* Delete overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(foto.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/80 text-white transition-transform hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="truncate text-sm font-semibold text-slate-200">
                  {foto.title}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {formatDate(foto.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

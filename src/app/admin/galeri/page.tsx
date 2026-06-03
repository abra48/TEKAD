"use client";

import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Camera,
  Star,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════════ */

const dummyGaleri = [
  {
    id: 1,
    title: "Pelantikan Pengurus 2025/2026",
    kegiatan: "Organisasi",
    is_featured: true,
    date: "12 Apr 2025",
    color: "from-blue-200 to-blue-300",
  },
  {
    id: 2,
    title: "Workshop Jurnalistik Digital",
    kegiatan: "Pelatihan",
    is_featured: false,
    date: "28 Mar 2025",
    color: "from-sky-200 to-indigo-300",
  },
  {
    id: 3,
    title: "Kunjungan Redaksi Media Nasional",
    kegiatan: "Studi Lapangan",
    is_featured: true,
    date: "15 Mar 2025",
    color: "from-indigo-200 to-blue-300",
  },
  {
    id: 4,
    title: "Bakti Sosial Kampus",
    kegiatan: "Pengabdian",
    is_featured: false,
    date: "1 Mar 2025",
    color: "from-slate-200 to-gray-300",
  },
  {
    id: 5,
    title: "Lomba Karya Tulis Ilmiah",
    kegiatan: "Kompetisi",
    is_featured: false,
    date: "20 Feb 2025",
    color: "from-blue-200 to-slate-300",
  },
  {
    id: 6,
    title: "Rapat Kerja Tahunan TEKAD",
    kegiatan: "Internal",
    is_featured: false,
    date: "10 Feb 2025",
    color: "from-gray-200 to-blue-200",
  },
];

/* ═══════════════════════════════════════════════
   KELOLA GALERI PAGE
   ═══════════════════════════════════════════════ */

export default function AdminGaleriPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Manajemen Galeri Kegiatan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload, edit, dan kelola foto dokumentasi kegiatan
          </p>
        </div>
        <Link
          href="/admin/galeri/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Upload Foto
        </Link>
      </div>

      {/* ── Grid View ── */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {dummyGaleri.map((foto) => (
          <div
            key={foto.id}
            className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/5"
          >
            {/* Image placeholder */}
            <div
              className={`relative aspect-[4/3] bg-gradient-to-br ${foto.color}`}
            >
              {/* Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              {/* Center icon */}
              <div className="flex h-full items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Camera className="h-5 w-5 text-blue-500" />
                </div>
              </div>

              {/* Featured badge */}
              {foto.is_featured && (
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Star className="h-3 w-3" />
                  Featured
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                {foto.title}
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {foto.kegiatan}
                </span>
                <span className="text-xs text-gray-400">{foto.date}</span>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <div className="h-5 w-px bg-gray-100" />
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer info ── */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Menampilkan {dummyGaleri.length} foto •{" "}
          {dummyGaleri.filter((f) => f.is_featured).length} featured
        </span>
        <button className="font-semibold text-blue-600 transition-colors hover:text-blue-800">
          Muat Lebih Banyak →
        </button>
      </div>
    </div>
  );
}

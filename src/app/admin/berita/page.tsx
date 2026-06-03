"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Newspaper,
  MoreVertical,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════════ */

const dummyBerita = [
  {
    id: 1,
    title: "Pelantikan Pengurus TEKAD Periode 2025/2026 Resmi Digelar",
    category: "Organisasi",
    status: "published" as const,
    date: "12 Apr 2025",
    author: "Redaksi",
  },
  {
    id: 2,
    title: "Workshop Jurnalistik: Menulis Berita yang Berdampak",
    category: "Akademik",
    status: "draft" as const,
    date: "28 Mar 2025",
    author: "Andi P.",
  },
  {
    id: 3,
    title: "TEKAD Raih Juara 2 LKTI Tingkat Regional Sulawesi Selatan",
    category: "Prestasi",
    status: "published" as const,
    date: "15 Mar 2025",
    author: "Budi S.",
  },
  {
    id: 4,
    title: "Rapat Koordinasi Divisi Semester Genap 2025",
    category: "Internal",
    status: "archived" as const,
    date: "10 Mar 2025",
    author: "Admin",
  },
];

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  draft: "bg-gray-100 text-gray-600 ring-gray-500/10",
  archived: "bg-amber-50 text-amber-700 ring-amber-600/10",
};

const statusLabel = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

/* ═══════════════════════════════════════════════
   KELOLA BERITA PAGE
   ═══════════════════════════════════════════════ */

export default function AdminBeritaPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyBerita.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari artikel..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
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
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors duration-150 hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Newspaper className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          oleh {item.author}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[item.status]
                      }`}
                    >
                      {statusLabel[item.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        title="Edit"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        title="Hapus"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        title="Lainnya"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-500">
            Menampilkan {filtered.length} dari {dummyBerita.length} artikel
          </p>
          <div className="flex gap-1">
            {[1, 2].map((p) => (
              <button
                key={p}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                  p === 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

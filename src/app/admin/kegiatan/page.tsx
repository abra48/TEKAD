"use client";

import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  MoreVertical,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════════ */

const dummyKegiatan = [
  {
    id: 1,
    title: "Pelatihan Desain Grafis dengan Canva & Figma",
    date: "28 Jun 2025",
    time: "09:00 – 15:00 WITA",
    location: "Lab Komputer FEB",
    status: "published" as const,
  },
  {
    id: 2,
    title: "Rapat Koordinasi Divisi Semester Genap",
    date: "14 Jun 2025",
    time: "13:00 – 16:00 WITA",
    location: "Ruang Rapat PKM Lt. 2",
    status: "published" as const,
  },
  {
    id: 3,
    title: "Workshop Fotografi & Videografi Mobile",
    date: "20 Jul 2025",
    time: "08:30 – 16:00 WITA",
    location: "Aula Gedung PKM",
    status: "draft" as const,
  },
  {
    id: 4,
    title: "Kunjungan Industri ke Kantor Media Lokal",
    date: "5 Agt 2025",
    time: "09:00 – 12:00 WITA",
    location: "Kantor Media Makassar",
    status: "draft" as const,
  },
];

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  draft: "bg-gray-100 text-gray-600 ring-gray-500/10",
};

const statusLabel = {
  published: "Published",
  draft: "Draft",
};

/* ═══════════════════════════════════════════════
   KELOLA KEGIATAN PAGE
   ═══════════════════════════════════════════════ */

export default function AdminKegiatanPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Agenda & Jadwal Kegiatan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola jadwal kegiatan dan acara TEKAD UNM
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Tambah Kegiatan
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama Kegiatan
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tanggal & Waktu
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Lokasi
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dummyKegiatan.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors duration-150 hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                        {item.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-sm text-gray-700">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                        {item.date}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {item.location}
                    </p>
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
            Total {dummyKegiatan.length} kegiatan
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {dummyKegiatan.filter((k) => k.status === "published").length}{" "}
              Published
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-300" />
              {dummyKegiatan.filter((k) => k.status === "draft").length} Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

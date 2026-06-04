"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminKegiatanPage() {
  const [kegiatan, setKegiatan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKegiatan() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Fetch events error:", error);
      setKegiatan(data ?? []);
      setIsLoading(false);
    }
    fetchKegiatan();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { alert(`Gagal menghapus: ${error.message}`); return; }
    setKegiatan((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
        <p className="text-sm text-slate-500">Memuat kegiatan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Agenda & Kegiatan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {kegiatan.length} kegiatan terdaftar
          </p>
        </div>
        <Link
          href="/admin/kegiatan/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tambah Kegiatan
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Nama Kegiatan
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Tanggal
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Lokasi
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {kegiatan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-600">
                    Belum ada kegiatan. Klik &quot;Tambah Kegiatan&quot; untuk membuat.
                  </td>
                </tr>
              ) : (
                kegiatan.map((item) => {
                  const published = item.is_published;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                          <p className="text-sm font-semibold text-slate-200">
                            {item.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 text-sm text-slate-300">
                            <CalendarDays className="h-3 w-3 text-slate-600" />
                            {formatDate(item.event_date)}
                          </p>
                          {item.event_time && (
                            <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
                              <Clock className="h-2.5 w-2.5" />
                              {item.event_time}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1.5 text-sm text-slate-400">
                          <MapPin className="h-3 w-3 text-slate-600" />
                          {item.location || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            published
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.04] text-slate-500"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-400" : "bg-slate-600"}`} />
                          {published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          title="Hapus"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.04] px-6 py-3">
          <p className="text-[11px] text-slate-600">
            Total {kegiatan.length} kegiatan
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {kegiatan.filter((k) => k.is_published).length} Published
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              {kegiatan.filter((k) => !k.is_published).length} Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface Program {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  is_active: boolean;
  created_at?: string;
}

/* ═══════════════════════════════════════════════
   ADMIN PROGRAM PAGE
   ═══════════════════════════════════════════════ */

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Fetch programs
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching programs:", error);
      } else {
        setPrograms(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Filter programs by search
  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Kelola Program
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Tambah, edit, dan kelola program yang ditampilkan di halaman publik.
          </p>
        </div>
        <button
          onClick={() =>
            alert("Form tambah program segera hadir")
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tambah Program
        </button>
      </div>

      {/* ── Search & Actions Bar ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button
          onClick={fetchPrograms}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Program
                </th>
                <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                  Deskripsi
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Status
                </th>
                <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell sm:px-6">
                  Tanggal
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                /* Loading skeleton */
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <div className="h-4 w-48 rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-6 w-16 rounded-full bg-gray-200" />
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <div className="h-4 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-8 w-8 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center sm:px-6"
                  >
                    <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-400">
                      {searchQuery
                        ? "Tidak ada program yang cocok dengan pencarian."
                        : "Belum ada program. Tambahkan program pertama Anda!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((program) => (
                  <tr
                    key={program.id}
                    className="group transition-colors hover:bg-gray-50/80"
                  >
                    {/* Program Title */}
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {program.title}
                          </p>
                          {/* Show description on mobile */}
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-400 sm:hidden">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Description (hidden on mobile) */}
                    <td className="hidden max-w-xs px-4 py-4 sm:table-cell sm:px-6">
                      <p className="line-clamp-2 text-sm text-gray-500">
                        {program.description}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 text-center sm:px-6">
                      {program.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                          <XCircle className="h-3 w-3" />
                          <span className="hidden sm:inline">Nonaktif</span>
                        </span>
                      )}
                    </td>
                    {/* Date (hidden on small screens) */}
                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <span className="text-sm text-gray-500">
                        {formatDate(program.created_at)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4 text-center sm:px-6">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === program.id ? null : program.id
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {/* Dropdown */}
                        {activeMenu === program.id && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200/80 bg-white py-1 shadow-xl shadow-gray-900/10">
                            <button
                              onClick={() =>
                                alert("Fitur lihat program segera hadir")
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                              Lihat
                            </button>
                            <button
                              onClick={() =>
                                alert("Fitur edit program segera hadir")
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                alert("Fitur hapus program segera hadir")
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">
                {programs.length}
              </span>{" "}
              program
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

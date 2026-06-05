"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
  AlertCircle,
  EyeOff,
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

  // Modal states
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<Program | null>(null);
  const [editTarget, setEditTarget] = useState<Program | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

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

  // Filter programs by search and status
  const filtered = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.is_active) ||
      (statusFilter === "draft" && !p.is_active);
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── Toggle active/draft ──
  const handleToggleStatus = async (program: Program) => {
    setToggleLoading(program.id);
    setActiveMenu(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("programs")
        .update({ is_active: !program.is_active })
        .eq("id", program.id);

      if (error) throw error;

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === program.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Gagal mengubah status program.");
    } finally {
      setToggleLoading(null);
    }
  };

  // ── Delete program ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus program.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Open edit modal ──
  const openEditModal = (program: Program) => {
    setEditTarget(program);
    setEditTitle(program.title);
    setEditDescription(program.description);
    setEditIsActive(program.is_active);
    setEditError(null);
    setActiveMenu(null);
  };

  // ── Save edit ──
  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setEditError(null);

    if (!editTitle.trim()) {
      setEditError("Nama program tidak boleh kosong.");
      return;
    }
    if (!editDescription.trim()) {
      setEditError("Deskripsi program tidak boleh kosong.");
      return;
    }

    setEditLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("programs")
        .update({
          title: editTitle.trim(),
          description: editDescription.trim(),
          is_active: editIsActive,
        })
        .eq("id", editTarget.id);

      if (error) throw error;

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? {
                ...p,
                title: editTitle.trim(),
                description: editDescription.trim(),
                is_active: editIsActive,
              }
            : p
        )
      );
      setEditTarget(null);
    } catch (err) {
      console.error("Edit error:", err);
      setEditError("Gagal menyimpan perubahan.");
    } finally {
      setEditLoading(false);
    }
  };

  // Stats
  const activeCount = programs.filter((p) => p.is_active).length;
  const draftCount = programs.filter((p) => !p.is_active).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              Kelola Program
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Tambah, edit, dan kelola program yang ditampilkan di halaman publik.
          </p>
        </div>
        <Link
          href="/admin/program/baru"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tambah Program
        </Link>
      </div>

      {/* ── Stats Cards ── */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "all" ? "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "all" ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>{programs.length}</p>
          <p className="text-[11px] font-medium text-gray-500">Semua</p>
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "active" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>{activeCount}</p>
          <p className="text-[11px] font-medium text-gray-500">Aktif</p>
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "draft" ? "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "draft" ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>{draftCount}</p>
          <p className="text-[11px] font-medium text-gray-500">Draf</p>
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
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <button
          onClick={fetchPrograms}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
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
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                /* Loading skeleton */
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <div className="h-4 w-48 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center sm:px-6"
                  >
                    <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
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
                    className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                  >
                    {/* Program Title */}
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-500/10 dark:to-blue-500/20 dark:text-blue-400">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
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
                      {toggleLoading === program.id ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800">
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </span>
                      ) : program.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <EyeOff className="h-3 w-3" />
                          <span className="hidden sm:inline">Draf</span>
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {/* Dropdown */}
                        {activeMenu === program.id && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200/80 bg-white py-1 shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-800">
                            <button
                              onClick={() => {
                                setViewTarget(program);
                                setActiveMenu(null);
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                              Lihat Detail
                            </button>
                            <button
                              onClick={() => openEditModal(program)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit Program
                            </button>
                            <button
                              onClick={() => handleToggleStatus(program)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              {program.is_active ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Jadikan Draf
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  Publish
                                </>
                              )}
                            </button>
                            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                            <button
                              onClick={() => {
                                setDeleteTarget(program);
                                setActiveMenu(null);
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
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
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30 sm:px-6">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {programs.length}
              </span>{" "}
              program
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
         MODAL: VIEW DETAIL
         ═══════════════════════════════════════════════ */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)}>
          <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Detail Program</h2>
              </div>
              <button onClick={() => setViewTarget(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Nama Program</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{viewTarget.title}</p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Deskripsi</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{viewTarget.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</p>
                  {viewTarget.is_active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Aktif (Published)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      <EyeOff className="h-3 w-3" /> Draf
                    </span>
                  )}
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Dibuat</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(viewTarget.created_at)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800/30">
              <button onClick={() => { openEditModal(viewTarget); setViewTarget(null); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => setViewTarget(null)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
         MODAL: DELETE CONFIRMATION
         ═══════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteTarget(null)}>
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Program?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Program <strong className="text-gray-700 dark:text-gray-300">&quot;{deleteTarget.title}&quot;</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {deleteLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</>
                ) : (
                  <><Trash2 className="h-4 w-4" /> Hapus</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
         MODAL: EDIT PROGRAM
         ═══════════════════════════════════════════════ */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !editLoading && setEditTarget(null)}>
          <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Program</h2>
              </div>
              <button onClick={() => setEditTarget(null)} disabled={editLoading} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {editError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">{editError}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Status Toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {editIsActive ? (
                    <ToggleRight className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {editIsActive ? "Publish (Aktif)" : "Draf (Nonaktif)"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {editIsActive
                        ? "Program ditampilkan di halaman publik"
                        : "Program disembunyikan dari publik"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-emerald-500 dark:bg-gray-600" />
                  <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
              <button
                onClick={() => setEditTarget(null)}
                disabled={editLoading}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
              >
                {editLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

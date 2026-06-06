"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  Loader2,
  MoreVertical,
  Eye,
  Edit3,
  CheckCircle2,
  EyeOff,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Search,
  Upload,
  FileText,
  ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface Kegiatan {
  id: string;
  title: string;
  event_date: string;
  event_time?: string | null;
  location?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published: boolean;
  created_at?: string;
}

/* ═══════════════════════════════════════════════
   ADMIN KEGIATAN PAGE
   ═══════════════════════════════════════════════ */

export default function AdminKegiatanPage() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal states
  const [deleteTarget, setDeleteTarget] = useState<Kegiatan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<Kegiatan | null>(null);
  const [editTarget, setEditTarget] = useState<Kegiatan | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublished, setEditIsPublished] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  // Thumbnail edit states
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [editThumbnailPreview, setEditThumbnailPreview] = useState<string | null>(null);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch kegiatan
  const fetchKegiatan = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setKegiatan(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Filter kegiatan by search and status
  const filtered = kegiatan.filter((k) => {
    const matchesSearch =
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && k.is_published) ||
      (statusFilter === "draft" && !k.is_published);
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

  // ── Toggle publish/draft ──
  const handleToggleStatus = async (item: Kegiatan) => {
    setToggleLoading(item.id);
    setActiveMenu(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("events")
        .update({ is_published: !item.is_published })
        .eq("id", item.id);

      if (error) throw error;

      setKegiatan((prev) =>
        prev.map((k) =>
          k.id === item.id ? { ...k, is_published: !k.is_published } : k
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Gagal mengubah status kegiatan.");
    } finally {
      setToggleLoading(null);
    }
  };

  // ── Delete kegiatan ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setKegiatan((prev) => prev.filter((k) => k.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus kegiatan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Open edit modal ──
  const openEditModal = (item: Kegiatan) => {
    setEditTarget(item);
    setEditTitle(item.title);
    setEditDate(item.event_date || "");
    setEditTime(item.event_time || "");
    setEditLocation(item.location || "");
    setEditDescription(item.description || "");
    setEditIsPublished(item.is_published);
    setEditThumbnailUrl(item.thumbnail_url || null);
    setEditThumbnailFile(null);
    setEditThumbnailPreview(null);
    setEditError(null);
    setActiveMenu(null);
  };

  // ── Handle edit thumbnail file ──
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditThumbnailFile(file);
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setEditThumbnailPreview(r.result as string);
      r.readAsDataURL(file);
    } else {
      setEditThumbnailPreview(null);
    }
  };

  const clearEditThumbnail = () => {
    setEditThumbnailFile(null);
    setEditThumbnailPreview(null);
    setEditThumbnailUrl(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  // ── Save edit ──
  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setEditError(null);

    if (!editTitle.trim()) {
      setEditError("Nama kegiatan tidak boleh kosong.");
      return;
    }
    if (!editDate) {
      setEditError("Tanggal kegiatan harus diisi.");
      return;
    }

    setEditLoading(true);
    try {
      let thumbnailUrl = editThumbnailUrl;

      // Upload new thumbnail if changed
      if (editThumbnailFile) {
        thumbnailUrl = await uploadFile(editThumbnailFile, "events", "thumbnails");
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("events")
        .update({
          title: editTitle.trim(),
          event_date: editDate,
          event_time: editTime || null,
          location: editLocation.trim() || null,
          description: editDescription.trim() || null,
          thumbnail_url: thumbnailUrl,
          is_published: editIsPublished,
        })
        .eq("id", editTarget.id);

      if (error) throw error;

      setKegiatan((prev) =>
        prev.map((k) =>
          k.id === editTarget.id
            ? {
                ...k,
                title: editTitle.trim(),
                event_date: editDate,
                event_time: editTime || null,
                location: editLocation.trim() || null,
                description: editDescription.trim() || null,
                thumbnail_url: thumbnailUrl,
                is_published: editIsPublished,
              }
            : k
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
  const publishedCount = kegiatan.filter((k) => k.is_published).length;
  const draftCount = kegiatan.filter((k) => !k.is_published).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              Agenda & Kegiatan
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Tambah, edit, dan kelola kegiatan yang ditampilkan di halaman publik.
          </p>
        </div>
        <Link
          href="/admin/kegiatan/baru"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tambah Kegiatan
        </Link>
      </div>

      {/* ── Stats Cards ── */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "all" ? "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "all" ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>{kegiatan.length}</p>
          <p className="text-[11px] font-medium text-gray-500">Semua</p>
        </button>
        <button
          onClick={() => setStatusFilter("published")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "published" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "published" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>{publishedCount}</p>
          <p className="text-[11px] font-medium text-gray-500">Published</p>
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          className={`rounded-xl border p-3 text-center transition-all ${statusFilter === "draft" ? "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"}`}
        >
          <p className={`text-2xl font-bold ${statusFilter === "draft" ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>{draftCount}</p>
          <p className="text-[11px] font-medium text-gray-500">Draft</p>
        </button>
      </div>

      {/* ── Search & Refresh ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <button
          onClick={fetchKegiatan}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Nama Kegiatan
                </th>
                <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                  Tanggal
                </th>
                <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell sm:px-6">
                  Lokasi
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Status
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                /* Loading skeleton */
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="mx-auto h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center sm:px-6">
                    <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-400">
                      {searchQuery
                        ? "Tidak ada kegiatan yang cocok dengan pencarian."
                        : "Belum ada kegiatan. Tambahkan kegiatan pertama Anda!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                  >
                    {/* Title */}
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-500/10 dark:to-blue-500/20 dark:text-blue-400">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          {/* Show date & location on mobile */}
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-400 sm:hidden">
                            {formatDate(item.event_date)} {item.location ? `· ${item.location}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Date (hidden on mobile) */}
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                        <CalendarDays className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                        {formatDate(item.event_date)}
                      </p>
                      {item.event_time && (
                        <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Clock className="h-2.5 w-2.5" />
                          {item.event_time}
                        </p>
                      )}
                    </td>
                    {/* Location (hidden on small) */}
                    <td className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <p className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                        {item.location || "-"}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 text-center sm:px-6">
                      {toggleLoading === item.id ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800">
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </span>
                      ) : item.is_published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <EyeOff className="h-3 w-3" />
                          <span className="hidden sm:inline">Draft</span>
                        </span>
                      )}
                    </td>
                    {/* Actions — 3-dot menu */}
                    <td className="px-4 py-4 text-center sm:px-6">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === item.id ? null : item.id
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {/* Dropdown */}
                        {activeMenu === item.id && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200/80 bg-white py-1 shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-800">
                            <button
                              onClick={() => {
                                setViewTarget(item);
                                setActiveMenu(null);
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                              Lihat Detail
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit Kegiatan
                            </button>
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              {item.is_published ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Jadikan Draft
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
                                setDeleteTarget(item);
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
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30 sm:px-6">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {kegiatan.length}
              </span>{" "}
              kegiatan
            </p>
            <div className="flex items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {publishedCount} Published
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                {draftCount} Draft
              </span>
            </div>
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
                  <CalendarDays className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Detail Kegiatan</h2>
              </div>
              <button onClick={() => setViewTarget(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail preview */}
            {viewTarget.thumbnail_url && (
              <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
                <Image src={viewTarget.thumbnail_url} alt={viewTarget.title} fill className="object-cover" />
              </div>
            )}

            <div className="space-y-4 p-6">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Nama Kegiatan</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{viewTarget.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tanggal</p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarDays className="h-3 w-3 text-gray-400" />
                    {formatDate(viewTarget.event_date)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Waktu</p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3 text-gray-400" />
                    {viewTarget.event_time || "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Lokasi</p>
                <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {viewTarget.location || "-"}
                </p>
              </div>
              {viewTarget.description && (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Deskripsi</p>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{viewTarget.description}</p>
                </div>
              )}
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</p>
                {viewTarget.is_published ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                )}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Kegiatan?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Kegiatan <strong className="text-gray-700 dark:text-gray-300">&quot;{deleteTarget.title}&quot;</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
         MODAL: EDIT KEGIATAN
         ═══════════════════════════════════════════════ */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !editLoading && setEditTarget(null)}>
          <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Kegiatan</h2>
              </div>
              <button onClick={() => setEditTarget(null)} disabled={editLoading} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              {editError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">{editError}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nama Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Waktu
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Contoh: Aula Gedung PKM Lt. 2"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Deskripsi
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi kegiatan (opsional)..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Thumbnail
                </label>
                <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  {editThumbnailPreview || editThumbnailUrl ? (
                    <>
                      <Image src={editThumbnailPreview || editThumbnailUrl!} alt="Preview" fill className="object-cover" />
                      <button type="button" onClick={clearEditThumbnail} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80">
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                      <p className="text-xs text-gray-400">Belum ada thumbnail</p>
                    </div>
                  )}
                </div>
                <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5">
                  <Upload className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    {editThumbnailFile ? editThumbnailFile.name : "Ganti Thumbnail"}
                  </span>
                  <input ref={editFileInputRef} type="file" accept="image/*" onChange={handleEditFileChange} className="sr-only" />
                </label>
              </div>

              {/* Status Toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {editIsPublished ? (
                    <ToggleRight className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {editIsPublished ? "Published (Aktif)" : "Draft (Nonaktif)"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {editIsPublished
                        ? "Kegiatan ditampilkan di halaman publik"
                        : "Kegiatan disembunyikan dari publik"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={editIsPublished}
                    onChange={(e) => setEditIsPublished(e.target.checked)}
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

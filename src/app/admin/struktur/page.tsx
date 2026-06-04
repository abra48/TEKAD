"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Users,
  Upload,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
  Crown,
  User,
  Globe,
  AtSign,
  Film,
  Play,
  ImagePlus,
  AlertCircle,
  Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface OrgMember {
  id: string;
  name: string;
  role: string;
  division: string;
  image_url: string | null;
}

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const DIVISIONS = [
  { key: "Pusat", label: "Pembina / Pusat", icon: Crown, color: "amber" },
  { key: "Website", label: "Divisi Website", icon: Globe, color: "blue" },
  { key: "Instagram", label: "Divisi Instagram", icon: AtSign, color: "pink" },
  { key: "TikTok", label: "Divisi TikTok", icon: Film, color: "slate" },
  { key: "YouTube", label: "Divisi YouTube", icon: Play, color: "red" },
];

const ROLES = ["Pembina", "Penanggung Jawab", "Anggota"];

const colorMap: Record<string, { bg: string; text: string; ring: string; badge: string; light: string }> = {
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", badge: "bg-amber-100 text-amber-800", light: "from-amber-50 to-yellow-50" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", badge: "bg-blue-100 text-blue-800", light: "from-blue-50 to-sky-50" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200", badge: "bg-pink-100 text-pink-800", light: "from-pink-50 to-purple-50" },
  slate: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200", badge: "bg-slate-100 text-slate-800", light: "from-slate-50 to-gray-50" },
  red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", badge: "bg-red-100 text-red-800", light: "from-red-50 to-orange-50" },
};

/* ═══════════════════════════════════════════════
   ADMIN STRUKTUR PAGE
   ═══════════════════════════════════════════════ */

export default function AdminStrukturPage() {
  const supabase = createClient();

  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<OrgMember | null>(null);
  const [formData, setFormData] = useState({ name: "", role: ROLES[0], division: DIVISIONS[0].key });

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ── Fetch ── */
  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("org_structure")
        .select("*")
        .order("division")
        .order("role")
        .order("name");

      if (error) throw error;
      setMembers(data as OrgMember[]);
    } catch (err: unknown) {
      console.error(err);
      setError("Gagal memuat data anggota.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Auto-clear messages ── */
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  /* ── Upload Photo ── */
  async function handlePhotoUpload(memberId: string, file: File) {
    try {
      setUploading(memberId);
      setError(null);

      // Validate file
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar (JPG, PNG, WebP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }

      // Upload to storage
      const fileExt = file.name.split(".").pop() || "png";
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "");
      const filePath = `org-structure/${Date.now()}-${cleanName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(filePath);

      // Update database
      const { error: updateError } = await supabase
        .from("org_structure")
        .update({ image_url: publicUrl })
        .eq("id", memberId);

      if (updateError) throw updateError;

      // Update local state
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, image_url: publicUrl } : m))
      );

      setSuccess("Foto berhasil diupload!");
    } catch (err: unknown) {
      console.error(err);
      setError("Gagal mengupload foto. Pastikan bucket 'thumbnails' sudah ada.");
    } finally {
      setUploading(null);
    }
  }

  /* ── Add / Edit Member ── */
  async function handleSaveMember() {
    if (!formData.name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editMember) {
        // Update existing
        const { error } = await supabase
          .from("org_structure")
          .update({
            name: formData.name.trim(),
            role: formData.role,
            division: formData.division,
          })
          .eq("id", editMember.id);

        if (error) throw error;
        setSuccess("Anggota berhasil diperbarui!");
      } else {
        // Insert new
        const { error } = await supabase.from("org_structure").insert({
          name: formData.name.trim(),
          role: formData.role,
          division: formData.division,
          image_url: null,
        });

        if (error) throw error;
        setSuccess("Anggota baru berhasil ditambahkan!");
      }

      setModalOpen(false);
      setEditMember(null);
      setFormData({ name: "", role: ROLES[0], division: DIVISIONS[0].key });
      await fetchMembers();
    } catch (err: unknown) {
      console.error(err);
      setError("Gagal menyimpan data anggota.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete Member ── */
  async function handleDelete(id: string) {
    try {
      setSaving(true);
      const { error } = await supabase.from("org_structure").delete().eq("id", id);
      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setDeleteId(null);
      setSuccess("Anggota berhasil dihapus.");
    } catch (err: unknown) {
      console.error(err);
      setError("Gagal menghapus anggota.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Open Edit Modal ── */
  function openEditModal(member: OrgMember) {
    setEditMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      division: member.division,
    });
    setModalOpen(true);
  }

  /* ── Open Add Modal ── */
  function openAddModal() {
    setEditMember(null);
    setFormData({ name: "", role: ROLES[0], division: DIVISIONS[0].key });
    setModalOpen(true);
  }

  /* ── Filtered members ── */
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Toast Messages ── */}
      {success && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-lg animate-in slide-in-from-right">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg animate-in slide-in-from-right">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Struktur Organisasi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola anggota dan upload foto profil setiap anggota
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Tambah Anggota
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari anggota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-3 text-sm text-gray-400">Memuat data anggota…</p>
        </div>
      ) : (
        /* ── Division Groups ── */
        <div className="space-y-8">
          {DIVISIONS.map((div) => {
            const Icon = div.icon;
            const colors = colorMap[div.color];
            const divMembers = filteredMembers.filter(
              (m) => m.division === div.key
            );

            if (divMembers.length === 0 && search) return null;

            return (
              <div key={div.key} className="space-y-3">
                {/* Division Header */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${colors.text}`} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {div.label}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {divMembers.length} anggota
                    </p>
                  </div>
                </div>

                {/* Members Table/Cards */}
                {divMembers.length === 0 ? (
                  <div className={`rounded-xl border border-dashed border-gray-200 bg-gradient-to-br ${colors.light} p-6 text-center`}>
                    <Users className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-400">
                      Belum ada anggota di divisi ini
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {divMembers.map((member) => (
                      <div
                        key={member.id}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/5"
                      >
                        {/* Photo Section */}
                        <div className="relative flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 pb-4 pt-6">
                          {/* Avatar */}
                          <div className={`relative h-24 w-24 overflow-hidden rounded-full ring-4 ${colors.ring} shadow-lg`}>
                            {member.image_url ? (
                              <Image
                                src={member.image_url}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${colors.light}`}>
                                <User className={`h-10 w-10 ${colors.text} opacity-40`} />
                              </div>
                            )}

                            {/* Upload overlay */}
                            <button
                              onClick={() => fileInputRefs.current[member.id]?.click()}
                              disabled={uploading === member.id}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 hover:bg-black/50 group-hover:opacity-100"
                            >
                              {uploading === member.id ? (
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                              ) : (
                                <ImagePlus className="h-6 w-6 text-white" />
                              )}
                            </button>
                          </div>

                          {/* Hidden file input */}
                          <input
                            ref={(el) => { fileInputRefs.current[member.id] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(member.id, file);
                              e.target.value = "";
                            }}
                          />

                          {/* Role Badge */}
                          <span className={`absolute bottom-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                            {member.role}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-4 text-center">
                          <p className="text-sm font-semibold leading-snug text-gray-900">
                            {member.name}
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-gray-400">
                            {div.label}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex border-t border-gray-100">
                          <button
                            onClick={() => fileInputRefs.current[member.id]?.click()}
                            disabled={uploading === member.id}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            {uploading === member.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            Foto
                          </button>
                          <div className="w-px bg-gray-100" />
                          <button
                            onClick={() => openEditModal(member)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <div className="w-px bg-gray-100" />
                          <button
                            onClick={() => setDeleteId(member.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer info ── */}
      {!loading && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            Total {members.length} anggota • {DIVISIONS.length} divisi
          </span>
        </div>
      )}

      {/* ═══ ADD / EDIT MODAL ═══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editMember ? "Edit Anggota" : "Tambah Anggota Baru"}
              </h3>
              <button
                onClick={() => { setModalOpen(false); setEditMember(null); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Division */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Divisi
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role / Jabatan
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => { setModalOpen(false); setEditMember(null); }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMember}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {editMember ? "Simpan Perubahan" : "Tambah Anggota"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Hapus Anggota?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              Data anggota yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

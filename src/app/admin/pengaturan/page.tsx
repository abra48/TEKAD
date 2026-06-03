"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  ToggleLeft,
  Building2,
  Phone,
  Mail,
  AtSign,
  Film,
  Globe,
  FileText,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   PENGATURAN PAGE
   ═══════════════════════════════════════════════ */

export default function PengaturanPage() {
  const [pendaftaranOpen, setPendaftaranOpen] = useState(true);

  const [profil, setProfil] = useState({
    nama: "TEKAD UNM",
    tagline: "Tim Edukasi, Kreativitas, Aspirasi & Dedikasi",
    visi: "Menjadi pusat informasi dan penggerak media kreatif terdepan di lingkungan Administrasi Bisnis UNM yang profesional, inovatif, dan berdampak positif.",
    misi: "Menyajikan informasi akurat dan bermanfaat.\nMengembangkan keterampilan jurnalistik anggota.\nMengelola aset media digital secara profesional.",
    deskripsi:
      "Unit Kegiatan Mahasiswa Universitas Negeri Makassar yang bergerak di bidang jurnalistik dan media kampus.",
  });

  const [kontak, setKontak] = useState({
    email: "redaksi.tekad@unm.ac.id",
    whatsapp: "+6281234567890",
    instagram: "https://instagram.com/tekadunm",
    tiktok: "https://tiktok.com/@tekadunm",
    youtube: "https://youtube.com/@tekadunm",
  });

  const handleSave = () => {
    alert("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Pengaturan Website Organisasi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola konfigurasi dan informasi publik TEKAD UNM
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Save className="h-4 w-4" />
          Simpan Pengaturan
        </button>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ══════ Card 1: Status Pendaftaran ══════ */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ToggleLeft className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Status Pendaftaran
            </h2>
          </div>
          <div className="p-6">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition-colors hover:bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Buka Form Pendaftaran Anggota Baru
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Ketika diaktifkan, formulir pendaftaran di halaman{" "}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-[11px] font-mono">
                    /daftar
                  </code>{" "}
                  akan dapat diakses oleh publik. Nonaktifkan untuk menutup
                  pendaftaran.
                </p>
              </div>
              <div className="relative ml-4 shrink-0">
                <input
                  type="checkbox"
                  checked={pendaftaranOpen}
                  onChange={(e) => setPendaftaranOpen(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`h-7 w-12 rounded-full transition-colors ${
                    pendaftaranOpen ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`absolute left-[3px] top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${
                    pendaftaranOpen ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  pendaftaranOpen ? "bg-emerald-400" : "bg-gray-300"
                }`}
              />
              <span className="text-xs font-medium text-gray-500">
                Status:{" "}
                <span
                  className={
                    pendaftaranOpen ? "text-emerald-600" : "text-gray-500"
                  }
                >
                  {pendaftaranOpen ? "Dibuka" : "Ditutup"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ══════ Card 2: Profil Organisasi ══════ */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <Building2 className="h-4 w-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Profil Organisasi
            </h2>
          </div>
          <div className="space-y-5 p-6">
            {/* Nama */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                Nama Organisasi
              </label>
              <input
                type="text"
                value={profil.nama}
                onChange={(e) =>
                  setProfil({ ...profil, nama: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                Tagline
              </label>
              <input
                type="text"
                value={profil.tagline}
                onChange={(e) =>
                  setProfil({ ...profil, tagline: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="mb-1.5 text-sm font-semibold text-gray-700">
                Deskripsi Singkat
              </label>
              <textarea
                value={profil.deskripsi}
                onChange={(e) =>
                  setProfil({ ...profil, deskripsi: e.target.value })
                }
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Visi */}
            <div>
              <label className="mb-1.5 text-sm font-semibold text-gray-700">
                Visi
              </label>
              <textarea
                value={profil.visi}
                onChange={(e) =>
                  setProfil({ ...profil, visi: e.target.value })
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Misi */}
            <div>
              <label className="mb-1.5 text-sm font-semibold text-gray-700">
                Misi
              </label>
              <textarea
                value={profil.misi}
                onChange={(e) =>
                  setProfil({ ...profil, misi: e.target.value })
                }
                rows={4}
                placeholder="Pisahkan setiap poin misi dengan baris baru..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* ══════ Card 3: Kontak & Sosial Media ══════ */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <Phone className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Kontak & Sosial Media
            </h2>
          </div>
          <div className="space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={kontak.email}
                  onChange={(e) =>
                    setKontak({ ...kontak, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={kontak.whatsapp}
                  onChange={(e) =>
                    setKontak({ ...kontak, whatsapp: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Instagram */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <AtSign className="h-3.5 w-3.5 text-gray-400" />
                URL Instagram
              </label>
              <input
                type="url"
                value={kontak.instagram}
                onChange={(e) =>
                  setKontak({ ...kontak, instagram: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Film className="h-3.5 w-3.5 text-gray-400" />
                URL TikTok
              </label>
              <input
                type="url"
                value={kontak.tiktok}
                onChange={(e) =>
                  setKontak({ ...kontak, tiktok: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Globe className="h-3.5 w-3.5 text-gray-400" />
                URL YouTube
              </label>
              <input
                type="url"
                value={kontak.youtube}
                onChange={(e) =>
                  setKontak({ ...kontak, youtube: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* ── Save button (bottom) ── */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

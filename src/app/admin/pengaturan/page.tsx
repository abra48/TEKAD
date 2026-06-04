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

export default function PengaturanPage() {
  const [pendaftaranOpen, setPendaftaranOpen] = useState(true);

  const [profil, setProfil] = useState({
    nama: "TEKAD UNM",
    tagline: "Tim Edukasi, Kreativitas, Aspirasi & Dedikasi",
    visi: "Menjadi pusat informasi dan penggerak media kreatif terdepan di lingkungan Administrasi Bisnis UNM yang profesional, inovatif, dan berdampak positif.",
    misi: "Menyajikan informasi akurat dan bermanfaat.\nMengembangkan keterampilan jurnalistik anggota.\nMengelola aset media digital secara profesional.",
    deskripsi: "Unit Kegiatan Mahasiswa Universitas Negeri Makassar yang bergerak di bidang jurnalistik dan media kampus.",
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Pengaturan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Konfigurasi dan informasi publik TEKAD UNM
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <Save className="h-4 w-4" />
          Simpan
        </button>
      </div>

      <div className="mx-auto max-w-3xl space-y-5">
        {/* Status Pendaftaran */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
              <ToggleLeft className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Status Pendaftaran</h2>
          </div>
          <div className="p-6">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 transition hover:border-white/[0.08]">
              <div>
                <p className="text-sm font-semibold text-slate-200">Buka Form Pendaftaran</p>
                <p className="mt-1 text-xs text-slate-600">
                  Formulir di{" "}
                  <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-blue-400">/daftar</code>{" "}
                  akan dapat diakses publik.
                </p>
              </div>
              <div className="relative ml-4 shrink-0">
                <input type="checkbox" checked={pendaftaranOpen} onChange={(e) => setPendaftaranOpen(e.target.checked)} className="peer sr-only" />
                <div className={`h-7 w-12 rounded-full transition-colors ${pendaftaranOpen ? "bg-blue-500" : "bg-slate-700"}`} />
                <div className={`absolute left-[3px] top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${pendaftaranOpen ? "translate-x-5" : ""}`} />
              </div>
            </label>
            <div className="mt-3 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${pendaftaranOpen ? "bg-emerald-400" : "bg-slate-600"}`} />
              <span className="text-xs text-slate-500">
                Status:{" "}
                <span className={pendaftaranOpen ? "text-emerald-400" : "text-slate-500"}>
                  {pendaftaranOpen ? "Dibuka" : "Ditutup"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Profil Organisasi */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Profil Organisasi</h2>
          </div>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Building2 className="h-3 w-3" /> Nama Organisasi
              </label>
              <input type="text" value={profil.nama} onChange={(e) => setProfil({ ...profil, nama: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <FileText className="h-3 w-3" /> Tagline
              </label>
              <input type="text" value={profil.tagline} onChange={(e) => setProfil({ ...profil, tagline: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi Singkat</label>
              <textarea value={profil.deskripsi} onChange={(e) => setProfil({ ...profil, deskripsi: e.target.value })} rows={2} className="admin-input w-full resize-none rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Visi</label>
              <textarea value={profil.visi} onChange={(e) => setProfil({ ...profil, visi: e.target.value })} rows={3} className="admin-input w-full resize-none rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Misi</label>
              <textarea value={profil.misi} onChange={(e) => setProfil({ ...profil, misi: e.target.value })} rows={4} placeholder="Pisahkan setiap poin misi dengan baris baru..." className="admin-input w-full resize-none rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>
        </div>

        {/* Kontak & Sosial Media */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <h2 className="text-sm font-bold text-white">Kontak & Sosial Media</h2>
          </div>
          <div className="space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Mail className="h-3 w-3" /> Email
                </label>
                <input type="email" value={kontak.email} onChange={(e) => setKontak({ ...kontak, email: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Phone className="h-3 w-3" /> WhatsApp
                </label>
                <input type="text" value={kontak.whatsapp} onChange={(e) => setKontak({ ...kontak, whatsapp: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
              </div>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <AtSign className="h-3 w-3" /> URL Instagram
              </label>
              <input type="url" value={kontak.instagram} onChange={(e) => setKontak({ ...kontak, instagram: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Film className="h-3 w-3" /> URL TikTok
              </label>
              <input type="url" value={kontak.tiktok} onChange={(e) => setKontak({ ...kontak, tiktok: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Globe className="h-3 w-3" /> URL YouTube
              </label>
              <input type="url" value={kontak.youtube} onChange={(e) => setKontak({ ...kontak, youtube: e.target.value })} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pb-4">
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]">
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}

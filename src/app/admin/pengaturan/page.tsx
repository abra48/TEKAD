"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Settings, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2,
  Bell, Globe, Save, Phone, Mail, MapPin, AtSign,
  PlayCircle, Music, Target, Sparkles, Plus, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  twitter_url: string;
  visi: string;
  misi: string[];
}

const defaultSettings: SiteSettings = {
  phone: "", email: "", address: "",
  instagram_url: "", youtube_url: "", tiktok_url: "", twitter_url: "",
  visi: "", misi: [],
};

export default function AdminPengaturanPage() {
  /* ── Password State ── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [isLoadingPw, setIsLoadingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Site Settings State ── */
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Toggles ── */
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  /* ── Fetch settings on mount ── */
  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", "main")
          .single();

        if (!error && data) {
          setSettings({
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            instagram_url: data.instagram_url || "",
            youtube_url: data.youtube_url || "",
            tiktok_url: data.tiktok_url || "",
            twitter_url: data.twitter_url || "",
            visi: data.visi || "",
            misi: Array.isArray(data.misi) ? data.misi : [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  /* ── Password submit ── */
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (newPassword !== confirmPassword) { setPwMessage({ type: "error", text: "Password baru tidak cocok." }); return; }
    if (newPassword.length < 6) { setPwMessage({ type: "error", text: "Password minimal 6 karakter." }); return; }
    setIsLoadingPw(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwMessage({ type: "success", text: "Password berhasil diperbarui!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) { setPwMessage({ type: "error", text: err?.message || "Gagal memperbarui password." }); } finally { setIsLoadingPw(false); }
  };

  /* ── Save settings ── */
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          id: "main",
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          instagram_url: settings.instagram_url,
          youtube_url: settings.youtube_url,
          tiktok_url: settings.tiktok_url,
          twitter_url: settings.twitter_url,
          visi: settings.visi,
          misi: settings.misi,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setSettingsMsg({ type: "success", text: "Pengaturan berhasil disimpan!" });
      setTimeout(() => setSettingsMsg(null), 3000);
    } catch (err: any) {
      setSettingsMsg({ type: "error", text: err?.message || "Gagal menyimpan." });
    } finally {
      setSavingSettings(false);
    }
  };

  /* ── Misi helpers ── */
  const addMisi = () => setSettings({ ...settings, misi: [...settings.misi, ""] });
  const updateMisi = (idx: number, val: string) => {
    const next = [...settings.misi];
    next[idx] = val;
    setSettings({ ...settings, misi: next });
  };
  const removeMisi = (idx: number) => {
    setSettings({ ...settings, misi: settings.misi.filter((_, i) => i !== idx) });
  };

  /* ── Input helper ── */
  const updateField = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const inputClass = "admin-input w-full rounded-xl px-4 py-2.5 text-sm";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola kontak, sosial media, visi misi, dan akun admin</p>
      </div>

      {/* ══════ KONTAK & SOSIAL MEDIA ══════ */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><Phone className="h-4 w-4 text-white" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Kontak & Sosial Media</h2><p className="text-[11px] text-gray-400">Informasi kontak yang tampil di website publik</p></div>
        </div>

        {loadingSettings ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : (
          <div className="space-y-5 p-6">
            {/* Kontak */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}><Phone className="mr-1 inline h-3 w-3" /> No. WhatsApp / Telepon</label>
                <input type="text" value={settings.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+62 812-3456-7890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Mail className="mr-1 inline h-3 w-3" /> Email</label>
                <input type="email" value={settings.email} onChange={(e) => updateField("email", e.target.value)} placeholder="redaksi.tekad@unm.ac.id" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}><MapPin className="mr-1 inline h-3 w-3" /> Alamat</label>
              <textarea value={settings.address} onChange={(e) => updateField("address", e.target.value)} rows={2} placeholder="Gedung PKM Lt. 2, Kampus UNM Parangtambung, Makassar" className={`${inputClass} resize-none`} />
            </div>

            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />

            {/* Sosial Media */}
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Link Sosial Media</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}><AtSign className="mr-1 inline h-3 w-3" /> Instagram</label>
                <input type="url" value={settings.instagram_url} onChange={(e) => updateField("instagram_url", e.target.value)} placeholder="https://instagram.com/tekadunm" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><PlayCircle className="mr-1 inline h-3 w-3" /> YouTube</label>
                <input type="url" value={settings.youtube_url} onChange={(e) => updateField("youtube_url", e.target.value)} placeholder="https://youtube.com/@tekadunm" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Music className="mr-1 inline h-3 w-3" /> TikTok</label>
                <input type="url" value={settings.tiktok_url} onChange={(e) => updateField("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@tekadunm" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Globe className="mr-1 inline h-3 w-3" /> Twitter / X</label>
                <input type="url" value={settings.twitter_url} onChange={(e) => updateField("twitter_url", e.target.value)} placeholder="https://x.com/tekadunm" className={inputClass} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════ VISI & MISI ══════ */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600"><Target className="h-4 w-4 text-white" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Visi & Misi</h2><p className="text-[11px] text-gray-400">Konten visi dan misi yang tampil di halaman Tentang</p></div>
        </div>

        {loadingSettings ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : (
          <div className="space-y-5 p-6">
            <div>
              <label className={labelClass}><Sparkles className="mr-1 inline h-3 w-3" /> Visi</label>
              <textarea value={settings.visi} onChange={(e) => updateField("visi", e.target.value)} rows={3} placeholder="Menjadi pusat informasi dan penggerak media kreatif terdepan..." className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}><Target className="mr-1 inline h-3 w-3" /> Misi</label>
              <div className="space-y-3">
                {settings.misi.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">{idx + 1}</span>
                    <input type="text" value={item} onChange={(e) => updateMisi(idx, e.target.value)} placeholder={`Misi ke-${idx + 1}`} className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => removeMisi(idx)} className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button type="button" onClick={addMisi} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                  <Plus className="h-3.5 w-3.5" /> Tambah Misi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════ SAVE BUTTON ══════ */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        {settingsMsg && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${settingsMsg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400" : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"}`}>
            {settingsMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}{settingsMsg.text}
          </div>
        )}
        <button onClick={handleSaveSettings} disabled={savingSettings || loadingSettings} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60 sm:ml-auto">
          {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Semua Pengaturan
        </button>
      </div>

      {/* ══════ PASSWORD ══════ */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600"><Key className="h-4 w-4 text-white" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Ubah Password</h2><p className="text-[11px] text-gray-400">Perbarui password akun admin Anda</p></div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-5 p-6">
          {pwMessage && (
            <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${pwMessage.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400" : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"}`}>
              {pwMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}{pwMessage.text}
            </div>
          )}
          <div><label className={labelClass}>Password Saat Ini</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          <div><label className={labelClass}>Password Baru</label>
            <div className="relative"><input type={showNewPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={`${inputClass} pr-11`} placeholder="Minimal 6 karakter" /><button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </div>
          <div><label className={labelClass}>Konfirmasi Password Baru</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} placeholder="Ulangi password baru" /></div>
          <button type="submit" disabled={isLoadingPw} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
            {isLoadingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />} Perbarui Password
          </button>
        </form>
      </div>

      {/* ══════ TOGGLES ══════ */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"><Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Konfigurasi Lainnya</h2><p className="text-[11px] text-gray-400">Pengaturan sistem dan fitur</p></div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3"><Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" /><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Buka Pendaftaran</p><p className="text-[11px] text-gray-400">Izinkan anggota baru untuk mendaftar</p></div></div>
            <button type="button" onClick={() => setRegistrationOpen(!registrationOpen)} className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${registrationOpen ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`} role="switch" aria-checked={registrationOpen}>
              <span className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${registrationOpen ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3"><Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" /><div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifikasi Email</p><p className="text-[11px] text-gray-400">Kirim notifikasi saat ada pendaftar baru</p></div></div>
            <button type="button" onClick={() => setNotifEmail(!notifEmail)} className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${notifEmail ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`} role="switch" aria-checked={notifEmail}>
              <span className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${notifEmail ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

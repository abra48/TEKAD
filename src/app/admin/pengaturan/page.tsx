"use client";

import { useState, useEffect, FormEvent } from "react";
import { Settings, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Shield, Bell, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPengaturanPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) { setMessage({ type: "error", text: "Password baru tidak cocok." }); return; }
    if (newPassword.length < 6) { setMessage({ type: "error", text: "Password minimal 6 karakter." }); return; }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: "success", text: "Password berhasil diperbarui!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) { setMessage({ type: "error", text: err?.message || "Gagal memperbarui password." }); } finally { setIsLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div><h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Pengaturan</h1><p className="mt-1 text-sm text-gray-500">Kelola akun dan konfigurasi admin panel</p></div>

      {/* Password */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><Key className="h-4 w-4 text-white" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Ubah Password</h2><p className="text-[11px] text-gray-400">Perbarui password akun admin Anda</p></div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-5 p-6">
          {message && (
            <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400" : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"}`}>
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}{message.text}
            </div>
          )}
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Password Saat Ini</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="••••••••" /></div>
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Password Baru</label>
            <div className="relative"><input type={showNewPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="admin-input w-full rounded-xl px-4 py-2.5 pr-11 text-sm" placeholder="Minimal 6 karakter" /><button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </div>
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Konfirmasi Password Baru</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="admin-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="Ulangi password baru" /></div>
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />} Perbarui Password
          </button>
        </form>
      </div>

      {/* Toggles */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"><Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" /></div>
          <div><h2 className="text-sm font-bold text-gray-900 dark:text-white">Konfigurasi</h2><p className="text-[11px] text-gray-400">Pengaturan sistem dan fitur</p></div>
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

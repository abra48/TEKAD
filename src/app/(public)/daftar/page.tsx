"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { UserPlus, Send, User, Mail, Phone, Hash, BookOpen, Layers, FileText, LinkIcon, Sparkles, CheckCircle2 } from "lucide-react";

const divisiOptions = ["Website", "Instagram", "TikTok", "YouTube", "Reporter"];
const initialForm = { namaLengkap: "", nim: "", email: "", whatsapp: "", angkatan: "", semester: "", divisi1: "", divisi2: "", motivasi: "", portofolio: "" };
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10";

export default function DaftarPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setIsLoading(true); setErrorMsg("");
    try {
      const res = await fetch("/api/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: form.namaLengkap, nim: form.nim, email: form.email, phone_number: form.whatsapp, angkatan: form.angkatan, semester: form.semester, division_choice_1: form.divisi1, division_choice_2: form.divisi2, motivation: form.motivasi, portfolio_url: form.portofolio || null }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pendaftaran.");
      setForm(initialForm); setSubmitted(true); setTimeout(() => setSubmitted(false), 6000);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan."); } finally { setIsLoading(false); }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-white/70">Bergabung</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Formulir Pendaftaran</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">Isi formulir di bawah ini untuk mendaftar sebagai anggota baru TEKAD UNM.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {submitted && (<div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="h-5 w-5 shrink-0" /><span>Pendaftaran berhasil dikirim! Tim kami akan menghubungi Anda melalui WhatsApp.</span></div>)}
          {errorMsg && (<div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"><span className="shrink-0">⚠️</span><span>{errorMsg}</span><button onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-600">✕</button></div>)}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Data Pribadi */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><User className="h-4 w-4 text-white" /></div><h2 className="text-base font-bold text-gray-900 dark:text-white">Data Pribadi</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2"><label htmlFor="namaLengkap" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" id="namaLengkap" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} required placeholder="Masukkan nama lengkap" className={inputClass} /></div>
                  <div><label htmlFor="nim" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">NIM <span className="text-red-500">*</span></label><input type="text" id="nim" name="nim" value={form.nim} onChange={handleChange} required placeholder="1234567890" className={inputClass} /></div>
                  <div><label htmlFor="angkatan" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Angkatan <span className="text-red-500">*</span></label><input type="text" id="angkatan" name="angkatan" value={form.angkatan} onChange={handleChange} required placeholder="2024" className={inputClass} /></div>
                </div>
              </div>
              <div className="mb-8 h-px bg-gray-100 dark:bg-gray-800" />
              {/* Kontak */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><Mail className="h-4 w-4 text-white" /></div><h2 className="text-base font-bold text-gray-900 dark:text-white">Informasi Kontak</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email <span className="text-red-500">*</span></label><input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder="nama@email.com" className={inputClass} /></div>
                  <div><label htmlFor="whatsapp" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nomor WhatsApp <span className="text-red-500">*</span></label><input type="text" id="whatsapp" name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="08xxxxxxxxxx" className={inputClass} /></div>
                  <div className="sm:col-span-2"><label htmlFor="semester" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Semester <span className="text-red-500">*</span></label><input type="number" id="semester" name="semester" value={form.semester} onChange={handleChange} required min={1} max={14} placeholder="1 - 14" className={inputClass} /></div>
                </div>
              </div>
              <div className="mb-8 h-px bg-gray-100 dark:bg-gray-800" />
              {/* Divisi */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><Sparkles className="h-4 w-4 text-white" /></div><h2 className="text-base font-bold text-gray-900 dark:text-white">Pilihan Divisi</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="divisi1" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pilihan Divisi 1 <span className="text-red-500">*</span></label><select id="divisi1" name="divisi1" value={form.divisi1} onChange={handleChange} required className={`${inputClass} appearance-none`}><option value="">— Pilih Divisi —</option>{divisiOptions.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div><label htmlFor="divisi2" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pilihan Divisi 2 <span className="text-red-500">*</span></label><select id="divisi2" name="divisi2" value={form.divisi2} onChange={handleChange} required className={`${inputClass} appearance-none`}><option value="">— Pilih Divisi —</option>{divisiOptions.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                </div>
              </div>
              <div className="mb-8 h-px bg-gray-100 dark:bg-gray-800" />
              {/* Motivasi */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"><FileText className="h-4 w-4 text-white" /></div><h2 className="text-base font-bold text-gray-900 dark:text-white">Motivasi & Portofolio</h2></div>
                <div className="space-y-5">
                  <div><label htmlFor="motivasi" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Motivasi Bergabung <span className="text-red-500">*</span></label><textarea id="motivasi" name="motivasi" value={form.motivasi} onChange={handleChange} required minLength={50} rows={4} placeholder="Ceritakan motivasi kamu bergabung di TEKAD UNM... (Minimal 50 karakter)" className={`${inputClass} resize-none`} /><p className="mt-1.5 text-[11px] text-gray-400">{form.motivasi.length}/50 karakter</p></div>
                  <div><label htmlFor="portofolio" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Link Portofolio <span className="text-[10px] normal-case font-normal text-gray-400">(opsional)</span></label><input type="url" id="portofolio" name="portofolio" value={form.portofolio} onChange={handleChange} placeholder="https://contoh.com/portofolio" className={inputClass} /></div>
                </div>
              </div>
              <div className="mb-8 h-px bg-gray-100 dark:bg-gray-800" />
              <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                {isLoading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Mengirim...</>) : (<><Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> Kirim Pendaftaran</>)}
              </button>
              <p className="mt-4 text-center text-[11px] text-gray-400">Dengan mengirimkan formulir ini, Anda bersedia menjadi bagian dari TEKAD UNM.</p>
            </div>
          </form>
          <div className="mt-10 text-center"><Link href="/" className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400">← Kembali ke Beranda</Link></div>
        </div>
      </section>
    </>
  );
}

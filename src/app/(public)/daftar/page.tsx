"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  UserPlus,
  Send,
  User,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Layers,
  FileText,
  LinkIcon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   FORM TYPES & OPTIONS
   ═══════════════════════════════════════════════ */

const divisiOptions = [
  "Website",
  "Instagram",
  "TikTok",
  "YouTube",
  "Reporter",
];

const initialForm = {
  namaLengkap: "",
  nim: "",
  email: "",
  whatsapp: "",
  angkatan: "",
  semester: "",
  divisi1: "",
  divisi2: "",
  motivasi: "",
  portofolio: "",
};

/* ═══════════════════════════════════════════════
   PENDAFTARAN PAGE
   ═══════════════════════════════════════════════ */

export default function DaftarPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.namaLengkap,
          nim: form.nim,
          email: form.email,
          phone_number: form.whatsapp,
          angkatan: form.angkatan,
          semester: form.semester,
          division_choice_1: form.divisi1,
          division_choice_2: form.divisi2,
          motivation: form.motivasi,
          portfolio_url: form.portofolio || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pendaftaran.");
      }

      setForm(initialForm);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ─────────────── HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-sky-200/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
              <UserPlus className="h-4 w-4" />
              <span>Bergabung Bersama Kami</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Formulir <span className="text-blue-700">Pendaftaran</span>{" "}
              Anggota TEKAD
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              Isi formulir di bawah ini untuk mendaftar sebagai anggota baru
              TEKAD UNM. Pastikan semua data terisi dengan benar.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── FORM SECTION ─────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Success banner */}
          {submitted && (
            <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>
                Pendaftaran berhasil dikirim! Tim kami akan menghubungi Anda
                melalui WhatsApp.
              </span>
            </div>
          )}

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <span className="shrink-0">⚠️</span>
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg("")}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-gray-900/5"
          >
            {/* Card accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Section: Data Pribadi */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Data Pribadi
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="namaLengkap"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="namaLengkap"
                      name="namaLengkap"
                      value={form.namaLengkap}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* NIM */}
                  <div>
                    <label
                      htmlFor="nim"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <Hash className="h-3.5 w-3.5 text-gray-400" />
                      NIM <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nim"
                      name="nim"
                      value={form.nim}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 1234567890"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Angkatan */}
                  <div>
                    <label
                      htmlFor="angkatan"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                      Angkatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="angkatan"
                      name="angkatan"
                      value={form.angkatan}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 2024"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px bg-gray-100" />

              {/* Section: Kontak */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                    <Mail className="h-4 w-4 text-sky-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Informasi Kontak
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="nama@email.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="08xxxxxxxxxx"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Semester */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="semester"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <Layers className="h-3.5 w-3.5 text-gray-400" />
                      Semester <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="semester"
                      name="semester"
                      value={form.semester}
                      onChange={handleChange}
                      required
                      min={1}
                      max={14}
                      placeholder="1 - 14"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px bg-gray-100" />

              {/* Section: Pilihan Divisi */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Pilihan Divisi
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Divisi 1 */}
                  <div>
                    <label
                      htmlFor="divisi1"
                      className="mb-1.5 text-sm font-semibold text-gray-700"
                    >
                      Pilihan Divisi 1 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="divisi1"
                      name="divisi1"
                      value={form.divisi1}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">— Pilih Divisi —</option>
                      {divisiOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Divisi 2 */}
                  <div>
                    <label
                      htmlFor="divisi2"
                      className="mb-1.5 text-sm font-semibold text-gray-700"
                    >
                      Pilihan Divisi 2 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="divisi2"
                      name="divisi2"
                      value={form.divisi2}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">— Pilih Divisi —</option>
                      {divisiOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px bg-gray-100" />

              {/* Section: Motivasi & Portofolio */}
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Motivasi & Portofolio
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Motivasi */}
                  <div>
                    <label
                      htmlFor="motivasi"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      Motivasi Bergabung{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="motivasi"
                      name="motivasi"
                      value={form.motivasi}
                      onChange={handleChange}
                      required
                      minLength={50}
                      rows={4}
                      placeholder="Ceritakan motivasi kamu bergabung di TEKAD UNM... (Minimal 50 karakter)"
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">
                      Minimal 50 karakter ({form.motivasi.length}/50)
                    </p>
                  </div>

                  {/* Portofolio */}
                  <div>
                    <label
                      htmlFor="portofolio"
                      className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                    >
                      <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                      Link Portofolio{" "}
                      <span className="text-xs font-normal text-gray-400">
                        (opsional)
                      </span>
                    </label>
                    <input
                      type="url"
                      id="portofolio"
                      name="portofolio"
                      value={form.portofolio}
                      onChange={handleChange}
                      placeholder="https://contoh.com/portofolio"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-8 h-px bg-gray-100" />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    Kirim Pendaftaran
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
                Dengan mengirimkan formulir ini, Anda menyetujui untuk menjadi
                bagian dari TEKAD UNM dan bersedia mengikuti program kerja yang
                telah ditetapkan.
              </p>
            </div>
          </form>

          {/* Back to home */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-blue-600"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Email atau password salah. Silakan coba lagi." : authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 px-4 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-10" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="fixed right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-5 h-14 w-14 overflow-hidden rounded-2xl bg-white/10 shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
            <Image src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png" alt="Logo TEKAD" fill className="object-cover" sizes="56px" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Masuk ke dashboard TEKAD UNM
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
          <div className="p-7 sm:p-8">
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                <p className="text-sm font-medium text-red-200">{error}</p>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="email" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                <Mail className="h-3 w-3" /> Email
              </label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@tekad.unm.ac.id"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-blue-500/50"
              />
            </div>

            <div className="mb-7">
              <label htmlFor="password" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                <Lock className="h-3 w-3" /> Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-blue-500/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 transition-colors hover:text-white/70">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            >
              {loading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 dark:border-white/30 dark:border-t-white" /> Memproses...</>) : (<><Lock className="h-4 w-4" /> Masuk</>)}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-white/40">TEKAD UNM — Panel Administrasi</p>
        </div>
      </div>
    </div>
  );
}

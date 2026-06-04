"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email atau password salah. Silakan coba lagi."
          : authError.message
      );
      setLoading(false);
      return;
    }

    // Login berhasil — redirect ke dashboard admin
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="admin-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 py-12">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0">
        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[120px]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-5 h-14 w-14 overflow-hidden rounded-2xl shadow-glow-md ring-1 ring-white/10">
            <Image
              src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png"
              alt="Logo TEKAD"
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk ke dashboard TEKAD UNM
          </p>
        </div>

        {/* Form — glass card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-2xl shadow-black/20 backdrop-blur-xl"
        >
          {/* Top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="p-7 sm:p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                <Mail className="h-3 w-3" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tekad.unm.ac.id"
                className="admin-input w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-7">
              <label
                htmlFor="password"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                <Lock className="h-3 w-3" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="admin-input w-full rounded-xl px-4 py-3 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-600 transition-colors hover:text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Masuk
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-600">
            TEKAD UNM — Panel Administrasi
          </p>
        </div>
      </div>
    </div>
  );
}

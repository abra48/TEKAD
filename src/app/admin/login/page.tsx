"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-slate-50 to-blue-50 px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/40 to-sky-200/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-100/30 to-blue-100/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo top */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-2xl shadow-xl shadow-blue-600/25">
            <Image
              src="https://i.ibb.co.com/ZbtrwQw/Gemini-Generated-Image.png"
              alt="Logo TEKAD"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Login Admin <span className="text-blue-700">TEKAD</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Masuk ke panel administrasi TEKAD UNM
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-gray-900/5"
        >
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

          <div className="p-7 sm:p-8">
            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
              >
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tekad.unm.ac.id"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700"
              >
                <Lock className="h-3.5 w-3.5 text-gray-400" />
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 pr-11 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600"
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
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Sparkles className="h-3 w-3" />
          <span>TEKAD UNM — Panel Admin</span>
        </div>
      </div>
    </div>
  );
}

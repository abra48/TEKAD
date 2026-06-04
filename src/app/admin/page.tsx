"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  UserPlus,
  CalendarDays,
  ImageIcon,
  ArrowUpRight,
  Clock,
  FileText,
  UserCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  BookOpen,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface DashboardCounts {
  news: number;
  events: number;
  gallery: number;
  programs: number;
}

/* ═══════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════ */

const quickActions = [
  {
    label: "Tulis Berita",
    href: "/admin/berita/baru",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Upload Galeri",
    href: "/admin/galeri/baru",
    icon: ImageIcon,
    color: "from-violet-500 to-purple-600",
  },
  {
    label: "Tambah Kegiatan",
    href: "/admin/kegiatan/baru",
    icon: CalendarDays,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Kelola Program",
    href: "/admin/program",
    icon: BookOpen,
    color: "from-amber-500 to-orange-500",
  },
];

const recentActivities = [
  {
    id: 1,
    icon: UserCheck,
    iconColor: "text-blue-400",
    dotColor: "bg-blue-400",
    text: "Budi Santoso mendaftar ke divisi Website",
    time: "5 menit lalu",
  },
  {
    id: 2,
    icon: FileText,
    iconColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    text: "Artikel 'Prestasi Mahasiswa di LKTI Regional' dipublikasikan",
    time: "32 menit lalu",
  },
  {
    id: 3,
    icon: UserCheck,
    iconColor: "text-blue-400",
    dotColor: "bg-blue-400",
    text: "Andi Pratama mendaftar ke divisi Instagram",
    time: "1 jam lalu",
  },
  {
    id: 4,
    icon: CheckCircle2,
    iconColor: "text-amber-400",
    dotColor: "bg-amber-400",
    text: "Kegiatan 'Workshop Jurnalistik' ditandai selesai",
    time: "2 jam lalu",
  },
];

/* ═══════════════════════════════════════════════
   ADMIN DASHBOARD PAGE — DARK PREMIUM
   ═══════════════════════════════════════════════ */

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({
    news: 0,
    events: 0,
    gallery: 0,
    programs: 0,
  });
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  // Fetch real counts from Supabase
  useEffect(() => {
    async function fetchCounts() {
      try {
        const supabase = createClient();

        const [newsRes, eventsRes, galleryRes, programsRes] = await Promise.all(
          [
            supabase
              .from("news_articles")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("events")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("gallery")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("programs")
              .select("id", { count: "exact", head: true }),
          ]
        );

        setCounts({
          news: newsRes.count ?? 0,
          events: eventsRes.count ?? 0,
          gallery: galleryRes.count ?? 0,
          programs: programsRes.count ?? 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const statsCards = [
    {
      label: "Total Berita",
      value: loading ? "—" : counts.news.toString(),
      icon: Newspaper,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/berita",
    },
    {
      label: "Total Kegiatan",
      value: loading ? "—" : counts.events.toString(),
      icon: CalendarDays,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/admin/kegiatan",
    },
    {
      label: "Foto Galeri",
      value: loading ? "—" : counts.gallery.toString(),
      icon: ImageIcon,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      href: "/admin/galeri",
    },
    {
      label: "Program Aktif",
      value: loading ? "—" : counts.programs.toString(),
      icon: BookOpen,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      href: "/admin/program",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ─────────────── HEADER ─────────────── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-600">{today}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {greeting},{" "}
            <span className="text-gradient">Admin</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Ringkasan data dan aktivitas TEKAD UNM
          </p>
        </div>
        <Link
          href="/admin/berita/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Buat Konten Baru
        </Link>
      </div>

      {/* ─────────────── STATS BENTO GRID ─────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              {/* Corner glow on hover */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-700 transition-colors group-hover:text-blue-400" />
                </div>

                <div className="mt-4">
                  <p
                    className={`text-3xl font-extrabold tracking-tight text-white ${
                      loading ? "animate-pulse" : ""
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ─────────────── QUICK ACTIONS ─────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02]">
        <div className="flex items-center gap-3 border-b border-white/[0.04] px-6 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-white">Aksi Cepat</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 text-center transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-white">
                  {action.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─────────────── RECENT ACTIVITY ─────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-white">
              Aktivitas Terakhir
            </h2>
          </div>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
            {recentActivities.length} baru
          </span>
        </div>

        {/* Timeline */}
        <div className="relative px-6 py-2">
          {/* Vertical line */}
          <div className="absolute bottom-0 left-[33px] top-0 w-px bg-gradient-to-b from-white/[0.04] via-white/[0.06] to-white/[0.02]" />

          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="group relative flex items-start gap-4 py-4"
              >
                {/* Dot */}
                <div className="relative z-10 mt-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${activity.dotColor} ring-4 ring-surface`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300">
                    {activity.text}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.04] px-6 py-3 text-center">
          <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300">
            Lihat Semua Aktivitas
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

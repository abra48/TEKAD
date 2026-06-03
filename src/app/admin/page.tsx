"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  UserPlus,
  CalendarDays,
  ImageIcon,
  TrendingUp,
  ArrowUpRight,
  Clock,
  FileText,
  UserCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  BookOpen,
  Activity,
  BarChart3,
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
    color: "from-blue-500 to-blue-700",
    desc: "Buat artikel baru",
  },
  {
    label: "Upload Galeri",
    href: "/admin/galeri/baru",
    icon: ImageIcon,
    color: "from-violet-500 to-purple-700",
    desc: "Tambah foto kegiatan",
  },
  {
    label: "Tambah Kegiatan",
    href: "/admin/kegiatan/baru",
    icon: CalendarDays,
    color: "from-emerald-500 to-emerald-700",
    desc: "Buat jadwal baru",
  },
  {
    label: "Kelola Program",
    href: "/admin/program",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    desc: "Atur program kami",
  },
];

const recentActivities = [
  {
    id: 1,
    icon: UserCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    text: "Budi Santoso mendaftar ke divisi Website",
    time: "5 menit lalu",
    type: "pendaftaran",
  },
  {
    id: 2,
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    text: "Artikel 'Prestasi Mahasiswa di LKTI Regional' dipublikasikan",
    time: "32 menit lalu",
    type: "berita",
  },
  {
    id: 3,
    icon: UserCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    text: "Andi Pratama mendaftar ke divisi Instagram",
    time: "1 jam lalu",
    type: "pendaftaran",
  },
  {
    id: 4,
    icon: CheckCircle2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    text: "Kegiatan 'Workshop Jurnalistik' ditandai selesai",
    time: "2 jam lalu",
    type: "kegiatan",
  },
  {
    id: 5,
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    text: "Draft artikel 'Rapat Koordinasi Divisi' disimpan",
    time: "3 jam lalu",
    type: "berita",
  },
];

/* ═══════════════════════════════════════════════
   ADMIN DASHBOARD PAGE
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
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "from-blue-500 to-blue-700",
      href: "/admin/berita",
    },
    {
      label: "Total Kegiatan",
      value: loading ? "—" : counts.events.toString(),
      icon: CalendarDays,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "from-emerald-500 to-emerald-700",
      href: "/admin/kegiatan",
    },
    {
      label: "Foto Galeri",
      value: loading ? "—" : counts.gallery.toString(),
      icon: ImageIcon,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "from-violet-500 to-purple-700",
      href: "/admin/galeri",
    },
    {
      label: "Program Aktif",
      value: loading ? "—" : counts.programs.toString(),
      icon: BookOpen,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "from-amber-500 to-orange-600",
      href: "/admin/program",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────── HEADER ─────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
            <Activity className="h-3 w-3" />
            Dashboard
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin!
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">{today}</p>
        </div>
        <Link
          href="/admin/berita/baru"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Buat Konten Baru
        </Link>
      </div>

      {/* ─────────────── STATS GRID ─────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/5 sm:p-6"
            >
              {/* Top accent line on hover */}
              <div
                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-500" />
              </div>

              <div className="mt-4">
                <p
                  className={`text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl ${
                    loading ? "animate-pulse" : ""
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
                <BarChart3 className="h-3 w-3 text-blue-400" />
                Lihat detail
              </div>
            </Link>
          );
        })}
      </div>

      {/* ─────────────── QUICK ACTIONS ─────────────── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Aksi Cepat</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md sm:p-5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─────────────── RECENT ACTIVITY ─────────────── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Aktivitas Terakhir
            </h2>
          </div>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
            {recentActivities.length} baru
          </span>
        </div>

        {/* Activity list */}
        <ul className="divide-y divide-gray-50">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <li
                key={activity.id}
                className="group flex items-start gap-4 px-5 py-4 transition-colors duration-200 hover:bg-gray-50/70 sm:px-6"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.iconBg} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {activity.text}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
                <span
                  className={`mt-1 hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:inline-block ${
                    activity.type === "pendaftaran"
                      ? "bg-blue-50 text-blue-600"
                      : activity.type === "berita"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {activity.type}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 text-center sm:px-6">
          <button className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800">
            Lihat Semua Aktivitas
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

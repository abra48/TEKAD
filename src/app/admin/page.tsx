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

interface DashboardCounts {
  news: number;
  events: number;
  gallery: number;
  programs: number;
}

const quickActions = [
  { label: "Tulis Berita", href: "/admin/berita/baru", icon: FileText, color: "from-blue-500 to-blue-600" },
  { label: "Upload Galeri", href: "/admin/galeri/baru", icon: ImageIcon, color: "from-violet-500 to-purple-600" },
  { label: "Tambah Kegiatan", href: "/admin/kegiatan/baru", icon: CalendarDays, color: "from-emerald-500 to-emerald-600" },
  { label: "Kelola Program", href: "/admin/program", icon: BookOpen, color: "from-amber-500 to-orange-500" },
];

const recentActivities = [
  { id: 1, dotColor: "bg-blue-500", text: "Budi Santoso mendaftar ke divisi Website", time: "5 menit lalu" },
  { id: 2, dotColor: "bg-emerald-500", text: "Artikel 'Prestasi Mahasiswa di LKTI Regional' dipublikasikan", time: "32 menit lalu" },
  { id: 3, dotColor: "bg-blue-500", text: "Andi Pratama mendaftar ke divisi Instagram", time: "1 jam lalu" },
  { id: 4, dotColor: "bg-amber-500", text: "Kegiatan 'Workshop Jurnalistik' ditandai selesai", time: "2 jam lalu" },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({ news: 0, events: 0, gallery: 0, programs: 0 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  useEffect(() => {
    async function fetchCounts() {
      try {
        const supabase = createClient();
        const [newsRes, eventsRes, galleryRes, programsRes] = await Promise.all([
          supabase.from("news_articles").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("gallery").select("id", { count: "exact", head: true }),
          supabase.from("programs").select("id", { count: "exact", head: true }),
        ]);
        setCounts({ news: newsRes.count ?? 0, events: eventsRes.count ?? 0, gallery: galleryRes.count ?? 0, programs: programsRes.count ?? 0 });
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const statsCards = [
    { label: "Total Berita", value: loading ? "—" : counts.news.toString(), icon: Newspaper, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", href: "/admin/berita" },
    { label: "Total Kegiatan", value: loading ? "—" : counts.events.toString(), icon: CalendarDays, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", href: "/admin/kegiatan" },
    { label: "Foto Galeri", value: loading ? "—" : counts.gallery.toString(), icon: ImageIcon, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", href: "/admin/galeri" },
    { label: "Program Aktif", value: loading ? "—" : counts.programs.toString(), icon: BookOpen, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", href: "/admin/program" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-400 dark:text-gray-600">{today}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {greeting}, <span className="text-gradient">Admin</span>
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">Ringkasan data dan aktivitas TEKAD UNM</p>
        </div>
        <Link href="/admin/berita/baru" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Buat Konten Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-5 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/[0.04] dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/80">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-600 dark:text-gray-700 dark:group-hover:text-blue-400" />
              </div>
              <div className="mt-4">
                <p className={`text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white ${loading ? "animate-pulse" : ""}`}>{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-400 dark:text-gray-500">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Aksi Cepat</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href} className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-5 text-center transition-all duration-200 hover:border-gray-200 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:bg-gray-800">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-lg transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">{action.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Aktivitas Terakhir</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {recentActivities.length} baru
          </span>
        </div>

        <div className="relative px-6 py-2">
          <div className="absolute bottom-0 left-[33px] top-0 w-px bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
          {recentActivities.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-4 py-4">
              <div className="relative z-10 mt-1">
                <div className={`h-2.5 w-2.5 rounded-full ${activity.dotColor} ring-4 ring-white dark:ring-gray-900`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">{activity.text}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600">
                  <Clock className="h-3 w-3" /> {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 px-6 py-3 text-center dark:border-gray-800">
          <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
            Lihat Semua Aktivitas <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

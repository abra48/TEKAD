"use client";

import {
  Newspaper,
  UserPlus,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  Clock,
  FileText,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════════ */

const stats = [
  {
    label: "Total Berita",
    value: "120",
    change: "+8 bulan ini",
    icon: Newspaper,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accent: "from-blue-500 to-blue-700",
  },
  {
    label: "Pendaftar Pending",
    value: "15",
    change: "3 baru hari ini",
    icon: UserPlus,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "from-amber-500 to-orange-600",
  },
  {
    label: "Total Kegiatan",
    value: "24",
    change: "+2 bulan ini",
    icon: CalendarDays,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "from-emerald-500 to-emerald-700",
  },
  {
    label: "Pengunjung",
    value: "1.2K",
    change: "+12% dari kemarin",
    icon: TrendingUp,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    accent: "from-violet-500 to-purple-700",
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
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────── HEADER ─────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Selamat Datang, <span className="text-blue-700">Admin!</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">{today}</p>
      </div>

      {/* ─────────────── STATS GRID ─────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
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
                <p className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {stat.change}
              </div>
            </div>
          );
        })}
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
          <button className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800">
            Lihat Semua Aktivitas →
          </button>
        </div>
      </div>
    </div>
  );
}

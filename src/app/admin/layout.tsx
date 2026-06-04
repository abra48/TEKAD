"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  UserPlus,
  ImageIcon,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   SIDEBAR NAVIGATION DATA
   ═══════════════════════════════════════════════ */

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/pendaftaran", label: "Pendaftaran", icon: UserPlus },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/admin/program", label: "Program Kami", icon: BookOpen },
  { href: "/admin/kegiatan", label: "Kegiatan", icon: CalendarDays },
  { href: "/admin/struktur", label: "Struktur Organisasi", icon: Users },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

/* ═══════════════════════════════════════════════
   ADMIN LAYOUT — DARK PREMIUM
   ═══════════════════════════════════════════════ */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Halaman login tidak pakai layout dashboard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="admin-dark flex min-h-screen bg-surface">
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-surface-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Subtle right border glow */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png"
                alt="Logo TEKAD"
                className="h-9 w-auto"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-white">
                TEKAD
              </span>
              <span className="text-[9px] font-semibold tracking-[0.2em] text-blue-400/80">
                ADMIN PANEL
              </span>
            </div>
          </Link>
          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Profile — glass card */}
        <div className="mx-3 mt-2 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-blue-500/20">
                A
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-50 bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">
                Admin TEKAD
              </p>
              <p className="truncate text-[10px] text-slate-500">
                admin@tekad.unm.ac.id
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="dark-scroll mt-6 flex-1 overflow-y-auto px-3">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Menu
          </p>
          <ul className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                      active
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-500" />
                    )}
                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${
                        active
                          ? "text-blue-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    <span className="flex-1">{link.label}</span>
                    {active && (
                      <ChevronRight className="h-3.5 w-3.5 text-blue-500/60" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.04] p-3">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[17px] w-[17px]" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col lg:pl-[260px]">
        {/* Topbar — glass */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.04] bg-surface/80 px-4 backdrop-blur-xl sm:px-6">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden items-center gap-2 text-xs lg:flex">
            <Link
              href="/admin"
              className="font-medium text-slate-600 transition-colors hover:text-blue-400"
            >
              Admin
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="font-semibold text-slate-300">
              {sidebarLinks.find((l) => isActive(l.href))?.label || "Dashboard"}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Notification */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-surface" />
            </button>

            {/* Divider */}
            <div className="mx-1.5 h-6 w-px bg-white/[0.06]" />

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

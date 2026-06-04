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
   ADMIN LAYOUT
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
    <div className="flex min-h-screen bg-gray-50/80">
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-gray-200/80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png"
              alt="Logo TEKAD"
              className="h-9 w-auto"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-gray-900">
                TEKAD Admin
              </span>
              <span className="text-[9px] font-semibold tracking-[0.15em] text-blue-600">
                PANEL
              </span>
            </div>
          </Link>
          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                Admin TEKAD
              </p>
              <p className="truncate text-xs text-gray-500">
                admin@tekad.unm.ac.id
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            Menu Utama
          </p>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        active
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <span className="flex-1">{link.label}</span>
                    {active && (
                      <ChevronRight className="h-4 w-4 text-blue-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col lg:pl-[272px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb / Page indicator */}
          <div className="hidden items-center gap-2 text-sm lg:flex">
            <Link
              href="/admin"
              className="font-medium text-gray-400 transition-colors hover:text-blue-600"
            >
              Admin
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="font-semibold text-gray-700">
              {sidebarLinks.find((l) => isActive(l.href))?.label || "Dashboard"}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
            </button>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

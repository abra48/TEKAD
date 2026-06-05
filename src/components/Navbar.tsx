"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, ChevronDown, X, Users, Eye, Layers, Newspaper, ImageIcon,
  CalendarDays, UserPlus, AtSign, PlayCircle, Mail, Sun, Moon,
} from "lucide-react";

interface SubLink { href: string; label: string; icon: React.ComponentType<{ className?: string }>; desc: string; }
interface NavItem { label: string; href?: string; children?: SubLink[]; }

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Profil", children: [
    { href: "/tentang", label: "Tentang Kami", icon: Users, desc: "Sejarah & profil TEKAD UNM" },
    { href: "/tentang#visi-misi", label: "Visi & Misi", icon: Eye, desc: "Arah dan tujuan organisasi" },
    { href: "/tentang#divisi", label: "Divisi", icon: Layers, desc: "Struktur divisi TEKAD" },
  ]},
  { label: "Informasi", children: [
    { href: "/berita", label: "Berita", icon: Newspaper, desc: "Berita & pengumuman terbaru" },
    { href: "/galeri", label: "Galeri", icon: ImageIcon, desc: "Dokumentasi foto kegiatan" },
    { href: "/kegiatan", label: "Kegiatan", icon: CalendarDays, desc: "Agenda & jadwal kegiatan" },
  ]},
  { label: "Pendaftaran", href: "/daftar" },
];

const socialLinks = [
  { href: "https://instagram.com/tekadunm", icon: AtSign, label: "Instagram" },
  { href: "https://youtube.com/@tekadunm", icon: PlayCircle, label: "YouTube" },
  { href: "mailto:redaksi.tekad@unm.ac.id", icon: Mail, label: "Email" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  /* Handle hash link navigation (Next.js Link doesn't scroll to hash on page transitions) */
  const handleHashClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.includes("#")) return; // let normal Link handle it
    e.preventDefault();
    const [path, hash] = href.split("#");
    const scrollToHash = () => {
      const el = document.getElementById(hash);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    };
    if (pathname === path) {
      // Same page — just scroll
      scrollToHash();
    } else {
      // Different page — navigate then scroll
      router.push(href);
      setTimeout(scrollToHash, 600);
    }
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) { document.documentElement.classList.add("dark"); setIsDark(true); }
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDark = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) { html.classList.remove("dark"); localStorage.setItem("theme", "light"); setIsDark(false); }
    else { html.classList.add("dark"); localStorage.setItem("theme", "dark"); setIsDark(true); }
  };

  const isActive = (href: string) => { if (href === "/") return pathname === "/"; return pathname.startsWith(href); };
  const handleDropdownEnter = (label: string) => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); setOpenDropdown(label); };
  const handleDropdownLeave = () => { dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150); };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b border-gray-100 bg-gray-50 lg:block dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600">Administrasi Bisnis — Universitas Negeri Makassar</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => { const Icon = s.icon; return (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400" aria-label={s.label}><Icon className="h-3.5 w-3.5" /></a>); })}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:bg-gray-950/80" : "bg-white dark:bg-gray-950"}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <img src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png" alt="Logo TEKAD" className="h-9 w-auto" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">TEKAD</span>
              <span className="text-[9px] font-semibold tracking-[0.2em] text-blue-600 dark:text-blue-400">UNM</span>
            </div>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.label} className="relative" onMouseEnter={() => handleDropdownEnter(item.label)} onMouseLeave={handleDropdownLeave}>
                  <button className={`flex items-center gap-1 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${item.children.some((c) => isActive(c.href)) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                    {item.label}<ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 transition-all duration-200 ${openDropdown === item.label ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
                    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/95 p-2 shadow-xl shadow-gray-900/[0.08] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95">
                      {item.children.map((child) => { const Icon = child.icon; return (
                        <a key={child.href} href={child.href} onClick={(e) => handleHashClick(e, child.href)} className={`group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-150 ${isActive(child.href) ? "bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive(child.href) ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-gray-800 dark:group-hover:bg-blue-500/10"}`}><Icon className="h-4 w-4" /></div>
                          <div><p className="text-sm font-semibold">{child.label}</p><p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{child.desc}</p></div>
                        </a>
                      ); })}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.label}><Link href={item.href!} className={`relative rounded-lg px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${isActive(item.href!) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>{item.label}{isActive(item.href!) && <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-blue-600" />}</Link></li>
              )
            )}
          </ul>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 lg:flex" aria-label="Search"><Search className="h-[18px] w-[18px]" /></button>
            <button onClick={toggleDark} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300" aria-label="Toggle dark mode">{isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}</button>
            <Link href="/daftar" className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl sm:inline-flex"><UserPlus className="h-3.5 w-3.5" /> Daftar</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden" aria-label="Toggle menu">
              <div className="flex w-5 flex-col items-center gap-[5px]">
                <span className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${mobileOpen ? "scale-x-0 opacity-0" : ""}`} />
                <span className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Search Bar */}
          <div className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950 ${searchOpen ? "max-h-20 py-3" : "max-h-0 py-0"}`}>
          <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/berita?q=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(""); } }} className="mx-auto flex max-w-2xl items-center gap-3 px-4 sm:px-6">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari berita, kegiatan, atau informasi..." className="w-full border-0 bg-transparent py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-600" autoFocus={searchOpen} />
            <button type="submit" className="shrink-0 rounded-md px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10">Cari</button>
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
          </form>
          </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 lg:hidden">
              <div className="mx-auto max-w-7xl space-y-1 px-4 pb-5 pt-3 sm:px-6">
                {navItems.map((item) =>
                  item.children ? (
                    <div key={item.label}>
                      <button onClick={() => setMobileAccordion(mobileAccordion === item.label ? null : item.label)} className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${item.children.some((c) => isActive(c.href)) ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
                        {item.label}<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileAccordion === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {mobileAccordion === item.label && (
                        <div className="space-y-0.5 pb-2 pl-4">
                          {item.children.map((child) => { const Icon = child.icon; return (
                            <a key={child.href} href={child.href} onClick={(e) => handleHashClick(e, child.href)} className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${isActive(child.href) ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}><Icon className="h-4 w-4" />{child.label}</a>
                          ); })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={item.label} href={item.href!} className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive(item.href!) ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}>{item.label}</Link>
                  )
                )}
                <div className="pt-3">
                  <Link href="/daftar" className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20"><UserPlus className="h-4 w-4" /> Daftar Anggota</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

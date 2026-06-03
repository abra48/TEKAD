"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/daftar", label: "Daftar Anggota" },
];

const popularPosts = [
  { title: "Pelantikan Pengurus TEKAD Periode 2025/2026", date: "12 Apr 2025" },
  { title: "Workshop Jurnalistik: Menulis Berita Berdampak", date: "28 Mar 2025" },
  { title: "TEKAD Raih Juara 2 LKTI Regional Sulsel", date: "15 Mar 2025" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/tekadunm",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@tekadunm",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@tekadunm",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:redaksi.tekad@unm.ac.id",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <footer className="border-t border-gray-200 bg-gray-950">
        {/* ── Main Footer ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* ── Col 1: Logo & Deskripsi ── */}
            <div className="space-y-5">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
                  <span className="text-lg font-extrabold tracking-tight text-white">
                    T
                  </span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold tracking-tight text-white">
                    TEKAD
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-400">
                    UNM
                  </span>
                </div>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                Tim Edukasi, Kreativitas, Aspirasi, dan Dedikasi — Unit Kegiatan
                Mahasiswa Universitas Negeri Makassar yang bergerak di bidang
                jurnalistik dan media kampus.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/80 text-gray-400 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2: Navigasi ── */}
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-300">
                Navigasi
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      <span className="inline-block h-px w-3 bg-gray-700 transition-all duration-200 group-hover:w-5 group-hover:bg-blue-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Kontak ── */}
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-300">
                Kontak
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-sm leading-relaxed text-gray-400">
                    Gedung PKM Lt. 2, Kampus UNM Parangtambung,
                    <br />
                    Jl. A.P. Pettarani, Makassar 90222
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:redaksi.tekad@unm.ac.id" className="text-sm text-gray-400 transition-colors hover:text-blue-400">
                    redaksi.tekad@unm.ac.id
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a href="tel:+6281234567890" className="text-sm text-gray-400 transition-colors hover:text-blue-400">
                    +62 812-3456-7890
                  </a>
                </li>
              </ul>
            </div>

            {/* ── Col 4: Berita Populer ── */}
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-300">
                Berita Populer
              </h3>
              <ul className="space-y-4">
                {popularPosts.map((post, i) => (
                  <li key={i}>
                    <Link
                      href="/berita"
                      className="group block"
                    >
                      <p className="line-clamp-2 text-sm font-medium text-gray-400 transition-colors group-hover:text-white">
                        {post.title}
                      </p>
                      <time className="mt-1 text-xs text-gray-600">
                        {post.date}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-gray-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} TEKAD UNM. Hak Cipta
              Dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/kebijakan-privasi"
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                Kebijakan Privasi
              </Link>
              <span className="text-gray-700">·</span>
              <Link
                href="/syarat-ketentuan"
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ BACK TO TOP ═══════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl ${
          showTop
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Kembali ke atas"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

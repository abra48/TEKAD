import type { Metadata } from "next";
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan",
  description:
    "Jadwal kegiatan mendatang dan arsip kegiatan yang telah dilaksanakan oleh TEKAD UNM.",
};

/* ═══════════════════════════════════════════════
   DUMMY DATA — akan diganti dengan data Supabase
   ═══════════════════════════════════════════════ */

const kegiatan = [
  {
    id: 1,
    title: "Pelatihan Desain Grafis dengan Canva & Figma",
    desc: "Workshop intensif selama satu hari untuk mempelajari dasar-dasar desain grafis menggunakan Canva dan Figma bagi seluruh anggota TEKAD.",
    date: "28 Jun 2025",
    time: "09:00 – 15:00 WITA",
    location: "Lab Komputer FEB, Kampus UNM Parangtambung",
    status: "upcoming" as const,
  },
  {
    id: 2,
    title: "Rapat Koordinasi Divisi Semester Genap",
    desc: "Rapat koordinasi rutin antar divisi untuk membahas progres kerja dan perencanaan kegiatan semester genap 2025.",
    date: "14 Jun 2025",
    time: "13:00 – 16:00 WITA",
    location: "Ruang Rapat Gedung PKM Lt. 2",
    status: "upcoming" as const,
  },
  {
    id: 3,
    title: "Workshop Jurnalistik: Menulis Berita yang Berdampak",
    desc: "TEKAD UNM mengadakan workshop jurnalistik bersama praktisi media nasional untuk meningkatkan kemampuan menulis anggota.",
    date: "28 Mar 2025",
    time: "08:30 – 16:00 WITA",
    location: "Aula Gedung PKM, Kampus UNM",
    status: "past" as const,
  },
  {
    id: 4,
    title: "Pelantikan Pengurus Periode 2025/2026",
    desc: "Upacara pelantikan resmi kepengurusan baru TEKAD UNM periode 2025/2026 yang dihadiri oleh seluruh anggota dan dosen pembimbing.",
    date: "12 Apr 2025",
    time: "09:00 – 12:00 WITA",
    location: "Aula Gedung PKM, Kampus UNM",
    status: "past" as const,
  },
];

const upcoming = kegiatan.filter((k) => k.status === "upcoming");
const past = kegiatan.filter((k) => k.status === "past");

/* ═══════════════════════════════════════════════
   KEGIATAN PAGE
   ═══════════════════════════════════════════════ */

export default function KegiatanPage() {
  return (
    <>
      {/* ─────────────── HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-sky-200/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700">
              <CalendarDays className="h-4 w-4" />
              <span>Agenda</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Agenda & <span className="text-blue-700">Kegiatan</span> TEKAD
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              Jadwal kegiatan mendatang dan arsip kegiatan yang telah
              dilaksanakan oleh TEKAD UNM.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── TIMELINE ─────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* ── Upcoming ── */}
          <div className="mb-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Kegiatan Mendatang
              </h2>
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {upcoming.length}
              </span>
            </div>

            {/* Timeline items */}
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100" />

              {upcoming.map((item) => (
                <div key={item.id} className="group relative flex gap-5 pb-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex shrink-0 pt-1">
                    <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full border-[3px] border-blue-500 bg-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110">
                      <CircleDot className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 overflow-hidden rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5 sm:p-6">
                    {/* Status badge */}
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                      </span>
                      Mendatang
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-500">
                      {item.desc}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        {item.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {item.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Arsip Kegiatan
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ── Past ── */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Kegiatan Selesai
              </h2>
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                {past.length}
              </span>
            </div>

            {/* Timeline items */}
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-gray-300 to-gray-100" />

              {past.map((item) => (
                <div key={item.id} className="group relative flex gap-5 pb-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex shrink-0 pt-1">
                    <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full border-[3px] border-gray-300 bg-white shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 transition-all duration-300 hover:shadow-md sm:p-6">
                    {/* Status badge */}
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Selesai
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-gray-700">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-400">
                      {item.desc}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {item.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {item.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

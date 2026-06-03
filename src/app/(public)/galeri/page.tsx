import type { Metadata } from "next";
import { Camera, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description:
    "Dokumentasi visual kegiatan TEKAD — Tim Media Kreatif Administrasi Bisnis UNM.",
};

/* ═══════════════════════════════════════════════
   DUMMY DATA — akan diganti dengan data Supabase
   ═══════════════════════════════════════════════ */

const dummyGaleri = [
  {
    id: 1,
    title: "Pelantikan Pengurus 2025/2026",
    kegiatan: "Organisasi",
    color: "from-blue-600 to-blue-900",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-square md:aspect-auto",
  },
  {
    id: 2,
    title: "Workshop Jurnalistik Digital",
    kegiatan: "Pelatihan",
    color: "from-sky-600 to-indigo-800",
    span: "",
    aspect: "aspect-square",
  },
  {
    id: 3,
    title: "Kunjungan ke Redaksi Media",
    kegiatan: "Studi Lapangan",
    color: "from-indigo-600 to-blue-900",
    span: "",
    aspect: "aspect-square",
  },
  {
    id: 4,
    title: "Lomba Karya Tulis Ilmiah",
    kegiatan: "Kompetisi",
    color: "from-blue-700 to-slate-900",
    span: "",
    aspect: "aspect-square",
  },
  {
    id: 5,
    title: "Bakti Sosial Kampus",
    kegiatan: "Pengabdian",
    color: "from-slate-700 to-blue-900",
    span: "md:col-span-2",
    aspect: "aspect-square md:aspect-[2/1]",
  },
  {
    id: 6,
    title: "Rapat Kerja Tahunan",
    kegiatan: "Internal",
    color: "from-blue-800 to-indigo-900",
    span: "",
    aspect: "aspect-square",
  },
];

/* ═══════════════════════════════════════════════
   GALERI PAGE
   ═══════════════════════════════════════════════ */

export default function GaleriPage() {
  return (
    <>
      {/* ─────────────── HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-200/30 blur-3xl" />
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
              <Camera className="h-4 w-4" />
              <span>Dokumentasi</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Galeri <span className="text-blue-700">Kegiatan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              Kumpulan momen dan dokumentasi visual dari berbagai kegiatan yang
              diselenggarakan oleh TEKAD UNM.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── GALLERY GRID (MASONRY-STYLE) ─────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
            {dummyGaleri.map((foto) => (
              <div
                key={foto.id}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 ${foto.span} ${foto.aspect}`}
              >
                {/* Decorative pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #1e40af 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Placeholder icon */}
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                    <Camera className="h-6 w-6 text-blue-400" />
                  </div>
                </div>

                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${foto.color} flex flex-col justify-end p-4 opacity-0 transition-all duration-400 group-hover:opacity-90 sm:p-5`}
                >
                  <div className="translate-y-3 transition-transform duration-300 group-hover:translate-y-0">
                    <span className="mb-1 inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                      {foto.kegiatan}
                    </span>
                    <p className="text-sm font-bold text-white sm:text-base lg:text-lg">
                      {foto.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery info */}
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span>Menampilkan {dummyGaleri.length} dari total dokumentasi kegiatan</span>
          </div>
        </div>
      </section>
    </>
  );
}

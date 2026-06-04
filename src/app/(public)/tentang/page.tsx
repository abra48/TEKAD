"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Globe,
  AtSign,
  Film,
  Play,
  Eye,
  Target,
  Sparkles,
  CheckCircle2,
  User,
  Crown,
  Award,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface OrgMember {
  id: string;
  name: string;
  role: string;       // 'Pembina' | 'Penanggung Jawab' | 'Anggota'
  division: string;   // 'Pusat' | 'Website' | 'Instagram' | 'TikTok' | 'YouTube'
  image_url: string | null;
}

/* ═══════════════════════════════════════════════
   DIVISI CONFIG  (styling only — no data)
   ═══════════════════════════════════════════════ */

const divisiConfig: Record<
  string,
  {
    name: string;
    icon: typeof Globe;
    accent: string;
    accentBg: string;
    iconBg: string;
    iconColor: string;
    ringColor: string;
    glowColor: string;
  }
> = {
  Website: {
    name: "Divisi Website",
    icon: Globe,
    accent: "from-blue-600 to-blue-400",
    accentBg: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    ringColor: "ring-blue-500/20",
    glowColor: "hover:shadow-blue-500/20",
  },
  Instagram: {
    name: "Divisi Instagram",
    icon: AtSign,
    accent: "from-pink-500 to-purple-500",
    accentBg: "from-pink-500/10 to-purple-500/5",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    ringColor: "ring-pink-500/20",
    glowColor: "hover:shadow-pink-500/20",
  },
  TikTok: {
    name: "Divisi TikTok",
    icon: Film,
    accent: "from-slate-700 to-gray-500",
    accentBg: "from-slate-500/10 to-gray-500/5",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    ringColor: "ring-slate-500/20",
    glowColor: "hover:shadow-slate-500/20",
  },
  YouTube: {
    name: "Divisi YouTube",
    icon: Play,
    accent: "from-red-500 to-red-400",
    accentBg: "from-red-500/10 to-red-500/5",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    ringColor: "ring-red-500/20",
    glowColor: "hover:shadow-red-500/20",
  },
};

/** Urutan divisi agar konsisten di grid */
const divisionOrder = ["Website", "Instagram", "TikTok", "YouTube"] as const;

const misiList = [
  "Menyajikan informasi yang akurat, terpercaya, dan bermanfaat bagi seluruh civitas akademika.",
  "Mengembangkan keterampilan jurnalistik dan media kreatif anggota melalui pelatihan intensif.",
  "Mengelola aset media digital secara profesional dan berkelanjutan.",
];

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ═══════════════════════════════════════════════
   TENTANG PAGE
   ═══════════════════════════════════════════════ */

export default function TentangPage() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrgStructure() {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("org_structure")
          .select("*");

        if (fetchError) throw fetchError;
        setMembers(data as OrgMember[]);
      } catch (err: unknown) {
        console.error("Failed to fetch org structure:", err);
        setError("Gagal memuat data struktur organisasi.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrgStructure();
  }, []);

  /* ── Derived Data ── */
  const pembinaList = members.filter((m) => m.division === "Pusat");
  const pembinaData = pembinaList[0] ?? null;

  const divisiData = divisionOrder.map((divKey) => {
    const config = divisiConfig[divKey];
    const teamMembers = members.filter((m) => m.division === divKey);
    return {
      ...config,
      divisionKey: divKey,
      pj: teamMembers.filter((m) => m.role === "Penanggung Jawab"),
      anggota: teamMembers.filter((m) => m.role === "Anggota"),
    };
  });

  return (
    <>
      {/* ─────────────── HEADER ─────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-sky-200/30 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-indigo-100/40 to-purple-100/20 blur-3xl" />
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
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={staggerItem}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Profil Organisasi</span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
            >
              Tentang <span className="text-blue-700">TEKAD UNM</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500"
            >
              Mengenal lebih dekat Tim Media Kreatif Administrasi Bisnis
              Universitas Negeri Makassar.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── PROFIL ─────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scaleIn}
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm sm:p-10">
              {/* Accent bar */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-600/15 ring-1 ring-gray-100">
                  <Image
                    src="https://i.ibb.co.com/yBR2Qd1g/Untitled-design-1.png"
                    alt="Logo TEKAD UNM"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    TEKAD
                  </h2>
                  <p className="text-sm font-medium text-blue-600">
                    Tim Edukasi, Kreativitas, Aspirasi & Dedikasi
                  </p>
                </div>
              </div>

              <p className="text-base leading-relaxed text-gray-600">
                <strong className="text-gray-900">TEKAD</strong> (Tim Media
                Kreatif Administrasi Bisnis) adalah wadah komunikasi, publikasi,
                dan informasi seputar kegiatan akademik maupun non-akademik di
                lingkungan Program Studi Administrasi Bisnis, Universitas Negeri
                Makassar. Kami berdedikasi untuk menyajikan konten berkualitas
                melalui berbagai platform media, sekaligus menjadi penggerak
                kreativitas dan aspirasi mahasiswa.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── VISI & MISI ─────────────── */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Visi & Misi
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-3 max-w-xl text-base text-gray-500"
            >
              Arah dan tujuan yang menjadi landasan setiap langkah TEKAD UNM.
            </motion.p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            {/* VISI */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-8 transition-shadow duration-300 sm:p-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 40px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.08)",
              }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Visi</h3>
                <p className="text-base leading-relaxed text-gray-600">
                  Menjadi pusat informasi dan penggerak media kreatif terdepan di
                  lingkungan Administrasi Bisnis UNM yang profesional, inovatif,
                  dan berdampak positif bagi seluruh civitas akademika.
                </p>
              </div>
            </motion.div>

            {/* MISI */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-8 transition-shadow duration-300 sm:p-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={1}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 40px -12px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.08)",
              }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Misi</h3>
                <ul className="space-y-3">
                  {misiList.map((misi, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                      <span className="text-base leading-relaxed text-gray-600">
                        {misi}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── STRUKTUR ORGANISASI ─────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-50/80 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Struktur Organisasi
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-3 max-w-xl text-base text-gray-500"
            >
              Struktur kepengurusan TEKAD UNM yang saling bersinergi untuk
              menghasilkan karya media terbaik.
            </motion.p>
          </motion.div>

          {/* ── PEMBINA CARD (Puncak) ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-3 text-sm text-gray-400">Memuat struktur organisasi…</p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <>
          <motion.div
            className="mx-auto mb-4 max-w-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scaleIn}
          >
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 p-6 sm:p-8"
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow:
                  "0 25px 50px -12px rgba(245, 158, 11, 0.2), 0 0 30px -5px rgba(245, 158, 11, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Top accent */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

              {/* Decorative glow */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/30 to-yellow-100/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />

              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full shadow-lg shadow-amber-500/25 ring-4 ring-amber-100">
                  {pembinaData?.image_url ? (
                    <Image
                      src={pembinaData.image_url}
                      alt={pembinaData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-50">
                      <Crown className="h-8 w-8 text-amber-500" />
                    </div>
                  )}
                </div>

                {/* Badge */}
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 ring-1 ring-amber-300/40">
                  <Award className="h-3.5 w-3.5" />
                  {pembinaData?.role ?? "Pembina"}
                </span>

                {/* Name */}
                <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {pembinaData?.name ?? "—"}
                </h3>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Connector Line ── */}
          <motion.div
            className="mx-auto flex flex-col items-center"
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ transformOrigin: "top" }}
          >
            <div className="h-10 w-px bg-gradient-to-b from-amber-300 to-blue-300" />
            <div className="h-3 w-3 rounded-full border-2 border-blue-400 bg-white" />
            <div className="h-6 w-px bg-gradient-to-b from-blue-300 to-blue-200" />
          </motion.div>

          {/* ── Horizontal connector ── */}
          <motion.div
            className="relative mx-auto mb-6 hidden max-w-5xl lg:block"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            {/* Branch dots */}
            <div className="absolute -top-[3px] left-[12.5%] h-[7px] w-[7px] rounded-full bg-blue-400" />
            <div className="absolute -top-[3px] left-[37.5%] h-[7px] w-[7px] rounded-full bg-blue-400" />
            <div className="absolute -top-[3px] left-[62.5%] h-[7px] w-[7px] rounded-full bg-blue-400" />
            <div className="absolute -top-[3px] left-[87.5%] h-[7px] w-[7px] rounded-full bg-blue-400" />
          </motion.div>

          {/* ── DIVISI CARDS GRID ── */}
          <motion.div
            className="mx-auto grid max-w-6xl gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {divisiData.map((div) => {
              const Icon = div.icon;
              return (
                <motion.div
                  key={div.name}
                  variants={staggerItem}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow:
                      "0 25px 50px -12px rgba(59, 130, 246, 0.18), 0 0 25px -5px rgba(59, 130, 246, 0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white ring-1 ring-transparent transition-all duration-300 hover:${div.ringColor}`}
                >
                  {/* ── Card Header ── */}
                  <div
                    className={`relative bg-gradient-to-r ${div.accent} px-5 py-4`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/10" />
                    <div className="absolute -right-1 bottom-0 h-8 w-8 rounded-full bg-white/5" />

                    <div className="relative flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {div.name}
                      </h3>
                    </div>
                  </div>

                  {/* ── Card Body ── */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* PJ Section */}
                    <div className="mb-4">
                      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <Award className="h-3 w-3" />
                        Penanggung Jawab
                      </p>
                      <div className="space-y-2.5">
                        {div.pj.map((member, idx) => (
                          <div
                            key={member.id ?? idx}
                            className="flex items-center gap-2.5"
                          >
                            <div className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ${div.ringColor}`}>
                              {member.image_url ? (
                                <Image
                                  src={member.image_url}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className={`flex h-full w-full items-center justify-center ${div.iconBg}`}>
                                  <Crown className={`h-3.5 w-3.5 ${div.iconColor}`} />
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold leading-snug text-gray-800">
                              {member.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mb-4 h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

                    {/* Anggota Section */}
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <User className="h-3 w-3" />
                        Anggota
                      </p>
                      <ul className="space-y-2.5">
                        {div.anggota.map((member, idx) => (
                          <motion.li
                            key={member.id ?? idx}
                            className="flex items-center gap-2.5"
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: 0.4 + idx * 0.08,
                              duration: 0.35,
                            }}
                          >
                            <div
                              className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full ${!member.image_url ? div.iconBg : ''}`}
                            >
                              {member.image_url ? (
                                <Image
                                  src={member.image_url}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center">
                                  <User
                                    className={`h-3.5 w-3.5 ${div.iconColor}`}
                                  />
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {member.name}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

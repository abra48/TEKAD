"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Layers,
  Globe,
  FileText,
  LinkIcon,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════
   STATUS STYLES
   ═══════════════════════════════════════════════ */

const statusStyles: Record<string, { bg: string; label: string }> = {
  pending: {
    bg: "bg-amber-50 text-amber-700 ring-amber-600/10",
    label: "Pending",
  },
  accepted: {
    bg: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-red-50 text-red-700 ring-red-600/10",
    label: "Rejected",
  },
};

/* ═══════════════════════════════════════════════
   DETAIL PENDAFTAR PAGE
   ═══════════════════════════════════════════════ */

export default function DetailPendaftarPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  // ── Fetch data pendaftar ──
  useEffect(() => {
    async function fetchApplicant() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("member_registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setApplicant(data);
      setIsLoading(false);
    }

    fetchApplicant();
  }, [id]);

  // ── Update status pendaftar ──
  const handleReview = async (statusUpdate: "accepted" | "rejected") => {
    setIsUpdating(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("member_registrations")
      .update({
        status: statusUpdate,
        review_notes: notes || null,
      })
      .eq("id", id);

    if (error) {
      alert(`Gagal memperbarui status: ${error.message}`);
      setIsUpdating(false);
      return;
    }

    alert("Status pendaftar berhasil diperbarui!");
    router.push("/admin/pendaftaran");
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">
          Memuat data pendaftar...
        </p>
      </div>
    );
  }

  // ── Not found state ──
  if (!applicant) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
        <p className="text-sm font-medium text-gray-900">
          Data tidak ditemukan
        </p>
        <p className="text-xs text-gray-500">
          Pendaftar dengan ID ini tidak ada di database.
        </p>
        <Link
          href="/admin/pendaftaran"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  // ── Bangun info fields dari data real ──
  const infoFields = [
    { label: "Nama Lengkap", value: applicant.full_name, icon: User },
    { label: "NIM", value: applicant.nim, icon: Hash },
    { label: "Email", value: applicant.email, icon: Mail },
    { label: "Nomor WhatsApp", value: applicant.whatsapp, icon: Phone },
    { label: "Angkatan", value: applicant.angkatan, icon: BookOpen },
    {
      label: "Semester",
      value: applicant.semester ? `Semester ${applicant.semester}` : "-",
      icon: Layers,
    },
    {
      label: "Pilihan Divisi 1",
      value: applicant.division_choice_1,
      icon: Globe,
    },
    {
      label: "Pilihan Divisi 2",
      value: applicant.division_choice_2 || "-",
      icon: Globe,
    },
  ];

  const statusInfo = statusStyles[applicant.status] ?? statusStyles.pending;

  const formattedDate = applicant.created_at
    ? new Date(applicant.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pendaftaran"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Review Pendaftar
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Tinjau dan proses pendaftaran anggota baru
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── Profil Card ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

          {/* Profile header */}
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-md shadow-blue-600/20">
              {(applicant.full_name ?? "?").charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {applicant.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                Didaftarkan pada {formattedDate}
              </p>
            </div>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusInfo.bg}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid gap-0 divide-y divide-gray-50 sm:grid-cols-2 sm:divide-y-0">
            {infoFields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.label}
                  className="flex items-center gap-3 px-6 py-4 sm:border-b sm:border-gray-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <Icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {field.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {field.value || "-"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Motivasi ── */}
        {applicant.motivation && (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
              <FileText className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Motivasi Bergabung
              </h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-gray-600">
                {applicant.motivation}
              </p>
            </div>
          </div>
        )}

        {/* ── Portofolio ── */}
        {applicant.portfolio_url && (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
            <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
              <LinkIcon className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Link Portofolio
              </h3>
            </div>
            <div className="px-6 py-5">
              <a
                href={applicant.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                <Globe className="h-4 w-4" />
                {applicant.portfolio_url}
              </a>
            </div>
          </div>
        )}

        {/* ── Area Aksi ── */}
        <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-900">
              Area Review & Keputusan
            </h3>
          </div>
          <div className="p-6">
            {/* Catatan */}
            <div className="mb-5">
              <label
                htmlFor="catatan"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Catatan Review{" "}
                <span className="font-normal text-gray-400">(opsional)</span>
              </label>
              <textarea
                id="catatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tulis catatan atau alasan keputusan Anda..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleReview("rejected")}
                disabled={isUpdating}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-6 py-3.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Tolak Pendaftar
              </button>
              <button
                onClick={() => handleReview("accepted")}
                disabled={isUpdating}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Terima Pendaftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

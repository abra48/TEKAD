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

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-500/10 text-amber-400", dot: "bg-amber-400", label: "Pending" },
  accepted: { bg: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400", label: "Accepted" },
  rejected: { bg: "bg-red-500/10 text-red-400", dot: "bg-red-400", label: "Rejected" },
};

export default function DetailPendaftarPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchApplicant() {
      const supabase = createClient();
      const { data } = await supabase
        .from("member_registrations")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setApplicant(data);
      setIsLoading(false);
    }
    fetchApplicant();
  }, [id]);

  const handleReview = async (statusUpdate: "accepted" | "rejected") => {
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("member_registrations")
      .update({ status: statusUpdate, review_notes: notes || null })
      .eq("id", id);
    if (error) {
      alert(`Gagal memperbarui status: ${error.message}`);
      setIsUpdating(false);
      return;
    }
    alert("Status pendaftar berhasil diperbarui!");
    router.push("/admin/pendaftaran");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
        <p className="text-sm text-slate-500">Memuat data pendaftar...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-7 w-7 text-amber-400" />
        <p className="text-sm font-medium text-slate-300">Data tidak ditemukan</p>
        <p className="text-xs text-slate-600">Pendaftar dengan ID ini tidak ada di database.</p>
        <Link href="/admin/pendaftaran" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300">
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke daftar
        </Link>
      </div>
    );
  }

  const infoFields = [
    { label: "Nama Lengkap", value: applicant.full_name, icon: User },
    { label: "NIM", value: applicant.nim, icon: Hash },
    { label: "Email", value: applicant.email, icon: Mail },
    { label: "Nomor WhatsApp", value: applicant.phone_number, icon: Phone },
    { label: "Angkatan", value: applicant.angkatan, icon: BookOpen },
    { label: "Semester", value: applicant.semester ? `Semester ${applicant.semester}` : "-", icon: Layers },
    { label: "Pilihan Divisi 1", value: applicant.division_choice_1, icon: Globe },
    { label: "Pilihan Divisi 2", value: applicant.division_choice_2 || "-", icon: Globe },
  ];

  const statusInfo = statusStyles[applicant.status] ?? statusStyles.pending;
  const formattedDate = applicant.created_at
    ? new Date(applicant.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/pendaftaran" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Review Pendaftar</h1>
          <p className="mt-0.5 text-xs text-slate-500">Tinjau dan proses pendaftaran anggota baru</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* Profile header */}
          <div className="flex items-center gap-4 border-b border-white/[0.04] px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white ring-2 ring-blue-500/20">
              {(applicant.full_name ?? "?").charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white">{applicant.full_name}</h2>
              <p className="text-xs text-slate-500">Didaftarkan pada {formattedDate}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${statusInfo.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2">
            {infoFields.map((field, i) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className={`flex items-center gap-3 border-b border-white/[0.03] px-6 py-4 ${i % 2 === 0 ? "sm:border-r" : ""}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">{field.label}</p>
                    <p className="truncate text-sm font-semibold text-slate-200">{field.value || "-"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivasi */}
        {applicant.motivation && (
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
              <FileText className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Motivasi Bergabung</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-slate-400">{applicant.motivation}</p>
            </div>
          </div>
        )}

        {/* Portfolio */}
        {applicant.portfolio_url && (
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
              <LinkIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Link Portofolio</h3>
            </div>
            <div className="px-6 py-5">
              <a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300">
                <Globe className="h-4 w-4" />
                {applicant.portfolio_url}
              </a>
            </div>
          </div>
        )}

        {/* Action Area */}
        <div className="overflow-hidden rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
          <div className="flex items-center gap-2 border-b border-white/[0.04] px-6 py-4">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Area Review & Keputusan</h3>
          </div>
          <div className="p-6">
            <div className="mb-5">
              <label htmlFor="catatan" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Catatan Review <span className="normal-case font-normal text-slate-700">(opsional)</span>
              </label>
              <textarea
                id="catatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tulis catatan atau alasan keputusan Anda..."
                className="admin-input w-full resize-none rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleReview("rejected")}
                disabled={isUpdating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-6 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 active:scale-[0.98] disabled:opacity-60"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Tolak Pendaftar
              </button>
              <button
                onClick={() => handleReview("accepted")}
                disabled={isUpdating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Terima Pendaftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

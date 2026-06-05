"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Hash, BookOpen, Layers, Globe, FileText, LinkIcon, CheckCircle, XCircle, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", dot: "bg-amber-500", label: "Pending" },
  accepted: { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", dot: "bg-emerald-500", label: "Accepted" },
  rejected: { bg: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400", dot: "bg-red-500", label: "Rejected" },
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
      const { data } = await supabase.from("member_registrations").select("*").eq("id", id).single();
      if (data) setApplicant(data);
      setIsLoading(false);
    }
    fetchApplicant();
  }, [id]);

  const handleReview = async (statusUpdate: "accepted" | "rejected") => {
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase.from("member_registrations").update({ status: statusUpdate, review_notes: notes || null }).eq("id", id);
    if (error) { alert(`Gagal memperbarui status: ${error.message}`); setIsUpdating(false); return; }
    alert("Status pendaftar berhasil diperbarui!");
    router.push("/admin/pendaftaran");
  };

  if (isLoading) return (<div className="flex min-h-[400px] flex-col items-center justify-center gap-3"><Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" /><p className="text-sm text-gray-400">Memuat data pendaftar...</p></div>);
  if (!applicant) return (<div className="flex min-h-[400px] flex-col items-center justify-center gap-3"><AlertTriangle className="h-7 w-7 text-amber-500" /><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Data tidak ditemukan</p><Link href="/admin/pendaftaran" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke daftar</Link></div>);

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
  const formattedDate = applicant.created_at ? new Date(applicant.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pendaftaran" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-300"><ArrowLeft className="h-4 w-4" /></Link>
        <div><h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Review Pendaftar</h1><p className="mt-0.5 text-xs text-gray-500">Tinjau dan proses pendaftaran anggota baru</p></div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">{(applicant.full_name ?? "?").charAt(0)}</div>
            <div className="min-w-0 flex-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">{applicant.full_name}</h2><p className="text-xs text-gray-400">Didaftarkan pada {formattedDate}</p></div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${statusInfo.bg}`}><span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />{statusInfo.label}</span>
          </div>
          <div className="grid sm:grid-cols-2">
            {infoFields.map((field, i) => {
              const Icon = field.icon;
              return (<div key={field.label} className={`flex items-center gap-3 border-b border-gray-50 px-6 py-4 dark:border-gray-800/50 ${i % 2 === 0 ? "sm:border-r sm:border-r-gray-50 dark:sm:border-r-gray-800/50" : ""}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800"><Icon className="h-3.5 w-3.5 text-gray-400" /></div>
                <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">{field.label}</p><p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{field.value || "-"}</p></div>
              </div>);
            })}
          </div>
        </div>

        {applicant.motivation && (<div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900"><div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 dark:border-gray-800"><FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h3 className="text-sm font-bold text-gray-900 dark:text-white">Motivasi Bergabung</h3></div><div className="px-6 py-5"><p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{applicant.motivation}</p></div></div>)}

        {applicant.portfolio_url && (<div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900"><div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 dark:border-gray-800"><LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h3 className="text-sm font-bold text-gray-900 dark:text-white">Link Portofolio</h3></div><div className="px-6 py-5"><a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"><Globe className="h-4 w-4" />{applicant.portfolio_url}</a></div></div>)}

        <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 dark:border-gray-800"><MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h3 className="text-sm font-bold text-gray-900 dark:text-white">Area Review & Keputusan</h3></div>
          <div className="p-6">
            <div className="mb-5"><label htmlFor="catatan" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Catatan Review <span className="normal-case font-normal text-gray-300 dark:text-gray-600">(opsional)</span></label><textarea id="catatan" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Tulis catatan atau alasan keputusan Anda..." className="admin-input w-full resize-none rounded-xl px-4 py-3 text-sm" /></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => handleReview("rejected")} disabled={isUpdating} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] disabled:opacity-60 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10">{isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Tolak Pendaftar</button>
              <button onClick={() => handleReview("accepted")} disabled={isUpdating} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60">{isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Terima Pendaftar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

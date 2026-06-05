"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Check, X, Filter, Loader2, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};
const statusDot: Record<string, string> = { pending: "bg-amber-500", accepted: "bg-emerald-500", rejected: "bg-red-500" };
const statusLabel: Record<string, string> = { pending: "Pending", accepted: "Accepted", rejected: "Rejected" };

export default function AdminPendaftaranPage() {
  const [pendaftar, setPendaftar] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from("member_registrations").select("*").order("created_at", { ascending: false });
      setPendaftar(data ?? []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filtered = pendaftar.filter((p) => {
    const matchStatus = filterStatus === "semua" || p.status === filterStatus;
    const matchSearch = (p.full_name ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (isLoading) {
    return (<div className="flex min-h-[400px] flex-col items-center justify-center gap-3"><Loader2 className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" /><p className="text-sm text-gray-400">Memuat data...</p></div>);
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Data Pendaftar</h1><p className="mt-1 text-sm text-gray-500">{pendaftar.length} pendaftar anggota baru TEKAD UNM</p></div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama pendaftar..." className="admin-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-input rounded-xl px-4 py-2.5 text-sm font-medium">
            <option value="semua">Semua Status</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">Nama Lengkap</th>
              <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">NIM</th>
              <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">Divisi Pilihan</th>
              <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">Status</th>
              <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (<tr><td colSpan={5} className="px-6 py-16 text-center text-sm text-gray-400">Tidak ada data pendaftar.</td></tr>) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">{(item.full_name ?? "?").charAt(0)}</div><div className="min-w-0"><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.full_name}</p><p className="text-[11px] text-gray-400">{item.email}</p></div></div></td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-500">{item.nim}</td>
                    <td className="px-6 py-4"><span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">{item.division_choice_1}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[item.status] ?? statusStyles.pending}`}><span className={`h-1.5 w-1.5 rounded-full ${statusDot[item.status] ?? statusDot.pending}`} />{statusLabel[item.status] ?? item.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/pendaftaran/${item.id}`} title="Lihat Detail" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"><Eye className="h-4 w-4" /></Link>
                        {item.phone_number && (
                          <a href={`https://wa.me/${item.phone_number.startsWith("0") ? "62" + item.phone_number.substring(1) : item.phone_number}?text=Halo%20${encodeURIComponent(item.full_name || "")},%20kami%20dari%20TEKAD%20UNM.%20Terima%20kasih%20sudah%20mendaftar!`} target="_blank" rel="noopener noreferrer" title="Hubungi via WhatsApp" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"><MessageCircle className="h-4 w-4" /></a>
                        )}
                        <button title="Terima" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"><Check className="h-4 w-4" /></button>
                        <button title="Tolak" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"><X className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-800">
          <p className="text-[11px] text-gray-400">Menampilkan {filtered.length} dari {pendaftar.length} pendaftar</p>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{pendaftar.filter((p) => p.status === "pending").length} Pending</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{pendaftar.filter((p) => p.status === "accepted").length} Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

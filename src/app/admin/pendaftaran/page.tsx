"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Check,
  X,
  UserPlus,
  Filter,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  rejected: "bg-red-50 text-red-700 ring-red-600/10",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

/* ═══════════════════════════════════════════════
   KELOLA PENDAFTARAN PAGE — Client Component (live fetch)
   ═══════════════════════════════════════════════ */

export default function AdminPendaftaranPage() {
  const [pendaftar, setPendaftar] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("member_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      setPendaftar(data ?? []);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const filtered = pendaftar.filter((p) => {
    const matchStatus =
      filterStatus === "semua" || p.status === filterStatus;
    const matchSearch = (p.full_name ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Data Pendaftar Anggota Baru
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review dan kelola pendaftaran anggota baru TEKAD UNM
        </p>
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pendaftar..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="semua">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nama Lengkap
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  NIM
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Divisi Pilihan
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Tidak ada data pendaftar.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors duration-150 hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
                          {(item.full_name ?? "?").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {item.full_name}
                          </p>
                          <p className="text-xs text-gray-400">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-mono text-gray-600">
                      {item.nim}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {item.division_choice_1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[item.status] ?? statusStyles.pending
                        }`}
                      >
                        {statusLabel[item.status] ?? item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/pendaftaran/${item.id}`}
                          title="Lihat Detail"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {/* WhatsApp Button */}
                        {item.whatsapp_number && (
                          <a
                            href={`https://wa.me/${item.whatsapp_number.startsWith("0") ? "62" + item.whatsapp_number.substring(1) : item.whatsapp_number}?text=Halo%20${encodeURIComponent(item.full_name || "")},%20kami%20dari%20TEKAD%20UNM.%20Terima%20kasih%20sudah%20mendaftar!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Hubungi via WhatsApp"
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          title="Terima"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          title="Tolak"
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-500">
            Menampilkan {filtered.length} dari {pendaftar.length} pendaftar
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {pendaftar.filter((p) => p.status === "pending").length} Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {pendaftar.filter((p) => p.status === "accepted").length} Accepted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan",
  description: "Jadwal kegiatan mendatang dan arsip kegiatan yang telah dilaksanakan oleh TEKAD UNM.",
};

export const dynamic = "force-dynamic";

export default async function KegiatanPage() {
  const supabase = createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: false });

  const allEvents = events ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allEvents.filter((e) => e.event_date && new Date(e.event_date) >= today);
  const past = allEvents.filter((e) => !e.event_date || new Date(e.event_date) < today);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-950">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Agenda</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Agenda & Kegiatan
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 sm:text-base">
              Jadwal kegiatan mendatang dan arsip kegiatan yang telah dilaksanakan oleh TEKAD UNM.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Upcoming */}
          <div className="mb-12">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Mendatang</span>
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white">{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                Belum ada kegiatan mendatang.
              </p>
            ) : (
              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100" />
                {upcoming.map((item) => (
                  <div key={item.id} className="group relative flex gap-5 pb-8">
                    <div className="relative z-10 flex shrink-0 pt-1">
                      <div className="flex h-[31px] w-[31px] items-center justify-center rounded-full border-[3px] border-blue-500 bg-white shadow-md shadow-blue-500/20">
                        <CircleDot className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/[0.04] sm:p-6">
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-600">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                        </span>
                        Mendatang
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                      {item.description && <p className="mb-4 text-sm text-gray-500">{item.description}</p>}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-blue-500" />{formatDate(item.event_date)}</span>
                        {item.event_time && <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" />{item.event_time}</span>}
                        {item.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-blue-500" />{item.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Arsip</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Past */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Selesai</span>
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">{past.length}</span>
            </div>

            {past.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">Belum ada arsip kegiatan.</p>
            ) : (
              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-gray-300 to-gray-100" />
                {past.map((item) => (
                  <div key={item.id} className="group relative flex gap-5 pb-8">
                    <div className="relative z-10 flex shrink-0 pt-1">
                      <div className="flex h-[31px] w-[31px] items-center justify-center rounded-full border-[3px] border-gray-200 bg-white shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-md sm:p-6">
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-500">
                        <CheckCircle2 className="h-3 w-3" /> Selesai
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-700">{item.title}</h3>
                      {item.description && <p className="mb-4 text-sm text-gray-400">{item.description}</p>}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(item.event_date)}</span>
                        {item.event_time && <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{item.event_time}</span>}
                        {item.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{item.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

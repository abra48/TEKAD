import type { Metadata } from "next";
import { Camera } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Galeri Kegiatan", description: "Dokumentasi visual kegiatan TEKAD — Tim Media Kreatif Administrasi Bisnis UNM." };
export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const supabase = await createClient();
  const { data: galeri } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
  const photos = galeri ?? [];

  const getSpanClass = (i: number) => { if (i === 0) return "md:col-span-2 md:row-span-2"; if (i === 4) return "md:col-span-2"; return ""; };
  const getAspectClass = (i: number) => { if (i === 0) return "aspect-square md:aspect-auto md:min-h-[400px]"; if (i === 4) return "aspect-square md:aspect-[2/1]"; return "aspect-square"; };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-white/70">Dokumentasi</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Galeri Kegiatan</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">Kumpulan momen dan dokumentasi visual dari berbagai kegiatan TEKAD UNM.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {photos.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900"><Camera className="h-10 w-10 text-gray-300 dark:text-gray-700" /><p className="text-sm text-gray-400">Belum ada foto di galeri</p></div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
                {photos.map((foto, index) => (
                  <div key={foto.id} className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 ${getSpanClass(index)} ${getAspectClass(index)}`}>
                    {foto.image_url ? (
                      <Image src={foto.image_url} alt={foto.title || "Foto galeri"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><Camera className="h-6 w-6 text-gray-300 dark:text-gray-600" /></div>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:p-5">
                      <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                        {foto.is_featured && <span className="mb-1.5 inline-block rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Featured</span>}
                        <p className="text-sm font-bold text-white sm:text-base">{foto.title}</p>
                        {foto.caption && <p className="mt-1 text-xs text-white/70 line-clamp-2">{foto.caption}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-center text-xs text-gray-400">Menampilkan {photos.length} foto dokumentasi kegiatan</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

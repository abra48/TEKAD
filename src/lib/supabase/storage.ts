import { createClient } from "@/lib/supabase/client";

/**
 * Upload file ke Supabase Storage.
 *
 * @param file     - File yang akan diupload.
 * @param bucket   - Nama bucket di Supabase Storage (misal: "thumbnails").
 * @param folder   - Subfolder di dalam bucket (misal: "news").
 * @returns URL publik file yang berhasil diupload.
 * @throws Error jika upload gagal.
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const supabase = createClient();

  // Buat nama file unik: timestamp + nama asli (tanpa spasi)
  const timestamp = Date.now();
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `${folder}/${timestamp}-${safeName}`;

  // Upload ke storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage Upload Error:", error);
    throw new Error(error.message);
  }

  // Ambil URL publik
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (!publicUrl) {
    console.error("Storage URL Error: publicUrl is empty for path:", filePath);
    throw new Error("Gagal mendapatkan URL publik file yang diupload.");
  }

  return publicUrl;
}

import { createClient } from "@/lib/supabase/client";

/**
 * Upload file ke Supabase Storage.
 *
 * @param file     - File yang akan diupload.
 * @param bucket   - Nama bucket di Supabase Storage (misal: "thumbnails").
 * @param folder   - Subfolder di dalam bucket (misal: "news").
 * @returns URL publik file yang berhasil diupload, atau `null` jika gagal.
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Buat nama file unik: timestamp + nama asli (tanpa spasi)
    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `${folder}/${timestamp}-${safeName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    // Ambil URL publik
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return null;
  }
}

import { supabase } from "./supabaseClient";
import path from "path";

/**
 * Uploads an image file to Supabase Storage and returns the public URL
 * @param file - Express Multer file object
 * @param userId - User's unique identifier
 */
export async function uploadImageToSupabase(
  file: Express.Multer.File,
  userId: string
): Promise<string> {
  const ext = path.extname(file.originalname);
  const filename = `profile-pictures/${userId}${ext}`;
  // Upload to Supabase Storage (bucket: 'profile-pictures')
  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(filename);
  if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");
  return publicUrlData.publicUrl;
}

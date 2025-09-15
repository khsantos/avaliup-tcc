import { supabase } from "./supabase";

export async function getProductImageUrl(path: string) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("images") 
    .createSignedUrl(path, 60);

  if (error) return null;
  return data.signedUrl;
}

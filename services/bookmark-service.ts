import type { SupabaseClient } from "@supabase/supabase-js";
import type { Bookmark, BookmarkInsert } from "@/types/bookmark";

export async function listBookmarks(
  supabase: SupabaseClient,
  userId: string
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, user_id, url, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Bookmark[];
}

export async function createBookmark(
  supabase: SupabaseClient,
  userId: string,
  payload: { url: string; title?: string | null }
): Promise<Bookmark> {
  const row: BookmarkInsert = {
    user_id: userId,
    url: payload.url,
    title: payload.title ?? null,
  };
  const { data, error } = await supabase
    .from("bookmarks")
    .insert(row)
    .select("id, user_id, url, title, created_at")
    .single();
  if (error) throw error;
  return data as Bookmark;
}

export async function deleteBookmark(
  supabase: SupabaseClient,
  userId: string,
  bookmarkId: string
): Promise<void> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)
    .eq("user_id", userId);
  if (error) throw error;
}

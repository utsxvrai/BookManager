import { createClient } from "@/lib/supabase/server";
import {
  listBookmarks,
  createBookmark,
  deleteBookmark,
} from "@/services/bookmark-service";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const bookmarks = await listBookmarks(supabase, user.id);
    return NextResponse.json(bookmarks);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to list bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { url?: string; title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });
  try {
    const bookmark = await createBookmark(supabase, user.id, {
      url,
      title: body.title ?? null,
    });
    return NextResponse.json(bookmark);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  try {
    await deleteBookmark(supabase, user.id, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useBookmarksRealtime } from "@/lib/useBookmarksRealtime";
import type { Bookmark } from "@/types/bookmark";

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    const handler = () => fetchBookmarks();
    window.addEventListener("bookmarks-updated", handler);
    return () => window.removeEventListener("bookmarks-updated", handler);
  }, [fetchBookmarks]);

  useBookmarksRealtime(fetchBookmarks);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/bookmarks?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <p className="text-gray-500 text-sm py-4">Loading bookmarks…</p>;
  if (error) return <p className="text-gray-600 text-sm py-4">{error}</p>;
  if (bookmarks.length === 0) return <p className="text-gray-500 text-sm py-6 text-center">No bookmarks yet. Add one in the form.</p>;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <ul className="space-y-3">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="flex items-stretch gap-4 p-4 rounded-xl border-2 border-black bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <p className="text-base font-semibold text-black leading-tight break-words" title={b.title || b.url}>
              {b.title || b.url}
            </p>
            <p className="text-sm text-gray-600 mt-1 break-all" title={b.url}>
              {b.url}
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">
              {formatDate(b.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 border-l-2 border-gray-200 pl-4">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-medium border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              Visit
            </a>
            <button
              type="button"
              onClick={() => handleCopy(b.url)}
              className="px-3 py-2 text-xs font-medium border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => handleDelete(b.id)}
              className="px-3 py-2 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
              aria-label={`Delete ${b.title || b.url}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

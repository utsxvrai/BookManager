"use client";

import { useState } from "react";

export function BookmarkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const u = url.trim();
    if (!u) {
      setError("URL is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u, title: title.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      setUrl("");
      setTitle("");
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("bookmarks-updated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-black">URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="mt-1.5 block w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
          required
        />
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black">Title (optional)</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My bookmark"
          className="mt-1.5 block w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
        />
      </div>
      {error && <p className="text-sm text-gray-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        {loading ? "Adding…" : "Add bookmark"}
      </button>
    </form>
  );
}

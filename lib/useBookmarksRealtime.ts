"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

/**
 * Subscribes to Supabase Realtime for the bookmarks table. When any row
 * changes (INSERT/UPDATE/DELETE), calls onChange so the parent can refetch.
 * RLS ensures we only receive events for the current user's rows.
 * Uses delayed cleanup so React Strict Mode (dev double-mount) doesn't close
 * the WebSocket before it connects.
 */
export function useBookmarksRealtime(onChange: () => void) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`bookmarks-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => onChangeRef.current()
      )
      .subscribe();

    return () => {
      const timer = setTimeout(() => {
        supabase.removeChannel(channel);
      }, 500);
      return () => clearTimeout(timer);
    };
  }, []);
}

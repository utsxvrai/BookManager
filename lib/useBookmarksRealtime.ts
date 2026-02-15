"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

// Realtime subscription for bookmarks; delayed cleanup avoids Strict Mode killing the WS
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

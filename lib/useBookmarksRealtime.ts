"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

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
        () => {
          onChangeRef.current();
        }
      )
      .subscribe();

    // ✅ Proper cleanup (single return)
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

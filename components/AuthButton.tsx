"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

/**
 * Client-only: Sign in with Google or Sign out + user email.
 * Uses Supabase client; router.refresh() so server components see new session.
 */
export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return <span className="text-gray-400 text-sm">…</span>;
  if (user)
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 max-w-[180px] truncate" title={user.email ?? undefined}>{user.email}</span>
        <button
          type="button"
          onClick={signOut}
          className="px-3 py-1.5 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Sign out
        </button>
      </div>
    );
  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      Sign in with Google
    </button>
  );
}

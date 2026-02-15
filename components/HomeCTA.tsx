"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { SignInDialog } from "./SignInDialog";

/**
 * If logged in: Link to dashboard. If not: button that opens SignInDialog.
 */
export function HomeCTA() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (loading) {
    return (
      <div className="mt-8 h-10 w-40 rounded-xl bg-gray-200 animate-pulse" />
    );
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="mt-8 px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Go to Dashboard
      </button>
      <SignInDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSignIn={signInWithGoogle}
      />
    </>
  );
}

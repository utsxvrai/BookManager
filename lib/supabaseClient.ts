import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components only.
 * Uses cookies so the session is available to middleware and server.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

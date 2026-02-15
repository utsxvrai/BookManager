import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Runs before each request. Refreshes Supabase session cookies, then protects
 * /dashboard: redirects to / if the user is not signed in.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

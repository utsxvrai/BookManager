import Link from "next/link";
import { AuthButton } from "./AuthButton";

/**
 * Top bar: app name, nav link, and auth (Sign in / Sign out + email).
 */
export function Navbar() {
  return (
    <nav className="bg-white border-b border-black px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-black hover:text-gray-700 transition-colors">
        Smart Bookmark
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors">
          Dashboard
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}

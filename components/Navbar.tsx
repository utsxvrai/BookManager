import Link from "next/link";
import { AuthButton } from "./AuthButton";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-black px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="font-bold text-black hover:text-gray-700 transition-colors shrink-0">
        <span className="md:hidden">SB</span>
        <span className="hidden md:inline">Smart Bookmark</span>
      </Link>
      <div className="flex items-center gap-3 md:gap-6">
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
          Dashboard
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}

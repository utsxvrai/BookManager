import { Navbar } from "@/components/Navbar";
import { HomeCTA } from "@/components/HomeCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tighter text-center">
          Smart Bookmark App
        </h1>
        <p className="mt-4 text-gray-600 text-center max-w-sm text-sm sm:text-base px-2">
          Sign in to save and sync your bookmarks across devices.
        </p>
        <HomeCTA />
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { BookmarkForm } from "@/components/BookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";

/**
 * Dashboard: requires auth. BookmarkForm + BookmarkList (with Realtime).
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 min-h-0 flex items-stretch overflow-hidden p-6 md:p-8">
        <div className="flex gap-8 w-[90%] max-w-[1400px] mx-auto min-h-0 min-w-0 flex-1">
          {/* Left: form (fixed, no scroll) */}
          <aside className="w-[320px] shrink-0 flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-black">Dashboard</h1>
            <p className="mt-1.5 text-sm text-gray-500 truncate">Signed in as {user.email}</p>
            <section className="mt-8 p-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_#000]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black mb-5">Add bookmark</h2>
              <BookmarkForm />
            </section>
          </aside>
          {/* Right: only this panel scrolls */}
          <section className="flex-1 min-w-0 flex flex-col border-2 border-black rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0_0_#000]">
            <div className="px-5 py-4 border-b-2 border-black shrink-0 bg-gray-50">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black">Your bookmarks</h2>
              <p className="text-xs text-gray-500 mt-0.5">Updates in real time.</p>
            </div>
            <div className="bookmarks-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5">
              <BookmarkList />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

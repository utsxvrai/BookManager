import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { BookmarkForm } from "@/components/BookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50 overflow-y-auto lg:overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 md:p-8 min-h-0">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px] mx-auto flex-1 min-h-0">
          {/* Left: form (sidebar - stacks on top on mobile/tablet) */}
          <aside className="w-full lg:w-[320px] shrink-0 flex flex-col">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">Dashboard</h1>
              <p className="mt-1.5 text-sm text-gray-500 truncate">Signed in as {user.email}</p>
            </div>
            
            <section className="p-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_#000]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black mb-5">Add bookmark</h2>
              <BookmarkForm />
            </section>
          </aside>

          {/* Right: bookmarks list (main content) */}
          <section className="flex-1 min-w-0 flex flex-col border-2 border-black rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0_0_#000] mb-8 lg:mb-0">
            <div className="px-5 py-4 border-b-2 border-black shrink-0 bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-black">Your bookmarks</h2>
                <p className="text-xs text-gray-500 mt-0.5">Updates in real time.</p>
              </div>
            </div>
            <div className="bookmarks-scroll flex-1 min-h-[400px] lg:min-h-0 overflow-y-auto overflow-x-hidden p-5">
              <BookmarkList />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

# Smart Bookmark App

Save and sync bookmarks with Google sign-in. Built with Next.js (App Router), Supabase (Auth + DB + Realtime), and Tailwind. Deploy on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Add a `.env` with:

- `NEXT_PUBLIC_SUPABASE_URL` – from Supabase → Settings → API  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – same place  

## Setup (Supabase)

1. **Project & DB** – New project at [supabase.com](https://supabase.com). In SQL Editor, run the contents of `supabase/schema.sql`. If the last line (Realtime publication) errors, turn on Realtime for the `bookmarks` table under Database → Replication.
2. **Google OAuth** – In Google Cloud Console create an OAuth 2.0 Web client. In Supabase: Authentication → Providers → Google, enable and paste Client ID + Secret. Under URL Configuration set Site URL and add redirect URL `http://localhost:3000/auth/callback` (and your production URL later).
3. **Realtime** – If the list doesn’t update live, check Database → Replication and ensure `bookmarks` is in the `supabase_realtime` publication.

## Problems I ran into and how I fixed them

**1. Making the app realtime**  
Supabase Realtime uses a WebSocket. In dev, React Strict Mode mounts components twice, so the first subscription was torn down before the WebSocket connected and I got “WebSocket is closed before the connection is established.” I fixed it by: (a) giving each subscription a unique channel name so the second mount didn’t conflict, (b) delaying the cleanup (e.g. 500ms) so the first connection could establish, and (c) keeping the callback in a ref so the effect didn’t depend on it and re-run. I also added a custom event when a bookmark is added from the form so the list refetches immediately in the same tab, instead of relying only on Realtime.

**2. Next.js config file**  
The app failed to start with `next.config.ts` and the error said that format wasn’t supported. I switched to `next.config.js` and used CommonJS (`module.exports`) so the dev server would pick it up. After that, the project ran normally.
